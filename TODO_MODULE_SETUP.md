# TODO: Module Setup for Prisma Schema Tables

This document outlines the complete to-do list for setting up all modules (controllers, services, routes, and tests) for tables defined in the Prisma schema. The setup follows dependency order to ensure proper implementation.

## Current Status

✅ **Completed Modules:**

- Bank (controller, service, routes)
- Branch (controller, service, routes)
- Color (controller, service, routes)
- ReimbursementType (controller, service, routes)
- User (controller, service, routes)

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

### 4. AccountNumber

- [ ] **Controller**: `src/controllers/accountNumberController.ts`
- [ ] **Service**: `src/services/accountNumberService.ts`
- [ ] **Routes**: `src/routes/accountNumbers.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 5. CekGiro

- [ ] **Controller**: `src/controllers/cekGiroController.ts`
- [ ] **Service**: `src/services/cekGiroService.ts`
- [ ] **Routes**: `src/routes/cekGiros.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 6. CekGiroOwner

- [ ] **Controller**: `src/controllers/cekGiroOwnerController.ts`
- [ ] **Service**: `src/services/cekGiroOwnerService.ts`
- [ ] **Routes**: `src/routes/cekGiroOwners.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 7. ExpenseCategory

- [ ] **Controller**: `src/controllers/expenseCategoryController.ts`
- [ ] **Service**: `src/services/expenseCategoryService.ts`
- [ ] **Routes**: `src/routes/expenseCategories.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 8. Member

- [ ] **Controller**: `src/controllers/memberController.ts`
- [ ] **Service**: `src/services/memberService.ts`
- [ ] **Routes**: `src/routes/members.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 9. ProductCategory

- [ ] **Controller**: `src/controllers/productCategoryController.ts`
- [ ] **Service**: `src/services/productCategoryService.ts`
- [ ] **Routes**: `src/routes/productCategories.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 10. Supplier

- [ ] **Controller**: `src/controllers/supplierController.ts`
- [ ] **Service**: `src/services/supplierService.ts`
- [ ] **Routes**: `src/routes/suppliers.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 11. UserBranchDetail

- [ ] **Controller**: `src/controllers/userBranchDetailController.ts`
- [ ] **Service**: `src/services/userBranchDetailService.ts`
- [ ] **Routes**: `src/routes/userBranchDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 12. UserRefreshToken

- [ ] **Controller**: `src/controllers/userRefreshTokenController.ts`
- [ ] **Service**: `src/services/userRefreshTokenService.ts`
- [ ] **Routes**: `src/routes/userRefreshTokens.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 3: Tables with Level 2 Dependencies

### 13. CekGiroDetail

- [ ] **Controller**: `src/controllers/cekGiroDetailController.ts`
- [ ] **Service**: `src/services/cekGiroDetailService.ts`
- [ ] **Routes**: `src/routes/cekGiroDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 14. Product

- [ ] **Controller**: `src/controllers/productController.ts`
- [ ] **Service**: `src/services/productService.ts`
- [ ] **Routes**: `src/routes/products.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 15. SupplierDiscount

- [ ] **Controller**: `src/controllers/supplierDiscountController.ts`
- [ ] **Service**: `src/services/supplierDiscountService.ts`
- [ ] **Routes**: `src/routes/supplierDiscounts.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 16. CashRegister

- [ ] **Controller**: `src/controllers/cashRegisterController.ts`
- [ ] **Service**: `src/services/cashRegisterService.ts`
- [ ] **Routes**: `src/routes/cashRegisters.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 17. Closing

- [ ] **Controller**: `src/controllers/closingController.ts`
- [ ] **Service**: `src/services/closingService.ts`
- [ ] **Routes**: `src/routes/closings.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 18. Deposit

- [ ] **Controller**: `src/controllers/depositController.ts`
- [ ] **Service**: `src/services/depositService.ts`
- [ ] **Routes**: `src/routes/deposits.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 19. Expense

- [ ] **Controller**: `src/controllers/expenseController.ts`
- [ ] **Service**: `src/services/expenseService.ts`
- [ ] **Routes**: `src/routes/expenses.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

## Level 4: Tables with Level 3 Dependencies

### 20. ProductDetail

- [ ] **Controller**: `src/controllers/productDetailController.ts`
- [ ] **Service**: `src/services/productDetailService.ts`
- [ ] **Routes**: `src/routes/productDetails.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 21. Promo

- [ ] **Controller**: `src/controllers/promoController.ts`
- [ ] **Service**: `src/services/promoService.ts`
- [ ] **Routes**: `src/routes/promos.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

### 22. StockOpname

- [ ] **Controller**: `src/controllers/stockOpnameController.ts`
- [ ] **Service**: `src/services/stockOpnameService.ts`
- [ ] **Routes**: `src/routes/stockOpnames.ts`
- [ ] **Types**: Add to `src/types/index.ts`
- [ ] **Validation**: Add schemas to `src/utils/validation.ts`

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

- [ ] Register all new routes in `src/app.ts`
- [ ] Update route prefixes and middleware as needed

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
