# Postman Collection Generator

This script generates a comprehensive Postman collection for the POS & Warehouse API, organized by modules.

## Features

- **Modular Organization**: Endpoints are grouped by functional modules
- **Authentication Ready**: Pre-configured with Bearer token authentication
- **Sample Data**: Includes realistic request bodies and parameters
- **Environment Variables**: Uses Postman variables for easy configuration
- **Test Scripts**: Includes basic test scripts for common validations

## Generated Modules

The collection includes the following modules:

1. **Authentication** (8 endpoints)
   - User registration, login, logout
   - Token refresh and validation
   - Password change and profile management

2. **User Management** (10 endpoints)
   - CRUD operations for users
   - Profile management
   - Role-based filtering and search

3. **Bank Management** (8 endpoints)
   - CRUD operations for banks
   - Search and statistics

4. **Branch Management** (9 endpoints)
   - CRUD operations for branches
   - Price type filtering
   - Search and statistics

5. **Color Management** (8 endpoints)
   - CRUD operations for colors
   - Search and statistics

6. **Phone Management** (10 endpoints)
   - CRUD operations for phones
   - Brand and color filtering
   - Search and statistics

7. **Reimbursement Types** (8 endpoints)
   - CRUD operations for reimbursement types
   - Search and statistics

8. **Cek Giro Fail Status** (8 endpoints)
   - CRUD operations for check failure statuses
   - Search and statistics

9. **User Permissions** (9 endpoints)
   - CRUD operations for user permissions
   - User and permission-based filtering
   - Search and statistics

## Usage

### Generate Collection

```bash
# Using npm script
npm run postman

# Or directly
node scripts/generate-postman-collection.js
```

### Customize Base URL

You can customize the base URL by setting an environment variable:

```bash
# For development
BASE_URL=http://localhost:8000 npm run postman

# For production
BASE_URL=https://api.yourdomain.com npm run postman
```

### Import into Postman

1. Open Postman
2. Click "Import" button
3. Select the generated `postman-collection.json` file
4. The collection will be imported with all modules and endpoints

## Configuration

### Environment Variables

The collection uses the following environment variables:

- `base_url`: The base URL of your API (default: `http://localhost:8000`)
- `access_token`: Your JWT access token for authentication

### Setting Up Authentication

1. After importing the collection, go to the collection settings
2. In the "Variables" tab, set your `access_token` value
3. Or set it in your Postman environment variables

### Getting an Access Token

1. Use the "Login User" endpoint in the Authentication module
2. Send a POST request with your credentials
3. Copy the `access_token` from the response
4. Set it as the `access_token` variable in Postman

## Collection Structure

```
POS & Warehouse API
├── Authentication
│   ├── Register User
│   ├── Login User
│   ├── Refresh Token
│   ├── Logout User
│   ├── Change Password
│   ├── Get Current User
│   ├── Revoke All Tokens
│   └── Validate Token
├── User Management
│   ├── Get User Profile
│   ├── Update User Profile
│   ├── Create User
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Update User
│   ├── Delete User
│   ├── Get Users by Role
│   ├── Get User Statistics
│   └── Search Users
├── Bank Management
│   ├── Create Bank
│   ├── Get All Banks
│   ├── Get Bank by ID
│   ├── Get Bank by Code
│   ├── Update Bank
│   ├── Delete Bank
│   ├── Get Bank Statistics
│   └── Search Banks
└── ... (other modules)
```

## Request Features

### Authentication
- Bearer token authentication is pre-configured
- Token is automatically included in requests that require authentication

### Request Bodies
- Sample JSON data is included for POST/PUT requests
- Data is realistic and follows the API schema

### Query Parameters
- Pagination parameters (page, limit)
- Search parameters
- Filter parameters specific to each module

### Path Variables
- ID parameters for individual resource operations
- Code parameters for code-based lookups

## Test Scripts

The collection includes basic test scripts that:

1. Verify status codes (200 or 201 for successful operations)
2. Check for the `success` property in responses
3. Can be extended for more specific validations

## Customization

### Adding New Endpoints

To add new endpoints, modify the `modules` object in `scripts/generate-postman-collection.js`:

```javascript
{
  name: 'New Endpoint',
  method: 'POST',
  path: '/new-endpoint',
  description: 'Description of the endpoint',
  auth: 'Bearer Token', // or omit for public endpoints
  body: {
    mode: 'raw',
    raw: JSON.stringify({
      // your sample data
    }, null, 2),
    options: {
      raw: {
        language: 'json'
      }
    }
  }
}
```

### Modifying Base Configuration

You can modify the base configuration at the top of the script:

```javascript
const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const API_PREFIX = '/api';
const OUTPUT_FILE = 'postman-collection.json';
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Make sure the `access_token` variable is set correctly
2. **404 Errors**: Verify the base URL is correct
3. **Import Issues**: Ensure the JSON file is valid and complete

### Regenerating Collection

If you make changes to your API routes, regenerate the collection:

```bash
npm run postman
```

This will overwrite the existing collection with updated endpoints.

## Support

For issues or questions about the Postman collection generator:

1. Check the generated collection structure
2. Verify your API endpoints match the expected format
3. Ensure all required environment variables are set

## File Location

- **Script**: `scripts/generate-postman-collection.js`
- **Generated Collection**: `postman-collection.json`
- **Documentation**: `POSTMAN_COLLECTION.md`
