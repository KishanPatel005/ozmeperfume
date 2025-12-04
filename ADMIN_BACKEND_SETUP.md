# Admin Backend Setup

Admin backend has been successfully integrated into `ozme-backend`.

## Structure

```
ozme-backend/
  src/
    middleware/
      adminAuthMiddleware.js    # Admin authentication middleware
    controllers/
      adminAuthController.js     # Admin login/logout/me
      adminProductController.js  # Product CRUD
      adminOrderController.js    # Order management
      adminDashboardController.js # Dashboard stats
    routes/
      adminAuthRoutes.js         # Admin auth routes
      adminProductRoutes.js      # Admin product routes
      adminOrderRoutes.js        # Admin order routes
      adminDashboardRoutes.js    # Admin dashboard routes
    models/
      Product.js                 # Updated with marketplace flags
```

## API Endpoints

### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin user
- `POST /api/admin/auth/logout` - Admin logout

### Admin Products
- `GET /api/admin/products` - List products (with pagination, search, filters)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Deactivate product (soft delete)

### Admin Orders
- `GET /api/admin/orders` - List orders (with filters: status, paymentStatus, date range)
- `GET /api/admin/orders/:id` - Get single order
- `PATCH /api/admin/orders/:id/status` - Update order status, payment status, tracking

### Admin Dashboard
- `GET /api/admin/dashboard/summary` - Get dashboard statistics

## Environment Variables

Add to `.env`:
```env
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
ADMIN_CLIENT_URL=http://localhost:5175
```

## Product Model Updates

Product model now includes:
- `active` (Boolean) - Product active status
- `marketplace.amazon` (Boolean) - Available on Amazon
- `marketplace.flipkart` (Boolean) - Available on Flipkart
- `marketplace.myntra` (Boolean) - Available on Myntra

## Authentication

All admin routes are protected with `adminProtect` middleware which:
1. Verifies JWT token
2. Checks user role is 'admin'
3. Attaches user to request object

## Usage

1. Create an admin user in MongoDB (set `role: 'admin'`)
2. Login via `POST /api/admin/auth/login`
3. Use the returned token in `Authorization: Bearer <token>` header
4. Access admin routes

## Next Steps

Connect the admin frontend (Ozme-Admin) to these endpoints.

