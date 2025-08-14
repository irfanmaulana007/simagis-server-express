#!/usr/bin/env node

/**
 * Postman Collection Generator
 * Generates a Postman collection grouped by modules from the API routes
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const API_PREFIX = '/api';
const OUTPUT_FILE = 'postman-collection.json';

// Environment configurations
const environments = {
  local: {
    name: 'Local',
    description: 'Local development environment',
    variables: [
      {
        key: 'BASE_API_URL',
        value: 'http://localhost:8000',
        type: 'string',
        description: 'Base API URL for local development'
      },
      {
        key: 'AUTH_TOKEN',
        value: '',
        type: 'string',
        description: 'Authentication token (auto-filled after login)'
      }
    ]
  },
  staging: {
    name: 'Staging',
    description: 'Staging environment',
    variables: [
      {
        key: 'BASE_API_URL',
        value: 'https://staging-api.simagis.com',
        type: 'string',
        description: 'Base API URL for staging environment'
      },
      {
        key: 'AUTH_TOKEN',
        value: '',
        type: 'string',
        description: 'Authentication token (auto-filled after login)'
      }
    ]
  },
  production: {
    name: 'Production',
    description: 'Production environment',
    variables: [
      {
        key: 'BASE_API_URL',
        value: 'https://api.simagis.com',
        type: 'string',
        description: 'Base API URL for production environment'
      },
      {
        key: 'AUTH_TOKEN',
        value: '',
        type: 'string',
        description: 'Authentication token (auto-filled after login)'
      }
    ]
  }
};

// Module definitions with their routes and descriptions
const modules = {
  auth: {
    name: 'Authentication',
    description: 'User authentication and authorization endpoints',
    routes: [
      {
        name: 'Login User',
        method: 'POST',
        path: '/login',
        description: 'Authenticate user and get access token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            email: 'john@example.com',
            password: 'password123'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        },
        event: [
          {
            listen: 'test',
            script: {
              type: 'text/javascript',
              exec: [
                '// Parse the response JSON',
                'let res = pm.response.json();',
                '',
                '// Check if token exists and set it to environment',
                'if (res?.data?.tokens.accessToken) {',
                '    pm.environment.set("AUTH_TOKEN", res.data.tokens.accessToken);',
                '    console.log("✅ Token stored to environment as \'AUTH_TOKEN\'");',
                '} else {',
                '    console.log("❌ Token not found in response");',
                '}'
              ]
            }
          }
        ]
      },
      {
        name: 'Register User',
        method: 'POST',
        path: '/register',
        description: 'Register a new user account',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'password123',
            phone: '+1234567890',
            address: '123 Main St',
            role: 'ANGGOTA'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Refresh Token',
        method: 'POST',
        path: '/refresh',
        description: 'Refresh access token using refresh token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            refreshToken: 'your-refresh-token-here'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Logout User',
        method: 'POST',
        path: '/logout',
        description: 'Logout user and invalidate tokens',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            refreshToken: 'your-refresh-token-here'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Change Password',
        method: 'POST',
        path: '/change-password',
        description: 'Change user password',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            currentPassword: 'oldpassword123',
            newPassword: 'newpassword123'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Get Current User',
        method: 'GET',
        path: '/me',
        description: 'Get current authenticated user profile',
        auth: 'Bearer Token'
      },
      {
        name: 'Revoke All Tokens',
        method: 'POST',
        path: '/revoke-all',
        description: 'Revoke all tokens for the current user',
        auth: 'Bearer Token'
      },
      {
        name: 'Validate Token',
        method: 'GET',
        path: '/validate',
        description: 'Validate current access token',
        auth: 'Bearer Token'
      }
    ]
  },
  users: {
    name: 'User Management',
    description: 'User management and profile operations',
    routes: [
      {
        name: 'Get All Users',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of users',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' },
          { key: 'role', value: '', description: 'Filter by role' }
        ]
      },
      {
        name: 'Get User by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get user by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User ID' }
        ]
      },
      {
        name: 'Create User',
        method: 'POST',
        path: '/',
        description: 'Create a new user (Admin only)',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'New User',
            email: 'newuser@example.com',
            username: 'newuser',
            password: 'password123',
            phone: '+1234567890',
            address: '123 Main St',
            role: 'ANGGOTA'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update User',
        method: 'PUT',
        path: '/:id',
        description: 'Update user by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Updated Name',
            email: 'updated@example.com',
            phone: '+1234567890',
            address: 'Updated Address',
            role: 'ANGGOTA'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete User',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete user by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User ID' }
        ]
      },
      {
        name: 'Get User Profile',
        method: 'GET',
        path: '/profile',
        description: 'Get current user profile',
        auth: 'Bearer Token'
      },
      {
        name: 'Update User Profile',
        method: 'PUT',
        path: '/profile',
        description: 'Update current user profile',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Updated Name',
            phone: '+1234567890',
            address: 'Updated Address'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update User',
        method: 'PUT',
        path: '/:id',
        description: 'Update user by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            name: 'Updated Name',
            email: 'updated@example.com',
            phone: '+1234567890',
            address: 'Updated Address',
            role: 'ANGGOTA'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete User',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete user by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User ID' }
        ]
      },
      {
        name: 'Get Users by Role',
        method: 'GET',
        path: '/role/:role',
        description: 'Get users filtered by role',
        auth: 'Bearer Token',
        variable: [
          { key: 'role', value: 'ANGGOTA', description: 'User role' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      },
      {
        name: 'Get User Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get user statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Users',
        method: 'GET',
        path: '/search',
        description: 'Search users',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'john', description: 'Search query' },
          { key: 'role', value: '', description: 'Filter by role' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  banks: {
    name: 'Bank Management',
    description: 'Bank management operations',
    routes: [
      {
        name: 'Get All Banks',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of banks',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Bank by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get bank by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Bank ID' }
        ]
      },
      {
        name: 'Create Bank',
        method: 'POST',
        path: '/',
        description: 'Create a new bank',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'BCA',
            name: 'Bank Central Asia',
            description: 'Bank Central Asia Tbk'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Bank',
        method: 'PUT',
        path: '/:id',
        description: 'Update bank by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Bank ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'BCA',
            name: 'Bank Central Asia Updated',
            description: 'Updated description'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Bank',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete bank by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Bank ID' }
        ]
      },
      {
        name: 'Get Bank by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get bank by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'BCA', description: 'Bank code' }
        ]
      },
      {
        name: 'Get Bank Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get bank statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Banks',
        method: 'GET',
        path: '/search',
        description: 'Search banks',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'BCA', description: 'Search query' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  branches: {
    name: 'Branch Management',
    description: 'Branch management operations',
    routes: [
      {
        name: 'Get All Branches',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of branches',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' },
          { key: 'priceType', value: '', description: 'Filter by price type' }
        ]
      },
      {
        name: 'Get Branch by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get branch by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Branch ID' }
        ]
      },
      {
        name: 'Create Branch',
        method: 'POST',
        path: '/',
        description: 'Create a new branch',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'BR001',
            name: 'Main Branch',
            address: '123 Main Street',
            phone: '+1234567890',
            priceType: 'RETAIL'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Branch',
        method: 'PUT',
        path: '/:id',
        description: 'Update branch by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Branch ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'BR001',
            name: 'Updated Branch Name',
            address: 'Updated Address',
            phone: '+1234567890',
            priceType: 'RETAIL'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Branch',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete branch by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Branch ID' }
        ]
      },
      {
        name: 'Get Branch by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get branch by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'BR001', description: 'Branch code' }
        ]
      },
      {
        name: 'Get Branches by Price Type',
        method: 'GET',
        path: '/price-type/:priceType',
        description: 'Get branches filtered by price type',
        auth: 'Bearer Token',
        variable: [
          { key: 'priceType', value: 'RETAIL', description: 'Price type (RETAIL/WHOLESALE)' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Branch Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get branch statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Branches',
        method: 'GET',
        path: '/search',
        description: 'Search branches',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'main', description: 'Search query' },
          { key: 'priceType', value: '', description: 'Filter by price type' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  colors: {
    name: 'Color Management',
    description: 'Color management operations',
    routes: [
      {
        name: 'Get All Colors',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of colors',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Color by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get color by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Color ID' }
        ]
      },
      {
        name: 'Create Color',
        method: 'POST',
        path: '/',
        description: 'Create a new color',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'RED',
            name: 'Red',
            description: 'Bright red color'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Color',
        method: 'PUT',
        path: '/:id',
        description: 'Update color by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Color ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'RED',
            name: 'Updated Red',
            description: 'Updated description'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Color',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete color by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Color ID' }
        ]
      },
      {
        name: 'Get Color by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get color by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'RED', description: 'Color code' }
        ]
      },
      {
        name: 'Get Color Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get color statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Colors',
        method: 'GET',
        path: '/search',
        description: 'Search colors',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'red', description: 'Search query' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  phones: {
    name: 'Phone Management',
    description: 'Phone management operations',
    routes: [
      {
        name: 'Get All Phones',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of phones',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' },
          { key: 'brand', value: '', description: 'Filter by brand' },
          { key: 'color', value: '', description: 'Filter by color' }
        ]
      },
      {
        name: 'Get Phone by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get phone by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Phone ID' }
        ]
      },
      {
        name: 'Create Phone',
        method: 'POST',
        path: '/',
        description: 'Create a new phone',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'PH001',
            name: 'iPhone 15',
            brand: 'Apple',
            model: 'iPhone 15',
            color: 'Black',
            storage: '128GB',
            price: 999.99
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Phone',
        method: 'PUT',
        path: '/:id',
        description: 'Update phone by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Phone ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'PH001',
            name: 'iPhone 15 Updated',
            brand: 'Apple',
            model: 'iPhone 15',
            color: 'White',
            storage: '256GB',
            price: 1099.99
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Phone',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete phone by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Phone ID' }
        ]
      },
      {
        name: 'Get Phone by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get phone by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'PH001', description: 'Phone code' }
        ]
      },
      {
        name: 'Get Phones by Brand',
        method: 'GET',
        path: '/brand/:brand',
        description: 'Get phones filtered by brand',
        auth: 'Bearer Token',
        variable: [
          { key: 'brand', value: 'Apple', description: 'Phone brand' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Phones by Color',
        method: 'GET',
        path: '/color/:color',
        description: 'Get phones filtered by color',
        auth: 'Bearer Token',
        variable: [
          { key: 'color', value: 'Black', description: 'Phone color' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Phone Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get phone statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Phones',
        method: 'GET',
        path: '/search',
        description: 'Search phones',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'iPhone', description: 'Search query' },
          { key: 'brand', value: '', description: 'Filter by brand' },
          { key: 'color', value: '', description: 'Filter by color' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  reimbursementTypes: {
    name: 'Reimbursement Types',
    description: 'Reimbursement type management operations',
    routes: [
      {
        name: 'Get All Reimbursement Types',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of reimbursement types',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Reimbursement Type by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get reimbursement type by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Reimbursement Type ID' }
        ]
      },
      {
        name: 'Create Reimbursement Type',
        method: 'POST',
        path: '/',
        description: 'Create a new reimbursement type',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'RT001',
            name: 'Transportation',
            description: 'Transportation reimbursement'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Reimbursement Type',
        method: 'PUT',
        path: '/:id',
        description: 'Update reimbursement type by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Reimbursement Type ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'RT001',
            name: 'Updated Transportation',
            description: 'Updated description'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Reimbursement Type',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete reimbursement type by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Reimbursement Type ID' }
        ]
      },
      {
        name: 'Get Reimbursement Type by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get reimbursement type by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'RT001', description: 'Reimbursement Type code' }
        ]
      },
      {
        name: 'Get Reimbursement Type Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get reimbursement type statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Reimbursement Types',
        method: 'GET',
        path: '/search',
        description: 'Search reimbursement types',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'transport', description: 'Search query' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  cekGiroFailStatus: {
    name: 'Cek Giro Fail Status',
    description: 'Cek Giro fail status management operations',
    routes: [
      {
        name: 'Get All Cek Giro Fail Statuses',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of cek giro fail statuses',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' }
        ]
      },
      {
        name: 'Get Cek Giro Fail Status by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get cek giro fail status by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Cek Giro Fail Status ID' }
        ]
      },
      {
        name: 'Create Cek Giro Fail Status',
        method: 'POST',
        path: '/',
        description: 'Create a new cek giro fail status',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'CGFS001',
            name: 'Failed Check',
            description: 'Failed check status'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update Cek Giro Fail Status',
        method: 'PUT',
        path: '/:id',
        description: 'Update cek giro fail status by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Cek Giro Fail Status ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            code: 'CGFS001',
            name: 'Updated Failed Check',
            description: 'Updated description'
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete Cek Giro Fail Status',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete cek giro fail status by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Cek Giro Fail Status ID' }
        ]
      },
      {
        name: 'Get Cek Giro Fail Status by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get cek giro fail status by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'CGFS001', description: 'Cek Giro Fail Status code' }
        ]
      },
      {
        name: 'Get Cek Giro Fail Status Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get cek giro fail status statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search Cek Giro Fail Statuses',
        method: 'GET',
        path: '/search',
        description: 'Search cek giro fail statuses',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'failed', description: 'Search query' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  },
  userPermissions: {
    name: 'User Permissions',
    description: 'User permission management operations',
    routes: [
      {
        name: 'Get All User Permissions',
        method: 'GET',
        path: '/',
        description: 'Get paginated list of user permissions',
        auth: 'Bearer Token',
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'search', value: '', description: 'Search term' },
          { key: 'userId', value: '', description: 'Filter by user ID' },
          { key: 'permissionId', value: '', description: 'Filter by permission ID' }
        ]
      },
      {
        name: 'Get User Permission by ID',
        method: 'GET',
        path: '/:id',
        description: 'Get user permission by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User Permission ID' }
        ]
      },
      {
        name: 'Create User Permission',
        method: 'POST',
        path: '/',
        description: 'Create a new user permission',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            userId: 1,
            permissionId: 1,
            granted: true
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Update User Permission',
        method: 'PUT',
        path: '/:id',
        description: 'Update user permission by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User Permission ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({
            userId: 1,
            permissionId: 1,
            granted: false
          }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      },
      {
        name: 'Delete User Permission',
        method: 'DELETE',
        path: '/:id',
        description: 'Delete user permission by ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'User Permission ID' }
        ]
      },
      {
        name: 'Get User Permissions by User ID',
        method: 'GET',
        path: '/user/:userId',
        description: 'Get permissions for a specific user',
        auth: 'Bearer Token',
        variable: [
          { key: 'userId', value: '1', description: 'User ID' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      },
      {
        name: 'Get User Permissions by Permission ID',
        method: 'GET',
        path: '/permission/:permissionId',
        description: 'Get users with a specific permission',
        auth: 'Bearer Token',
        variable: [
          { key: 'permissionId', value: '1', description: 'Permission ID' }
        ],
        query: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      },
      {
        name: 'Get User Permission Statistics',
        method: 'GET',
        path: '/stats',
        description: 'Get user permission statistics',
        auth: 'Bearer Token'
      },
      {
        name: 'Search User Permissions',
        method: 'GET',
        path: '/search',
        description: 'Search user permissions',
        auth: 'Bearer Token',
        query: [
          { key: 'q', value: 'admin', description: 'Search query' },
          { key: 'userId', value: '', description: 'Filter by user ID' },
          { key: 'permissionId', value: '', description: 'Filter by permission ID' },
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' }
        ]
      }
    ]
  }
};

// Utility functions
function createAuthHeader(authType) {
  if (authType === 'Bearer Token') {
    return {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{AUTH_TOKEN}}',
          type: 'string'
        }
      ]
    };
  }
  return undefined;
}

function createQueryParams(query) {
  if (!query) return [];
  
  return query.map(param => ({
    key: param.key,
    value: param.value,
    description: param.description,
    disabled: param.value === ''
  }));
}

function createPathVariables(variable) {
  if (!variable) return [];
  
  return variable.map(param => ({
    key: param.key,
    value: param.value,
    description: param.description
  }));
}

function createRequest(request, modulePath) {
  const url = {
    raw: `{{BASE_API_URL}}${API_PREFIX}${modulePath}${request.path}`,
    host: ['{{BASE_API_URL}}'],
    path: `${API_PREFIX}${modulePath}${request.path}`.split('/').filter(Boolean)
  };

  const requestConfig = {
    name: request.name,
    request: {
      method: request.method,
      header: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      url: url,
      description: request.description
    }
  };

  // Add authentication if required
  if (request.auth) {
    requestConfig.request.auth = createAuthHeader(request.auth);
  }

  // Add body if present
  if (request.body) {
    requestConfig.request.body = request.body;
  }

  // Add query parameters if present
  if (request.query) {
    requestConfig.request.url.query = createQueryParams(request.query);
  }

  // Add path variables if present
  if (request.variable) {
    requestConfig.request.url.variable = createPathVariables(request.variable);
  }

  // Add event scripts if present (for login post-response)
  if (request.event) {
    requestConfig.event = request.event;
  }

  return requestConfig;
}

function createFolder(moduleKey, moduleConfig) {
  const folder = {
    name: moduleConfig.name,
    description: moduleConfig.description,
    item: moduleConfig.routes.map(route => createRequest(route, `/${moduleKey}`))
  };

  return folder;
}

// Generate the collection
function generateCollection() {
  const collection = {
    info: {
      name: 'Simagis API',
      description: 'RESTful API service for Simagis management system',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      _postman_id: generateUUID()
    },
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '{{AUTH_TOKEN}}',
          type: 'string'
        }
      ]
    },
    event: [
      {
        listen: 'prerequest',
        script: {
          type: 'text/javascript',
          exec: [
            '// Set default headers',
            'pm.request.headers.add({',
            '    key: \'Content-Type\',',
            '    value: \'application/json\'',
            '});'
          ]
        }
      },
      {
        listen: 'test',
        script: {
          type: 'text/javascript',
          exec: [
            '// Common test script',
            'pm.test("Status code is 200 or 201", function () {',
            '    pm.expect(pm.response.code).to.be.oneOf([200, 201]);',
            '});',
            '',
            'pm.test("Response has success property", function () {',
            '    const jsonData = pm.response.json();',
            '    pm.expect(jsonData).to.have.property(\'success\');',
            '});'
          ]
        }
      }
    ],
    variable: [],
    item: Object.keys(modules).map(moduleKey => createFolder(moduleKey, modules[moduleKey]))
  };

  return collection;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate environment files
function generateEnvironment(envKey, envConfig) {
  return {
    id: generateUUID(),
    name: envConfig.name,
    values: envConfig.variables.map(variable => ({
      key: variable.key,
      value: variable.value,
      type: variable.type,
      description: variable.description
    })),
    _postman_variable_scope: 'environment',
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: 'Postman/10.0.0'
  };
}

// Main execution
function main() {
  try {
    console.log('🚀 Generating Postman collection and environments...');
    
    const collection = generateCollection();
    
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    
    // Write collection to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collection, null, 2));
    
    // Generate and write environment files
    const environmentFiles = [];
    Object.keys(environments).forEach(envKey => {
      const envConfig = environments[envKey];
      const environment = generateEnvironment(envKey, envConfig);
      const envFileName = `postman-environment-${envKey}.json`;
      const envFilePath = path.join(scriptsDir, envFileName);
      
      fs.writeFileSync(envFilePath, JSON.stringify(environment, null, 2));
      environmentFiles.push(envFileName);
    });
    
    console.log(`✅ Postman collection generated successfully!`);
    console.log(`📁 Collection file: ${OUTPUT_FILE}`);
    console.log(`📊 Total modules: ${Object.keys(modules).length}`);
    console.log(`🔗 Total endpoints: ${Object.values(modules).reduce((total, module) => total + module.routes.length, 0)}`);
    console.log('');
    console.log('🌍 Environment files generated:');
    environmentFiles.forEach(file => {
      console.log(`   • ${file}`);
    });
    console.log('');
    console.log('📋 Modules included:');
    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      console.log(`   • ${module.name} (${module.routes.length} endpoints)`);
    });
    console.log('');
    console.log('📖 Usage:');
    console.log('   1. Import the collection JSON file into Postman');
    console.log('   2. Import the environment JSON files into Postman');
    console.log('   3. Select the appropriate environment (Local/Staging/Production)');
    console.log('   4. Run the "Login User" request to automatically set AUTH_TOKEN');
    console.log('   5. Start testing your API endpoints!');
    console.log('');
    console.log('🔧 Environment Variables:');
    console.log('   • BASE_API_URL: Base URL for the API (different for each environment)');
    console.log('   • AUTH_TOKEN: Authentication token (auto-filled after login)');
    
  } catch (error) {
    console.error('❌ Error generating Postman collection:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateCollection, modules };
