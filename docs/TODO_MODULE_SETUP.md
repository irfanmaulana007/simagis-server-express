# TODO: Module Setup for Prisma Schema Tables

This document outlines the complete to-do list for setting up all modules (controllers, services, routes, and tests) for tables defined in the Prisma schema. The setup follows dependency order to ensure proper implementation.

## Current Status

✅ **Completed Modules:**

- Bank (controller, service, routes)
- Branch (controller, service, routes)
- Color (controller, service, routes)
- ReimbursementType (controller, service, routes)
- User (controller, service, routes)
- CekGiroFailStatus (controller, service, routes)
- Phone (controller, service, routes)
- UserPermission (controller, service, routes)
- AccountNumber (controller, service, routes)
- CekGiro (controller, service, routes)
- CekGiroOwner (controller, service, routes)
- ExpenseCategory (controller, service, routes)
- Member (controller, service, routes)
- ProductCategory (controller, service, routes)
- Supplier (controller, service, routes)
- UserBranchDetail (controller, service, routes)
- UserRefreshToken (controller, service, routes)
- CekGiroDetail (controller, service, routes)
- Product (controller, service, routes)
- SupplierDiscount (controller, service, routes)
- CashRegister (controller, service, routes)
- Closing (controller, service, routes)
- Deposit (controller, service, routes)
- Expense (controller, service, routes)
- ProductDetail (controller, service, routes)
- Promo (controller, service, routes)
- StockOpname (controller, service, routes)

## Level 1: Independent Tables (No Dependencies)

### 1. CekGiroFailStatus ✅

- [x] **Controller**: `src/controllers/cekGiroFailStatusController.ts`
- [x] **Service**: `src/services/cekGiroFailStatusService.ts`
- [x] **Routes**: `src/routes/cekGiroFailStatus.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 2. Phone ✅

- [x] **Controller**: `src/controllers/phoneController.ts`
- [x] **Service**: `src/services/phoneService.ts`
- [x] **Routes**: `src/routes/phones.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 3. UserPermission ✅

- [x] **Controller**: `src/controllers/userPermissionController.ts`
- [x] **Service**: `src/services/userPermissionService.ts`
- [x] **Routes**: `src/routes/userPermissions.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 2: Tables with Level 1 Dependencies

### 4. AccountNumber ✅

- [x] **Controller**: `src/controllers/accountNumberController.ts`
- [x] **Service**: `src/services/accountNumberService.ts`
- [x] **Routes**: `src/routes/accountNumbers.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 5. CekGiro ✅

- [x] **Controller**: `src/controllers/cekGiroController.ts`
- [x] **Service**: `src/services/cekGiroService.ts`
- [x] **Routes**: `src/routes/cekGiros.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 6. CekGiroOwner ✅

- [x] **Controller**: `src/controllers/cekGiroOwnerController.ts`
- [x] **Service**: `src/services/cekGiroOwnerService.ts`
- [x] **Routes**: `src/routes/cekGiroOwners.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 7. ExpenseCategory ✅

- [x] **Controller**: `src/controllers/expenseCategoryController.ts`
- [x] **Service**: `src/services/expenseCategoryService.ts`
- [x] **Routes**: `src/routes/expenseCategories.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 8. Member ✅

- [x] **Controller**: `src/controllers/memberController.ts`
- [x] **Service**: `src/services/memberService.ts`
- [x] **Routes**: `src/routes/members.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 9. ProductCategory ✅

- [x] **Controller**: `src/controllers/productCategoryController.ts`
- [x] **Service**: `src/services/productCategoryService.ts`
- [x] **Routes**: `src/routes/productCategories.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 10. Supplier ✅

- [x] **Controller**: `src/controllers/supplierController.ts`
- [x] **Service**: `src/services/supplierService.ts`
- [x] **Routes**: `src/routes/suppliers.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 11. UserBranchDetail ✅

- [x] **Controller**: `src/controllers/userBranchDetailController.ts`
- [x] **Service**: `src/services/userBranchDetailService.ts`
- [x] **Routes**: `src/routes/userBranchDetails.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 12. UserRefreshToken ✅

- [x] **Controller**: `src/controllers/userRefreshTokenController.ts`
- [x] **Service**: `src/services/userRefreshTokenService.ts`
- [x] **Routes**: `src/routes/userRefreshTokens.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 3: Tables with Level 2 Dependencies ✅

### 13. CekGiroDetail ✅

- [x] **Controller**: `src/controllers/cekGiroDetailController.ts`
- [x] **Service**: `src/services/cekGiroDetailService.ts`
- [x] **Routes**: `src/routes/cekGiroDetails.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 14. Product ✅

- [x] **Controller**: `src/controllers/productController.ts`
- [x] **Service**: `src/services/productService.ts`
- [x] **Routes**: `src/routes/products.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 15. SupplierDiscount ✅

- [x] **Controller**: `src/controllers/supplierDiscountController.ts`
- [x] **Service**: `src/services/supplierDiscountService.ts`
- [x] **Routes**: `src/routes/supplierDiscounts.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 16. CashRegister ✅

- [x] **Controller**: `src/controllers/cashRegisterController.ts`
- [x] **Service**: `src/services/cashRegisterService.ts`
- [x] **Routes**: `src/routes/cashRegisters.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 17. Closing ✅

- [x] **Controller**: `src/controllers/closingController.ts`
- [x] **Service**: `src/services/closingService.ts`
- [x] **Routes**: `src/routes/closings.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 18. Deposit ✅

- [x] **Controller**: `src/controllers/depositController.ts`
- [x] **Service**: `src/services/depositService.ts`
- [x] **Routes**: `src/routes/deposits.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 19. Expense ✅

- [x] **Controller**: `src/controllers/expenseController.ts`
- [x] **Service**: `src/services/expenseService.ts`
- [x] **Routes**: `src/routes/expenses.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 4: Tables with Level 3 Dependencies ✅

### 20. ProductDetail ✅

- [x] **Controller**: `src/controllers/productDetailController.ts`
- [x] **Service**: `src/services/productDetailService.ts`
- [x] **Routes**: `src/routes/productDetails.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 21. Promo ✅

- [x] **Controller**: `src/controllers/promoController.ts`
- [x] **Service**: `src/services/promoService.ts`
- [x] **Routes**: `src/routes/promos.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

### 22. StockOpname ✅

- [x] **Controller**: `src/controllers/stockOpnameController.ts`
- [x] **Service**: `src/services/stockOpnameService.ts`
- [x] **Routes**: `src/routes/stockOpnames.ts`
- [x] **Types**: Add to `src/types/index.ts`
- [x] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 5: Tables with Level 4 Dependencies

### 23. StockOpnameDetail

- [ ] **Controller**: `src/controllers/stockOpnameDetailController.ts`
- [ ] **Service**: `src/services/stockOpnameDetailService.ts`
- [ ] **Routes**: `src/routes/stockOpnameDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 24. Order

- [ ] **Controller**: `src/controllers/orderController.ts`
- [ ] **Service**: `src/services/orderService.ts`
- [ ] **Routes**: `src/routes/orders.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 25. Restock

- [ ] **Controller**: `src/controllers/restockController.ts`
- [ ] **Service**: `src/services/restockService.ts`
- [ ] **Routes**: `src/routes/restocks.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 6: Tables with Level 5 Dependencies

### 26. OrderDetail

- [ ] **Controller**: `src/controllers/orderDetailController.ts`
- [ ] **Service**: `src/services/orderDetailService.ts`
- [ ] **Routes**: `src/routes/orderDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 27. OrderDiscount

- [ ] **Controller**: `src/controllers/orderDiscountController.ts`
- [ ] **Service**: `src/services/orderDiscountService.ts`
- [ ] **Routes**: `src/routes/orderDiscounts.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 28. Payment

- [ ] **Controller**: `src/controllers/paymentController.ts`
- [ ] **Service**: `src/services/paymentService.ts`
- [ ] **Routes**: `src/routes/payments.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 29. PaymentBilling

- [ ] **Controller**: `src/controllers/paymentBillingController.ts`
- [ ] **Service**: `src/services/paymentBillingService.ts`
- [ ] **Routes**: `src/routes/paymentBillings.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 30. Refund

- [ ] **Controller**: `src/controllers/refundController.ts`
- [ ] **Service**: `src/services/refundService.ts`
- [ ] **Routes**: `src/routes/refunds.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 31. RestockDetail

- [ ] **Controller**: `src/controllers/restockDetailController.ts`
- [ ] **Service**: `src/services/restockDetailService.ts`
- [ ] **Routes**: `src/routes/restockDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 32. RestockPayment

- [ ] **Controller**: `src/controllers/restockPaymentController.ts`
- [ ] **Service**: `src/services/restockPaymentService.ts`
- [ ] **Routes**: `src/routes/restockPayments.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 7: Tables with Level 6 Dependencies

### 33. RefundDetail

- [ ] **Controller**: `src/controllers/refundDetailController.ts`
- [ ] **Service**: `src/services/refundDetailService.ts`
- [ ] **Routes**: `src/routes/refundDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

## Additional Setup Tasks

### Route Registration

- [x] Register all new routes in `src/app.ts`
- [x] Update route prefixes and middleware as needed

### Common Schemas

- [ ] Add common validation schemas to `src/utils/validation.ts` for:
  - [ ] ModuleEnum validation
  - [ ] StatusEnum validation
  - [ ] PaymentMethodEnum validation
  - [ ] PaymentTypeEnum validation
  - [ ] RefundMethodEnum validation
  - [ ] PriceTypeEnum validation

### Type Definitions

- [ ] Add all enum types to `src/types/index.ts`
- [ ] Add comprehensive type definitions for all request/response objects
- [ ] Add list query interfaces for pagination and filtering

### Documentation

- [ ] Update API documentation
- [ ] Add JSDoc comments to all new controllers and services
- [ ] Create README updates for new modules

## Implementation Guidelines

### Code Structure

- Follow the existing patterns from Bank, Branch, Color, ReimbursementType, and User modules
- Use consistent naming conventions
- Implement proper error handling with custom errors
- Use asyncHandler for all controller methods
- Implement proper validation with Zod schemas
- Use proper TypeScript types throughout

### Controller Pattern

- Implement CRUD operations (Create, Read, Update, Delete)
- Add list/search functionality with pagination
- Add statistics endpoints where appropriate
- Use proper HTTP status codes
- Return consistent response format

### Service Pattern

- Implement business logic
- Handle database operations with Prisma
- Implement proper error handling
- Add validation logic
- Handle foreign key constraints

### Route Pattern

- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Implement authentication and authorization
- Add validation middleware
- Use proper route naming conventions

## Priority Order

1. Start with Level 1 modules (CekGiroFailStatus, Phone, UserPermission)
2. Move to Level 2 modules
3. Continue through dependency levels
4. Complete all modules before moving to additional setup tasks

## Notes

- Each module should be implemented completely (controller, service, routes) before moving to the next
- Follow the existing code patterns strictly for consistency
- Ensure proper error handling and validation

- Update this document as modules are completed
