# Search Routes Consolidation

## Overview

This document describes the consolidation of search functionality into the main "get all" routes, removing the need for separate search endpoints.

## Changes Made

### Routes Removed

The following search routes have been removed from all modules:

- `GET /api/users/search` → Use `GET /api/users?search=...`
- `GET /api/banks/search` → Use `GET /api/banks?search=...`
- `GET /api/branches/search` → Use `GET /api/branches?search=...`
- `GET /api/phones/search` → Use `GET /api/phones?search=...`
- `GET /api/reimbursement-types/search` → Use `GET /api/reimbursement-types?search=...`
- `GET /api/user-permissions/search` → Use `GET /api/user-permissions?search=...`
- `GET /api/colors/search` → Use `GET /api/colors?search=...`
- `GET /api/cek-giro-fail-statuses/search` → Use `GET /api/cek-giro-fail-statuses?search=...`

### Controllers Updated

The following search methods have been removed from controllers:

- `UserController.searchUsers`
- `BankController.searchBanks`
- `BranchController.searchBranches`
- `PhoneController.searchPhones`
- `ReimbursementTypeController.searchReimbursementTypes`
- `UserPermissionController.searchUserPermissions`
- `ColorController.searchColors`
- `CekGiroFailStatusController.searchCekGiroFailStatuses`

## Search Functionality

All "get all" routes now support search functionality through the `search` query parameter:

### Example Usage

```bash
# Search users by name, email, username, or code
GET /api/users?search=john

# Search banks by name or code
GET /api/banks?search=mandiri

# Search branches by name or code
GET /api/branches?search=jakarta

# Search phones by phone number or owner code
GET /api/phones?search=08123456789

# Search reimbursement types by name or code
GET /api/reimbursement-types?search=transport

# Search user permissions by role
GET /api/user-permissions?search=admin

# Search colors by name or code
GET /api/colors?search=red

# Search cek giro fail statuses by name or code
GET /api/cek-giro-fail-statuses?search=failed
```

### Search Parameters

All search functionality supports:

- **Pagination**: `page` and `limit` parameters
- **Sorting**: `sortBy` and `sortOrder` parameters
- **Module-specific filters**: Additional filters like `role`, `priceType`, `module`, etc.

### Example with Multiple Parameters

```bash
# Search users with role filter and pagination
GET /api/users?search=john&role=STAFF&page=1&limit=10&sortBy=name&sortOrder=asc

# Search branches with price type filter
GET /api/branches?search=jakarta&priceType=REGULAR&page=1&limit=20
```

## Benefits

1. **Simplified API**: Fewer endpoints to maintain and document
2. **Consistent Interface**: All modules follow the same pattern
3. **Better Performance**: No duplicate logic between search and list endpoints
4. **Easier Client Integration**: Clients only need to use one endpoint per module
5. **Reduced Code Duplication**: Search logic is centralized in the main service methods

## Backward Compatibility

This change is **not backward compatible**. Clients using the old search endpoints will need to be updated to use the main "get all" routes with the `search` parameter.

## Migration Guide

### Before (Old Search Endpoints)
```javascript
// Old way
const response = await fetch('/api/users/search?q=john&page=1&limit=10');
```

### After (New Consolidated Endpoints)
```javascript
// New way
const response = await fetch('/api/users?search=john&page=1&limit=10');
```

### Key Changes
1. Replace `/search` endpoint with the main resource endpoint
2. Change query parameter from `q` to `search`
3. All other query parameters remain the same

## Postman Collection Updates

The Postman collection generator (`scripts/generate-postman-collection.js`) has been updated to reflect these changes:

### Changes Made to Postman Collection

1. **Removed Search Routes**: All separate search endpoints have been removed from the collection
2. **Updated "Get All" Routes**: Enhanced descriptions and query parameters for all "get all" routes
3. **Improved Query Parameters**: Added detailed descriptions for search and filtering parameters
4. **Updated Examples**: Provided realistic example values for search terms

### Updated Route Examples

#### Users
```bash
GET /api/users?search=john&role=ANGGOTA&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Banks
```bash
GET /api/banks?search=BCA&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Branches
```bash
GET /api/branches?search=jakarta&priceType=REGULAR&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### Phones
```bash
GET /api/phones?search=iPhone&module=SALES&ownerCode=OWNER001&page=1&limit=10&sortBy=phone&sortOrder=asc
```

#### User Permissions
```bash
GET /api/user-permissions?search=admin&role=SUPER_ADMIN&menu=USERS&subMenu=CREATE&page=1&limit=10&sortBy=role&sortOrder=asc
```

### Regenerating the Collection

To regenerate the updated Postman collection:

```bash
node scripts/generate-postman-collection.js
```

This will create:
- `postman-collection.json` - Updated collection with consolidated search functionality
- `postman-environment-local.json` - Local environment
- `postman-environment-staging.json` - Staging environment  
- `postman-environment-production.json` - Production environment

## Implementation Details

### Services
All service methods (`getUsers`, `getBanks`, `getBranches`, etc.) already supported search functionality through the `search` parameter in their query objects.

### Validation
All validation schemas already included the `search` parameter as an optional string.

### Types
All list query types already included the `search?: string` property.

### Search Logic
Search functionality uses the `PaginationUtils.createTextSearchFilter()` utility to create database queries that search across multiple fields:

- **Users**: name, email, username, code
- **Banks**: name, code
- **Branches**: name, code
- **Phones**: phone, ownerCode
- **Reimbursement Types**: name, code
- **User Permissions**: role (limited search capability)
- **Colors**: name, code
- **Cek Giro Fail Statuses**: name, code
