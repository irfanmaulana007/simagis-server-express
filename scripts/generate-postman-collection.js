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

// Helper to create standard CRUD routes
function createCrudRoutes(resourceName, resourceNamePlural, sampleBody, additionalRoutes = []) {
  const routes = [
    {
      name: `Get All ${resourceNamePlural}`,
      method: 'GET',
      path: '/',
      description: `Get paginated list of ${resourceNamePlural.toLowerCase()} with search and filtering capabilities`,
      auth: 'Bearer Token',
      query: [
        { key: 'page', value: '1', description: 'Page number' },
        { key: 'limit', value: '10', description: 'Items per page' },
        { key: 'search', value: '', description: 'Search term' },
        { key: 'sortBy', value: 'createdAt', description: 'Sort by field' },
        { key: 'sortOrder', value: 'desc', description: 'Sort order (asc, desc)' }
      ]
    },
    {
      name: `Get ${resourceName} by ID`,
      method: 'GET',
      path: '/:id',
      description: `Get ${resourceName.toLowerCase()} by ID`,
      auth: 'Bearer Token',
      variable: [
        { key: 'id', value: '1', description: `${resourceName} ID` }
      ]
    },
    {
      name: `Create ${resourceName}`,
      method: 'POST',
      path: '/',
      description: `Create a new ${resourceName.toLowerCase()}`,
      auth: 'Bearer Token',
      body: {
        mode: 'raw',
        raw: JSON.stringify(sampleBody, null, 2),
        options: {
          raw: {
            language: 'json'
          }
        }
      }
    },
    {
      name: `Update ${resourceName}`,
      method: 'PUT',
      path: '/:id',
      description: `Update ${resourceName.toLowerCase()} by ID`,
      auth: 'Bearer Token',
      variable: [
        { key: 'id', value: '1', description: `${resourceName} ID` }
      ],
      body: {
        mode: 'raw',
        raw: JSON.stringify(sampleBody, null, 2),
        options: {
          raw: {
            language: 'json'
          }
        }
      }
    },
    {
      name: `Delete ${resourceName}`,
      method: 'DELETE',
      path: '/:id',
      description: `Delete ${resourceName.toLowerCase()} by ID`,
      auth: 'Bearer Token',
      variable: [
        { key: 'id', value: '1', description: `${resourceName} ID` }
      ]
    },
    ...additionalRoutes
  ];
  return routes;
}

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
            email: 'superadmin@gmail.com',
            password: 'asdf'
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
                '    console.log("Token stored to environment as \'AUTH_TOKEN\'");',
                '} else {',
                '    console.log("Token not found in response");',
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
    routes: createCrudRoutes('User', 'Users', {
      name: 'New User',
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
      phone: '+1234567890',
      address: '123 Main St',
      role: 'ANGGOTA'
    }, [
      {
        name: 'Get Users by Role',
        method: 'GET',
        path: '/role/:role',
        description: 'Get users filtered by role',
        auth: 'Bearer Token',
        variable: [
          { key: 'role', value: 'ANGGOTA', description: 'User role' }
        ]
      }
    ])
  },
  banks: {
    name: 'Bank Management',
    description: 'Bank management operations',
    routes: createCrudRoutes('Bank', 'Banks', {
      code: 'NEW',
      name: 'New Bank'
    }, [
      {
        name: 'Get Bank by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get bank by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: '014', description: 'Bank code' }
        ]
      }
    ])
  },
  branches: {
    name: 'Branch Management',
    description: 'Branch management operations',
    routes: createCrudRoutes('Branch', 'Branches', {
      code: 'NEW',
      name: 'New Branch',
      address: '123 New Street',
      phone: '021-1234567',
      priceType: 'ECER',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25
    }, [
      {
        name: 'Get Branch by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get branch by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'JKT', description: 'Branch code' }
        ]
      }
    ])
  },
  colors: {
    name: 'Color Management',
    description: 'Color management operations',
    routes: createCrudRoutes('Color', 'Colors', {
      code: 'NEW',
      name: 'New Color'
    }, [
      {
        name: 'Get Color by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get color by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'BLK', description: 'Color code' }
        ]
      }
    ])
  },
  phones: {
    name: 'Phone Management',
    description: 'Phone management operations',
    routes: createCrudRoutes('Phone', 'Phones', {
      module: 'MEMBER',
      ownerCode: 'MBRJKT000000001',
      phone: '081234567890'
    }, [
      {
        name: 'Get Phones by Owner',
        method: 'GET',
        path: '/owner/:ownerCode',
        description: 'Get phones by owner code',
        auth: 'Bearer Token',
        variable: [
          { key: 'ownerCode', value: 'MBRJKT000000001', description: 'Owner code' }
        ]
      },
      {
        name: 'Get Phones by Module',
        method: 'GET',
        path: '/module/:module',
        description: 'Get phones by module',
        auth: 'Bearer Token',
        variable: [
          { key: 'module', value: 'MEMBER', description: 'Module name' }
        ]
      }
    ])
  },
  accountNumbers: {
    name: 'Account Number Management',
    description: 'Bank account number management operations',
    routes: createCrudRoutes('Account Number', 'Account Numbers', {
      module: 'GENERAL',
      bankCode: '014',
      ownerCode: 'USRJKT0001',
      accountName: 'Account Name',
      accountNumber: '1234567890'
    }, [
      {
        name: 'Get Account Numbers by Owner',
        method: 'GET',
        path: '/owner/:ownerCode',
        description: 'Get account numbers by owner code',
        auth: 'Bearer Token',
        variable: [
          { key: 'ownerCode', value: 'USRJKT0001', description: 'Owner code' }
        ]
      },
      {
        name: 'Get Account Numbers by Module',
        method: 'GET',
        path: '/module/:module',
        description: 'Get account numbers by module',
        auth: 'Bearer Token',
        variable: [
          { key: 'module', value: 'GENERAL', description: 'Module name' }
        ]
      }
    ])
  },
  reimbursementTypes: {
    name: 'Reimbursement Types',
    description: 'Reimbursement type management operations',
    routes: createCrudRoutes('Reimbursement Type', 'Reimbursement Types', {
      code: 'NEW',
      name: 'New Reimbursement Type'
    }, [
      {
        name: 'Get Reimbursement Type by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get reimbursement type by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'TRP', description: 'Reimbursement type code' }
        ]
      }
    ])
  },
  cekGiroFailStatus: {
    name: 'Cek Giro Fail Status',
    description: 'Cek Giro fail status management operations',
    routes: createCrudRoutes('Cek Giro Fail Status', 'Cek Giro Fail Statuses', {
      code: 'NEW',
      name: 'New Fail Status'
    }, [
      {
        name: 'Get Cek Giro Fail Status by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get cek giro fail status by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'ISF', description: 'Fail status code' }
        ]
      }
    ])
  },
  userPermissions: {
    name: 'User Permissions',
    description: 'User permission management operations',
    routes: createCrudRoutes('User Permission', 'User Permissions', {
      role: 'KASIR',
      menu: 'Transaction',
      subMenu: 'TransactionSales',
      view: true,
      create: true,
      update: false,
      delete: false
    }, [
      {
        name: 'Get Permissions by Role',
        method: 'GET',
        path: '/role/:role',
        description: 'Get permissions by role',
        auth: 'Bearer Token',
        variable: [
          { key: 'role', value: 'KASIR', description: 'User role' }
        ]
      },
      {
        name: 'Bulk Create Permissions',
        method: 'POST',
        path: '/bulk',
        description: 'Create multiple permissions at once',
        auth: 'Bearer Token',
        body: {
          mode: 'raw',
          raw: JSON.stringify([
            { role: 'KASIR', menu: 'Transaction', subMenu: 'TransactionSales', view: true, create: true, update: false, delete: false }
          ], null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      }
    ])
  },
  userBranchDetails: {
    name: 'User Branch Details',
    description: 'User branch assignment management',
    routes: createCrudRoutes('User Branch Detail', 'User Branch Details', {
      branchCode: 'JKT',
      userCode: 'USRJKT0001'
    }, [
      {
        name: 'Get by User Code',
        method: 'GET',
        path: '/user/:userCode',
        description: 'Get branch details by user code',
        auth: 'Bearer Token',
        variable: [
          { key: 'userCode', value: 'USRJKT0001', description: 'User code' }
        ]
      },
      {
        name: 'Get by Branch Code',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get user details by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      }
    ])
  },
  userRefreshTokens: {
    name: 'User Refresh Tokens',
    description: 'User refresh token management',
    routes: [
      {
        name: 'Get All Refresh Tokens',
        method: 'GET',
        path: '/',
        description: 'Get all refresh tokens',
        auth: 'Bearer Token'
      },
      {
        name: 'Get Tokens by User',
        method: 'GET',
        path: '/user/:userId',
        description: 'Get refresh tokens by user ID',
        auth: 'Bearer Token',
        variable: [
          { key: 'userId', value: '1', description: 'User ID' }
        ]
      },
      {
        name: 'Revoke Token',
        method: 'DELETE',
        path: '/:id',
        description: 'Revoke a specific refresh token',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Token ID' }
        ]
      },
      {
        name: 'Revoke All User Tokens',
        method: 'DELETE',
        path: '/user/:userId',
        description: 'Revoke all tokens for a user',
        auth: 'Bearer Token',
        variable: [
          { key: 'userId', value: '1', description: 'User ID' }
        ]
      }
    ]
  },
  expenseCategories: {
    name: 'Expense Categories',
    description: 'Expense category management operations',
    routes: createCrudRoutes('Expense Category', 'Expense Categories', {
      code: 'EXPNEW0001',
      branchCode: 'JKT',
      name: 'New Expense Category'
    }, [
      {
        name: 'Get by Branch Code',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get expense categories by branch',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      }
    ])
  },
  members: {
    name: 'Member Management',
    description: 'Member/customer management operations',
    routes: createCrudRoutes('Member', 'Members', {
      code: 'MBRNEW00000001',
      branchCode: 'JKT',
      name: 'New Member',
      location: 'Address location',
      email: 'member@example.com',
      debt: 0,
      debtLimit: 5000000
    }, [
      {
        name: 'Get Members by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get members by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get Member by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get member by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'MBRJKT000000001', description: 'Member code' }
        ]
      }
    ])
  },
  suppliers: {
    name: 'Supplier Management',
    description: 'Supplier management operations',
    routes: createCrudRoutes('Supplier', 'Suppliers', {
      code: 'SUPNEW00000001',
      branchCode: 'JKT',
      name: 'New Supplier',
      address: 'Supplier Address'
    }, [
      {
        name: 'Get Suppliers by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get suppliers by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get Supplier by Code',
        method: 'GET',
        path: '/code/:code',
        description: 'Get supplier by code',
        auth: 'Bearer Token',
        variable: [
          { key: 'code', value: 'SUPJKT00000001', description: 'Supplier code' }
        ]
      }
    ])
  },
  supplierDiscounts: {
    name: 'Supplier Discounts',
    description: 'Supplier discount management operations',
    routes: createCrudRoutes('Supplier Discount', 'Supplier Discounts', {
      code: 'SDNEW00000001',
      supplierCode: 'SUPJKT00000001',
      name: 'New Discount',
      percentage: 5,
      validDate: '2025-12-31'
    }, [
      {
        name: 'Get Discounts by Supplier',
        method: 'GET',
        path: '/supplier/:supplierCode',
        description: 'Get discounts by supplier code',
        auth: 'Bearer Token',
        variable: [
          { key: 'supplierCode', value: 'SUPJKT00000001', description: 'Supplier code' }
        ]
      }
    ])
  },
  productCategories: {
    name: 'Product Categories',
    description: 'Product category management operations',
    routes: createCrudRoutes('Product Category', 'Product Categories', {
      code: 'CATNEW00000001',
      branchCode: 'JKT',
      name: 'New Category',
      depreciationYear1: 10,
      depreciationYear2: 15,
      depreciationYear3: 20,
      depreciationYear4: 25
    }, [
      {
        name: 'Get Categories by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get product categories by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      }
    ])
  },
  products: {
    name: 'Product Management',
    description: 'Product management operations',
    routes: createCrudRoutes('Product', 'Products', {
      code: 'PRDNEW00000001',
      branchCode: 'JKT',
      productCategoryCode: 'CATJKT00000001',
      name: 'New Product'
    }, [
      {
        name: 'Get Products by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get products by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get Products by Category',
        method: 'GET',
        path: '/category/:categoryCode',
        description: 'Get products by category code',
        auth: 'Bearer Token',
        variable: [
          { key: 'categoryCode', value: 'CATJKT00000001', description: 'Category code' }
        ]
      }
    ])
  },
  productDetails: {
    name: 'Product Details',
    description: 'Product detail/variant management operations',
    routes: createCrudRoutes('Product Detail', 'Product Details', {
      status: 'GENERAL_ACTIVE',
      code: 'PDTNEW00000001',
      productCode: 'PRDJKT00000001',
      colorCode: 'BLK',
      supplierCode: 'SUPJKT00000001',
      article: 'ART-001',
      size: '40',
      purchasePrice: 200000,
      salesPrice: 350000,
      wholesalePrice: 300000,
      stock: 50,
      purchaseDate: '2025-01-01'
    }, [
      {
        name: 'Get Details by Product',
        method: 'GET',
        path: '/product/:productCode',
        description: 'Get product details by product code',
        auth: 'Bearer Token',
        variable: [
          { key: 'productCode', value: 'PRDJKT00000001', description: 'Product code' }
        ]
      },
      {
        name: 'Get Details by Supplier',
        method: 'GET',
        path: '/supplier/:supplierCode',
        description: 'Get product details by supplier code',
        auth: 'Bearer Token',
        variable: [
          { key: 'supplierCode', value: 'SUPJKT00000001', description: 'Supplier code' }
        ]
      },
      {
        name: 'Update Stock',
        method: 'PATCH',
        path: '/:id/stock',
        description: 'Update product detail stock',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Product Detail ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({ stock: 100 }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      }
    ])
  },
  promos: {
    name: 'Promo Management',
    description: 'Promotion management operations',
    routes: createCrudRoutes('Promo', 'Promos', {
      status: 'GENERAL_ACTIVE',
      code: 'PRMNEW00000001',
      branchCode: 'JKT',
      name: 'New Promo',
      termsAndCondition: 'Terms and conditions apply',
      percentage: 10,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    }, [
      {
        name: 'Get Promos by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get promos by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get Active Promos',
        method: 'GET',
        path: '/active',
        description: 'Get all active promos',
        auth: 'Bearer Token'
      }
    ])
  },
  cekGiros: {
    name: 'Cek/Giro Management',
    description: 'Check and giro management operations',
    routes: createCrudRoutes('Cek/Giro', 'Cek/Giros', {
      type: 'CEK',
      code: 'CG-NEW-0001',
      accountNumber: '1234567890',
      date: '2025-01-15'
    }, [
      {
        name: 'Get by Type',
        method: 'GET',
        path: '/type/:type',
        description: 'Get cek/giro by type (CEK or GIRO)',
        auth: 'Bearer Token',
        variable: [
          { key: 'type', value: 'CEK', description: 'Type (CEK or GIRO)' }
        ]
      }
    ])
  },
  cekGiroDetails: {
    name: 'Cek/Giro Details',
    description: 'Cek/giro detail management operations',
    routes: createCrudRoutes('Cek/Giro Detail', 'Cek/Giro Details', {
      code: 'CGD-NEW-0001',
      cekGiroCode: 'CG-JKT-2025-0001',
      accountNumber: '1234567890',
      accountName: 'Account Name',
      amount: 10000000,
      receiverName: 'Receiver Name',
      receiverPhone: '081234567890',
      disbursementDate: '2025-02-15',
      handoverDate: '2025-01-15',
      note: 'Payment note'
    }, [
      {
        name: 'Get Details by Cek/Giro',
        method: 'GET',
        path: '/cekgiro/:cekGiroCode',
        description: 'Get details by cek/giro code',
        auth: 'Bearer Token',
        variable: [
          { key: 'cekGiroCode', value: 'CG-JKT-2025-0001', description: 'Cek/Giro code' }
        ]
      }
    ])
  },
  cekGiroOwners: {
    name: 'Cek/Giro Owners',
    description: 'Cek/giro owner assignment operations',
    routes: createCrudRoutes('Cek/Giro Owner', 'Cek/Giro Owners', {
      cekGiroCode: 'CG-JKT-2025-0001',
      userCode: 'USRJKT0002'
    }, [
      {
        name: 'Get by Cek/Giro',
        method: 'GET',
        path: '/cekgiro/:cekGiroCode',
        description: 'Get owners by cek/giro code',
        auth: 'Bearer Token',
        variable: [
          { key: 'cekGiroCode', value: 'CG-JKT-2025-0001', description: 'Cek/Giro code' }
        ]
      },
      {
        name: 'Get by User',
        method: 'GET',
        path: '/user/:userCode',
        description: 'Get cek/giro by user code',
        auth: 'Bearer Token',
        variable: [
          { key: 'userCode', value: 'USRJKT0002', description: 'User code' }
        ]
      }
    ])
  },
  stockOpnames: {
    name: 'Stock Opname',
    description: 'Stock opname/inventory count operations',
    routes: createCrudRoutes('Stock Opname', 'Stock Opnames', {
      code: 'SO-NEW-0001',
      status: 'GENERAL_ACTIVE',
      branchCode: 'JKT',
      year: 2025,
      month: 1,
      createdBy: 'USRJKT0006',
      updatedBy: 'USRJKT0006'
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get stock opnames by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Period',
        method: 'GET',
        path: '/period/:year/:month',
        description: 'Get stock opnames by year and month',
        auth: 'Bearer Token',
        variable: [
          { key: 'year', value: '2025', description: 'Year' },
          { key: 'month', value: '1', description: 'Month' }
        ]
      }
    ])
  },
  cashRegisters: {
    name: 'Cash Register',
    description: 'Cash register/opening balance operations',
    routes: createCrudRoutes('Cash Register', 'Cash Registers', {
      code: 'CR-NEW-0001',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: '2025-01-01',
      amount: 5000000,
      p100000: 30,
      p50000: 20,
      p20000: 25,
      p10000: 20,
      p5000: 10
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get cash registers by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by User',
        method: 'GET',
        path: '/user/:userCode',
        description: 'Get cash registers by user code',
        auth: 'Bearer Token',
        variable: [
          { key: 'userCode', value: 'USRJKT0004', description: 'User code' }
        ]
      },
      {
        name: 'Get by Date',
        method: 'GET',
        path: '/date/:date',
        description: 'Get cash registers by date',
        auth: 'Bearer Token',
        variable: [
          { key: 'date', value: '2025-01-01', description: 'Date (YYYY-MM-DD)' }
        ]
      }
    ])
  },
  closings: {
    name: 'Closing',
    description: 'Daily closing/end of day operations',
    routes: createCrudRoutes('Closing', 'Closings', {
      code: 'CL-NEW-0001',
      branchCode: 'JKT',
      userCode: 'USRJKT0004',
      date: '2025-01-01',
      amount: 8500000,
      debit: 500000,
      p100000: 50,
      p50000: 40,
      p20000: 30
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get closings by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Date',
        method: 'GET',
        path: '/date/:date',
        description: 'Get closings by date',
        auth: 'Bearer Token',
        variable: [
          { key: 'date', value: '2025-01-01', description: 'Date (YYYY-MM-DD)' }
        ]
      }
    ])
  },
  deposits: {
    name: 'Deposit Management',
    description: 'Deposit/bank setoran operations',
    routes: createCrudRoutes('Deposit', 'Deposits', {
      code: 'DP-NEW-0001',
      status: 'DEPOSIT_SENT',
      branchCode: 'JKT',
      userCode: 'USRJKT0003',
      date: '2025-01-01',
      amount: 10000000,
      note: 'Daily deposit'
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get deposits by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Status',
        method: 'GET',
        path: '/status/:status',
        description: 'Get deposits by status',
        auth: 'Bearer Token',
        variable: [
          { key: 'status', value: 'DEPOSIT_SENT', description: 'Deposit status' }
        ]
      },
      {
        name: 'Update Status',
        method: 'PATCH',
        path: '/:id/status',
        description: 'Update deposit status',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Deposit ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({ status: 'DEPOSIT_RECEIVED' }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      }
    ])
  },
  expenses: {
    name: 'Expense Management',
    description: 'Expense/pengeluaran operations',
    routes: createCrudRoutes('Expense', 'Expenses', {
      code: 'EXP-NEW-0001',
      branchCode: 'JKT',
      expenseCategoryCode: 'EXPJKT0001',
      userCode: 'USRJKT0003',
      date: '2025-01-01',
      amount: 500000,
      description: 'Expense description'
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get expenses by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Category',
        method: 'GET',
        path: '/category/:categoryCode',
        description: 'Get expenses by category code',
        auth: 'Bearer Token',
        variable: [
          { key: 'categoryCode', value: 'EXPJKT0001', description: 'Expense category code' }
        ]
      },
      {
        name: 'Get by Date Range',
        method: 'GET',
        path: '/range',
        description: 'Get expenses by date range',
        auth: 'Bearer Token',
        query: [
          { key: 'startDate', value: '2025-01-01', description: 'Start date' },
          { key: 'endDate', value: '2025-01-31', description: 'End date' },
          { key: 'branchCode', value: 'JKT', description: 'Branch code (optional)' }
        ]
      }
    ])
  },
  orders: {
    name: 'Order Management',
    description: 'Sales order operations',
    routes: createCrudRoutes('Order', 'Orders', {
      code: 'ORD-NEW-0001',
      branchCode: 'JKT',
      memberCode: 'MBRJKT000000001',
      userCode: 'USRJKT0004',
      promoCode: null,
      totalPrice: 500000,
      paymentType: 'LUNAS'
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get orders by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Member',
        method: 'GET',
        path: '/member/:memberCode',
        description: 'Get orders by member code',
        auth: 'Bearer Token',
        variable: [
          { key: 'memberCode', value: 'MBRJKT000000001', description: 'Member code' }
        ]
      },
      {
        name: 'Get by Date Range',
        method: 'GET',
        path: '/range',
        description: 'Get orders by date range',
        auth: 'Bearer Token',
        query: [
          { key: 'startDate', value: '2025-01-01', description: 'Start date' },
          { key: 'endDate', value: '2025-01-31', description: 'End date' }
        ]
      }
    ])
  },
  payments: {
    name: 'Payment Management',
    description: 'Order payment operations',
    routes: createCrudRoutes('Payment', 'Payments', {
      code: 'PAY-NEW-0001',
      orderCode: 'ORD-JKT-20250101001',
      paymentMethod: 'TUNAI',
      customerAmount: 500000,
      amount: 500000
    }, [
      {
        name: 'Get by Order',
        method: 'GET',
        path: '/order/:orderCode',
        description: 'Get payments by order code',
        auth: 'Bearer Token',
        variable: [
          { key: 'orderCode', value: 'ORD-JKT-20250101001', description: 'Order code' }
        ]
      },
      {
        name: 'Get by Payment Method',
        method: 'GET',
        path: '/method/:paymentMethod',
        description: 'Get payments by payment method',
        auth: 'Bearer Token',
        variable: [
          { key: 'paymentMethod', value: 'TUNAI', description: 'Payment method' }
        ]
      }
    ])
  },
  paymentBillings: {
    name: 'Payment Billings',
    description: 'Member debt payment operations',
    routes: createCrudRoutes('Payment Billing', 'Payment Billings', {
      code: 'PB-NEW-0001',
      memberCode: 'MBRJKT000000001',
      userCode: 'USRJKT0005',
      paymentMethod: 'TUNAI',
      amount: 500000,
      discount: 0
    }, [
      {
        name: 'Get by Member',
        method: 'GET',
        path: '/member/:memberCode',
        description: 'Get payment billings by member code',
        auth: 'Bearer Token',
        variable: [
          { key: 'memberCode', value: 'MBRJKT000000001', description: 'Member code' }
        ]
      }
    ])
  },
  refunds: {
    name: 'Refund Management',
    description: 'Order refund operations',
    routes: createCrudRoutes('Refund', 'Refunds', {
      code: 'REF-NEW-0001',
      orderCode: 'ORD-JKT-20250101001',
      userCode: 'USRJKT0004'
    }, [
      {
        name: 'Get by Order',
        method: 'GET',
        path: '/order/:orderCode',
        description: 'Get refunds by order code',
        auth: 'Bearer Token',
        variable: [
          { key: 'orderCode', value: 'ORD-JKT-20250101001', description: 'Order code' }
        ]
      }
    ])
  },
  restocks: {
    name: 'Restock Management',
    description: 'Restock/purchase order operations',
    routes: createCrudRoutes('Restock', 'Restocks', {
      code: 'RST-NEW-0001',
      status: 'RESTOCK_WAITING_FOR_REVIEW',
      branchCode: 'JKT',
      userCode: 'USRJKT0006',
      supplierCode: 'SUPJKT00000001',
      supplierDiscountCode: null,
      purchaseDate: '2025-01-10',
      note: 'Restock order',
      paymentStatus: 'RESTOCK_DEBT'
    }, [
      {
        name: 'Get by Branch',
        method: 'GET',
        path: '/branch/:branchCode',
        description: 'Get restocks by branch code',
        auth: 'Bearer Token',
        variable: [
          { key: 'branchCode', value: 'JKT', description: 'Branch code' }
        ]
      },
      {
        name: 'Get by Supplier',
        method: 'GET',
        path: '/supplier/:supplierCode',
        description: 'Get restocks by supplier code',
        auth: 'Bearer Token',
        variable: [
          { key: 'supplierCode', value: 'SUPJKT00000001', description: 'Supplier code' }
        ]
      },
      {
        name: 'Get by Status',
        method: 'GET',
        path: '/status/:status',
        description: 'Get restocks by status',
        auth: 'Bearer Token',
        variable: [
          { key: 'status', value: 'RESTOCK_WAITING_FOR_REVIEW', description: 'Restock status' }
        ]
      },
      {
        name: 'Update Status',
        method: 'PATCH',
        path: '/:id/status',
        description: 'Update restock status',
        auth: 'Bearer Token',
        variable: [
          { key: 'id', value: '1', description: 'Restock ID' }
        ],
        body: {
          mode: 'raw',
          raw: JSON.stringify({ status: 'RESTOCK_RECEIVED' }, null, 2),
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      }
    ])
  },
  restockDetails: {
    name: 'Restock Details',
    description: 'Restock detail/line item operations',
    routes: createCrudRoutes('Restock Detail', 'Restock Details', {
      code: 'RSTD-NEW-0001',
      restockCode: 'RST-JKT-20250110001',
      productDetailCode: 'PDTJKT00000001',
      quantity: 20
    }, [
      {
        name: 'Get by Restock',
        method: 'GET',
        path: '/restock/:restockCode',
        description: 'Get details by restock code',
        auth: 'Bearer Token',
        variable: [
          { key: 'restockCode', value: 'RST-JKT-20250110001', description: 'Restock code' }
        ]
      }
    ])
  },
  restockPayments: {
    name: 'Restock Payments',
    description: 'Restock payment operations',
    routes: createCrudRoutes('Restock Payment', 'Restock Payments', {
      code: 'RSTP-NEW-0001',
      restockCode: 'RST-JKT-20250110001',
      paymentMethod: 'TRANSFER',
      amount: 5000000,
      discount: 0,
      cekGiroDetailCode: null
    }, [
      {
        name: 'Get by Restock',
        method: 'GET',
        path: '/restock/:restockCode',
        description: 'Get payments by restock code',
        auth: 'Bearer Token',
        variable: [
          { key: 'restockCode', value: 'RST-JKT-20250110001', description: 'Restock code' }
        ]
      }
    ])
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
      description: 'RESTful API service for Simagis POS & Warehouse management system',
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
    console.log('Generating Postman collection and environments...');

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

    console.log(`Postman collection generated successfully!`);
    console.log(`Collection file: ${OUTPUT_FILE}`);
    console.log(`Total modules: ${Object.keys(modules).length}`);
    console.log(`Total endpoints: ${Object.values(modules).reduce((total, module) => total + module.routes.length, 0)}`);
    console.log('');
    console.log('Environment files generated:');
    environmentFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('');
    console.log('Modules included:');
    Object.keys(modules).forEach(moduleKey => {
      const module = modules[moduleKey];
      console.log(`   - ${module.name} (${module.routes.length} endpoints)`);
    });
    console.log('');
    console.log('Usage:');
    console.log('   1. Import the collection JSON file into Postman');
    console.log('   2. Import the environment JSON files into Postman');
    console.log('   3. Select the appropriate environment (Local/Staging/Production)');
    console.log('   4. Run the "Login User" request to automatically set AUTH_TOKEN');
    console.log('   5. Start testing your API endpoints!');

  } catch (error) {
    console.error('Error generating Postman collection:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateCollection, modules };
