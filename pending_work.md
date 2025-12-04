# OZME Project - Pending Work Items

> **Generated**: December 4, 2024  
> **Projects Analyzed**: ozme-backend, Ozme-frontend, Ozem-Admin

---

## 🔴 Critical Issues (High Priority)

### 1. Admin Panel - No API Integration
**Location**: `Ozem-Admin/src/pages/`

All admin pages use **hardcoded dummy data** instead of fetching from the backend API:

| Page | File | Issue |
|------|------|-------|
| **Products** | `Products.jsx` | Uses `initialProducts` array with dummy products. Add/Edit/Delete only updates local state, not saved to database. |
| **Orders** | `Orders.jsx` | Uses hardcoded `orders` array. Cannot view real orders from customers. |
| **Coupons** | `Coupons.jsx` | Uses `initialCoupons` array. Created coupons not saved to backend. |
| **Inventory** | `Inventory.jsx` | Uses hardcoded `inventory` data. Stock changes not persisted. |
| **Reviews** | `Reviews.jsx` | Uses `initialReviews` array. Cannot moderate actual customer reviews. |

---

### 2. Checkout - Orders Not Saved to Backend
**Location**: `Ozme-frontend/src/pages/Checkout.jsx`

**Issue**: When placing an order (COD), the order is only saved to `localStorage`, NOT to the backend database.

```
Lines 334-394: handleCODOrder() only saves to localStorage.setItem('currentOrder')
Lines 412-458: Online payment also saves to localStorage, not backend
```

**Missing**: API call to `POST /api/orders` to create order in MongoDB.

---

### 3. Promo Code System - Hardcoded
**Location**: `Ozme-frontend/src/pages/Cart.jsx`

**Issue**: Promo code validation is hardcoded:
```javascript
// Line 31: Only 'ozme10' works
if (code === 'ozme10') {
    setAppliedPromoCode('ozme10');
}
```

**Missing**: 
- API endpoint to validate coupon codes from database
- Connect to Admin's coupon management system
- Apply actual discount from coupon configuration

---

### 4. Track Order - Using localStorage Only
**Location**: `Ozme-frontend/src/pages/TrackOrder.jsx`

**Issue**: Order tracking reads from `localStorage.getItem('currentOrder')` instead of fetching from backend API.

**Missing**:
- Call to `GET /api/orders/track/:identifier` endpoint (which exists in backend)
- Real-time order status updates from database

---

## 🟠 Backend Issues

### 5. Missing Payment Routes
**Location**: `ozme-backend/src/routes/`

**Issue**: The Checkout.jsx references `/payments/cashfree/create-order` but:
- No `paymentRoutes.js` file exists in routes folder
- Missing Cashfree payment integration controller

**Missing Files**:
- `src/routes/paymentRoutes.js`
- `src/controllers/paymentController.js`

---

### 6. Admin Order Controller - Missing Status Update
**Location**: `ozme-backend/src/controllers/adminOrderController.js`

**Issue**: Admin can view orders but needs functionality to:
- Update order status (Processing → Shipped → Delivered)
- Mark orders as cancelled
- Add tracking numbers

---

### 7. Missing Coupon Model & API
**Location**: `ozme-backend/src/models/`

**Issue**: No Coupon model exists for the coupon management system.

**Missing**:
- `src/models/Coupon.js` - Database schema for coupons
- `src/routes/couponRoutes.js` - API routes for CRUD
- `src/controllers/couponController.js` - Business logic

---

## 🟡 Frontend Issues

### 8. Dashboard - Orders Tab Empty
**Location**: `Ozme-frontend/src/pages/Dashboard.jsx`

**Issue**: Orders tab fetches from `/orders/user` but since orders aren't created in backend (see Issue #2), users see "No orders yet".

**Root Cause**: Orders saved to localStorage not synced to backend.

---

### 9. Product Page - Missing Size Selection Integration
**Location**: `Ozme-frontend/src/componets/Product.jsx`

**Issue**: When adding to cart, size might not be properly captured from selection.

---

### 10. Search Results - Static Filter
**Location**: `Ozme-frontend/src/pages/SearchResults.jsx`

**Issue**: Search filters may not work with backend product search. Needs verification.

---

### 11. Reviews Page - Frontend Only Display
**Location**: `Ozme-frontend/src/pages/Reviews.jsx`

**Issue**: Reviews are displayed but submitting new reviews may not go to backend.

---

## 🟡 Admin Panel Issues

### 12. AddProduct - Image Upload Missing
**Location**: `Ozem-Admin/src/pages/AddProduct.jsx`

**Issue**: Product form only accepts image URL. No file upload functionality.

**Missing**:
- Image upload to cloud storage (Cloudinary, S3, etc.)
- Multiple image support
- Image preview before upload

---

### 13. Users Page - API Integration
**Location**: `Ozem-Admin/src/pages/Users.jsx`

**Issue**: Likely using dummy data. Needs to fetch real users from backend.

---

### 14. Settings Page - Not Functional
**Location**: `Ozem-Admin/src/pages/Settings.jsx`

**Issue**: Settings page may have UI but changes not persisted.

---

### 15. Dashboard Stats - Hardcoded
**Location**: `Ozem-Admin/src/pages/Dashboard.jsx`

**Issue**: Dashboard statistics are not fetching real data from backend analytics.

---

## 🔵 Authentication & Security

### 16. Admin Auth - Separate from User Auth
**Location**: `ozme-backend/src/controllers/adminAuthController.js`

**Status**: ✅ Exists, but verify:
- Admin JWT tokens separate from user tokens
- Admin middleware protecting admin routes

---

### 17. CORS Configuration
**Location**: `ozme-backend/src/server.js`

**Verify**: CORS allows requests from both frontend (port 5174) and admin (port 5175).

---

## 🔵 Database & Models

### 18. Order Model - May Need Fields
**Location**: `ozme-backend/src/models/Order.js`

**Verify these fields exist**:
- `trackingNumber`
- `paymentId` (for online payments)
- `statusHistory` (for tracking timeline)

---

### 19. Product Model - Complete Check
**Location**: `ozme-backend/src/models/Product.js`

**Verify fields for admin**:
- `sku`
- `brand`
- `discount`
- `status` (Active/Inactive/Out of Stock)
- `warehouse`

---

## 📋 Summary Checklist

| # | Category | Issue | Priority |
|---|----------|-------|----------|
| 1 | Admin | Products - No API | 🔴 Critical |
| 2 | Admin | Orders - No API | 🔴 Critical |
| 3 | Admin | Coupons - No API | 🔴 Critical |
| 4 | Admin | Inventory - No API | 🔴 Critical |
| 5 | Admin | Reviews - No API | 🔴 Critical |
| 6 | Frontend | Checkout not saving to backend | 🔴 Critical |
| 7 | Frontend | Promo code hardcoded | 🔴 Critical |
| 8 | Frontend | Order tracking uses localStorage | 🔴 Critical |
| 9 | Backend | Missing payment routes | 🟠 High |
| 10 | Backend | Missing coupon model/routes | 🟠 High |
| 11 | Backend | Admin order status update | 🟠 High |
| 12 | Frontend | Dashboard orders empty | 🟡 Medium |
| 13 | Admin | Image upload missing | 🟡 Medium |
| 14 | Admin | Users API integration | 🟡 Medium |
| 15 | Admin | Dashboard stats hardcoded | 🟡 Medium |
| 16 | Admin | Settings not functional | 🟡 Medium |
| 17 | Backend | Order model fields check | 🔵 Low |
| 18 | Backend | Product model fields check | 🔵 Low |
| 19 | Security | CORS verification | 🔵 Low |

---

## 🚀 Recommended Implementation Order

1. **Create Coupon Model & Routes** in backend
2. **Connect Checkout to Backend** - Create orders via API
3. **Connect Admin Products** to backend API
4. **Connect Admin Orders** to backend API
5. **Connect Admin Coupons** to backend API
6. **Integrate Promo Code Validation** with backend
7. **Connect Track Order** to backend API
8. **Add Payment Routes** for Cashfree integration
9. **Connect Admin Reviews** to backend API
10. **Connect Admin Inventory** to backend API
11. **Add Image Upload** functionality
12. **Connect Dashboard Statistics** to real data

---

*This document was generated after analyzing 48 source files across ozme-backend, Ozme-frontend, and Ozem-Admin projects.*
