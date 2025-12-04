# OZME Project - Complete File Structure

## 📁 Project Overview

OZME is a full-stack e-commerce platform for a perfumery business, consisting of:
- **Frontend**: Customer-facing e-commerce website
- **Admin Panel**: Administrative dashboard for managing the store
- **Backend API**: Node.js/Express REST API with MongoDB

---

## 🗂️ Root Directory Structure

```
OZME/
├── 📄 Documentation Files
│   ├── README.md                          # Main project documentation
│   ├── PROJECT_ANALYSIS.md                # Detailed project analysis
│   ├── FILE_STRUCTURE.md                  # This file
│   ├── ADMIN_BACKEND_SETUP.md             # Admin backend setup guide
│   ├── AUTHENTICATION_IMPLEMENTATION.md   # Auth implementation details
│   ├── AUTHENTICATION_INTEGRATION.md      # Auth integration guide
│   ├── BACKEND_SUMMARY.md                 # Backend summary
│   ├── ENV_SETUP_GUIDE.md                 # Environment setup guide
│   ├── INTEGRATION_GUIDE.md               # Integration instructions
│   └── MONGODB_SETUP.md                   # MongoDB setup guide
│
├── 🎨 Ozme-frontend/                      # Customer E-commerce Frontend
│   ├── public/                            # Static assets
│   ├── src/                               # Source code
│   ├── index.html                         # HTML entry point
│   ├── package.json                       # Dependencies & scripts
│   ├── vite.config.js                     # Vite configuration
│   ├── tailwind.config.js                 # Tailwind CSS config
│   ├── postcss.config.js                  # PostCSS config
│   ├── eslint.config.js                   # ESLint config
│   └── README.md                          # Frontend README
│
├── 🔧 Ozem-Admin/                         # Admin Dashboard
│   ├── src/                               # Source code
│   ├── index.html                         # HTML entry point
│   ├── package.json                       # Dependencies & scripts
│   ├── vite.config.ts                     # Vite configuration (TypeScript)
│   ├── tailwind.config.js                 # Tailwind CSS config
│   ├── postcss.config.js                  # PostCSS config
│   ├── eslint.config.js                   # ESLint config
│   ├── tsconfig.json                      # TypeScript config
│   ├── tsconfig.app.json                  # TypeScript app config
│   └── tsconfig.node.json                 # TypeScript node config
│
└── ⚙️ ozme-backend/                       # Backend API Server
    ├── src/                               # Source code
    ├── package.json                       # Dependencies & scripts
    ├── jest.config.js                     # Jest test configuration
    └── README.md                          # Backend README
```

---

## 🎨 Ozme-frontend/ (Customer Frontend)

### Technology Stack
- **Framework**: React 19.2.0
- **Language**: JavaScript (JSX)
- **Build Tool**: Vite (rolldown-vite 7.2.2)
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.9.6
- **State**: React Context API
- **Icons**: Lucide React, React Icons
- **Notifications**: React Hot Toast
- **Animations**: React Countup

### Directory Structure

```
Ozme-frontend/
├── public/                                # Public static assets
│   ├── logo.png                           # Site logo
│   └── vite.svg                           # Vite logo
│
├── src/
│   ├── 📄 App.jsx                         # Main application component
│   ├── 📄 App.css                         # Global app styles
│   ├── 📄 main.jsx                        # Application entry point
│   ├── 📄 index.css                       # Global CSS styles
│   ├── 📄 firebase.js                     # Firebase configuration (if used)
│   │
│   ├── 📁 assets/                         # Static assets
│   │   ├── image/
│   │   │   ├── cart.jpg                   # Cart page image
│   │   │   ├── hero1.png                  # Hero slider image 1
│   │   │   ├── hero2.png                  # Hero slider image 2
│   │   │   ├── hero3.png                  # Hero slider image 3
│   │   │   ├── home1.png                  # Home page image
│   │   │   └── logo.png                   # Application logo
│   │   └── react.svg                      # React logo
│   │
│   ├── 📁 componets/                      # ⚠️ Note: Typo - should be "components"
│   │   ├── 📄 Headers.jsx                 # Site header/navigation
│   │   ├── 📄 Footer.jsx                  # Site footer
│   │   ├── 📄 Product.jsx                 # Product card component
│   │   ├── 📄 ProductModel.jsx            # Product modal/quick view
│   │   ├── 📄 Loading.jsx                 # Loading spinner component
│   │   ├── 📄 ProtectedRoute.jsx          # Route protection wrapper
│   │   ├── 📄 ScrollToTop.jsx             # Scroll to top utility
│   │   │
│   │   └── 📁 Home/                       # Home page specific components
│   │       ├── 📄 Hero.jsx                # Hero section with slider
│   │       ├── 📄 ProductDetails.jsx      # Product details section
│   │       ├── 📄 ScrollingBanner.jsx     # Scrolling banner component
│   │       └── 📄 Testimonials.jsx        # Customer testimonials
│   │
│   ├── 📁 pages/                          # Page components
│   │   ├── 📄 Home.jsx                    # Home page (/)
│   │   ├── 📄 Shop.jsx                    # Product shop/catalog (/shop)
│   │   ├── 📄 About.jsx                   # About page (/about)
│   │   ├── 📄 Contact.jsx                 # Contact page (/contact)
│   │   ├── 📄 Login.jsx                   # Login page (/login)
│   │   ├── 📄 Dashboard.jsx               # User dashboard (/dashboard)
│   │   ├── 📄 Cart.jsx                    # Shopping cart (/cart)
│   │   ├── 📄 Checkout.jsx                # Checkout page (/checkout)
│   │   ├── 📄 Wishlist.jsx                # Wishlist page (/wishlist)
│   │   ├── 📄 TrackOrder.jsx              # Order tracking (/track-order)
│   │   ├── 📄 Reviews.jsx                 # Reviews page (/reviews)
│   │   ├── 📄 FAQ.jsx                     # FAQ page (/faqs)
│   │   ├── 📄 Privacy.jsx                 # Privacy policy (/privacy)
│   │   ├── 📄 Terms.jsx                   # Terms of service (/terms)
│   │   ├── 📄 Shipping.jsx                # Shipping info (/shipping)
│   │   └── 📄 Refund.jsx                  # Refund policy (/refund)
│   │
│   ├── 📁 context/                        # React Context providers
│   │   ├── 📄 AuthContext.jsx             # Authentication context
│   │   ├── 📄 CartContext.jsx             # Shopping cart context
│   │   └── 📄 WishlistContext.jsx         # Wishlist context
│   │
│   ├── 📁 data/                           # Static/mock data
│   │   └── 📄 productData.js              # Product catalog data
│   │
│   └── 📁 utils/                          # Utility functions
│       ├── 📄 api.js                      # API client/axios setup
│       └── 📄 toast.js                    # Toast notification utilities
│
├── 📄 package.json                        # Dependencies & npm scripts
├── 📄 vite.config.js                      # Vite build configuration
├── 📄 tailwind.config.js                  # Tailwind CSS configuration
├── 📄 postcss.config.js                   # PostCSS configuration
├── 📄 eslint.config.js                    # ESLint configuration
└── 📄 README.md                           # Frontend documentation
```

### Key Routes
- `/` - Home page
- `/shop` - Product catalog
- `/product/:id` - Product details
- `/about` - About page
- `/contact` - Contact form
- `/login` - User login
- `/dashboard` - User dashboard (protected)
- `/cart` - Shopping cart (protected)
- `/checkout` - Checkout (protected)
- `/wishlist` - Wishlist (protected)
- `/track-order` - Order tracking
- `/reviews` - Reviews page
- `/faqs` - FAQ page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/shipping` - Shipping information
- `/refund` - Refund policy

---

## 🔧 Ozem-Admin/ (Admin Dashboard)

### Technology Stack
- **Framework**: React 18.3.1
- **Language**: TypeScript (with JSX files)
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.9.6
- **State**: React Context API
- **Icons**: Lucide React, Heroicons
- **Backend**: Supabase (installed but not actively used)

### Directory Structure

```
Ozem-Admin/
├── src/
│   ├── 📄 App.jsx                         # Main application component
│   ├── 📄 main.jsx                        # Application entry point
│   ├── 📄 index.css                       # Global CSS styles
│   ├── 📄 vite-env.d.ts                   # Vite environment types
│   │
│   ├── 📁 components/                     # Reusable components
│   │   ├── 📁 layout/                     # Layout components
│   │   │   ├── 📄 Navbar.jsx              # Top navigation bar
│   │   │   └── 📄 Sidebar.jsx             # Side navigation menu
│   │   │
│   │   ├── 📁 ui/                         # UI components
│   │   │   ├── 📄 Badge.jsx               # Badge component
│   │   │   ├── 📄 Button.jsx              # Button component
│   │   │   ├── 📄 Card.jsx                # Card component
│   │   │   ├── 📄 Modal.jsx               # Modal dialog component
│   │   │   ├── 📄 StatCard.jsx            # Statistics card
│   │   │   └── 📄 Table.jsx               # Data table component
│   │   │
│   │   └── 📄 ProtectedRoute.jsx          # Route protection wrapper
│   │
│   ├── 📁 pages/                          # Page components
│   │   ├── 📄 Login.jsx                   # Admin login page (/login)
│   │   ├── 📄 Dashboard.jsx               # Admin dashboard (/)
│   │   ├── 📄 Products.jsx                # Product listing (/products)
│   │   ├── 📄 AddProduct.jsx              # Add new product (/products/add)
│   │   ├── 📄 Orders.jsx                  # Order listing (/orders)
│   │   ├── 📄 OrderDetails.jsx            # Order details (/orders/:id)
│   │   ├── 📄 Inventory.jsx               # Inventory management (/inventory)
│   │   ├── 📄 Users.jsx                   # User listing (/users)
│   │   ├── 📄 UserDetail.jsx              # User details (/users/:id)
│   │   ├── 📄 Coupons.jsx                 # Coupon management (/coupons)
│   │   ├── 📄 Reviews.jsx                 # Review moderation (/reviews)
│   │   └── 📄 Settings.jsx                # Settings page (/settings)
│   │
│   ├── 📁 context/                        # React Context providers
│   │   └── 📄 AuthContext.jsx             # Admin authentication context
│   │
│   └── 📁 data/                           # Mock/static data
│       └── 📄 dummyData.js                # Dummy data for development
│
├── 📄 package.json                        # Dependencies & npm scripts
├── 📄 vite.config.ts                      # Vite build configuration
├── 📄 tailwind.config.js                  # Tailwind CSS configuration
├── 📄 postcss.config.js                   # PostCSS configuration
├── 📄 eslint.config.js                    # ESLint configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 tsconfig.app.json                   # TypeScript app config
└── 📄 tsconfig.node.json                  # TypeScript node config
```

### Key Routes
- `/login` - Admin login
- `/` - Dashboard (protected)
- `/products` - Product management (protected)
- `/products/add` - Add product (protected)
- `/orders` - Order management (protected)
- `/orders/:id` - Order details (protected)
- `/inventory` - Inventory management (protected)
- `/users` - User management (protected)
- `/users/:id` - User details (protected)
- `/coupons` - Coupon management (protected)
- `/reviews` - Review moderation (protected)
- `/settings` - Settings (protected)

---

## ⚙️ ozme-backend/ (Backend API)

### Technology Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: express-validator 7.0.1
- **Security**: bcryptjs 2.4.3, cors 2.8.5
- **Email**: nodemailer 6.9.7
- **Testing**: Jest 29.7.0, Supertest 6.3.3

### Directory Structure

```
ozme-backend/
├── src/
│   ├── 📄 server.js                       # Express app entry point
│   │
│   ├── 📁 config/                         # Configuration files
│   │   └── 📄 db.js                       # MongoDB connection setup
│   │
│   ├── 📁 models/                         # Mongoose data models
│   │   ├── 📄 User.js                     # User model
│   │   ├── 📄 Product.js                  # Product model
│   │   ├── 📄 CartItem.js                 # Shopping cart item model
│   │   ├── 📄 WishlistItem.js             # Wishlist item model
│   │   ├── 📄 Order.js                    # Order model
│   │   ├── 📄 Review.js                   # Product review model
│   │   ├── 📄 Faq.js                      # FAQ model
│   │   ├── 📄 Policy.js                   # Policy document model
│   │   └── 📄 Contact.js                  # Contact form submission model
│   │
│   ├── 📁 controllers/                    # Route controllers (business logic)
│   │   ├── 📄 authController.js           # User authentication
│   │   ├── 📄 productController.js        # Product operations
│   │   ├── 📄 cartController.js           # Shopping cart operations
│   │   ├── 📄 wishlistController.js       # Wishlist operations
│   │   ├── 📄 orderController.js          # Order operations
│   │   ├── 📄 userController.js           # User profile operations
│   │   ├── 📄 faqController.js            # FAQ operations
│   │   ├── 📄 policyController.js         # Policy operations
│   │   ├── 📄 contactController.js        # Contact form handling
│   │   │
│   │   └── 📁 Admin Controllers/          # Admin-specific controllers
│   │       ├── 📄 adminAuthController.js  # Admin authentication
│   │       ├── 📄 adminProductController.js # Admin product management
│   │       ├── 📄 adminOrderController.js # Admin order management
│   │       └── 📄 adminDashboardController.js # Admin dashboard stats
│   │
│   ├── 📁 routes/                         # Express route definitions
│   │   ├── 📄 authRoutes.js               # User auth routes
│   │   ├── 📄 productRoutes.js            # Product routes
│   │   ├── 📄 cartRoutes.js               # Cart routes
│   │   ├── 📄 wishlistRoutes.js           # Wishlist routes
│   │   ├── 📄 orderRoutes.js              # Order routes
│   │   ├── 📄 userRoutes.js               # User routes
│   │   ├── 📄 faqRoutes.js                # FAQ routes
│   │   ├── 📄 policyRoutes.js             # Policy routes
│   │   ├── 📄 contactRoutes.js            # Contact routes
│   │   │
│   │   └── 📁 Admin Routes/               # Admin-specific routes
│   │       ├── 📄 adminAuthRoutes.js      # Admin auth routes
│   │       ├── 📄 adminProductRoutes.js   # Admin product routes
│   │       ├── 📄 adminOrderRoutes.js     # Admin order routes
│   │       └── 📄 adminDashboardRoutes.js # Admin dashboard routes
│   │
│   ├── 📁 middleware/                     # Express middleware
│   │   ├── 📄 authMiddleware.js           # JWT authentication middleware
│   │   ├── 📄 adminAuthMiddleware.js      # Admin authentication middleware
│   │   ├── 📄 errorHandler.js             # Global error handler
│   │   └── 📄 validateRequest.js          # Request validation middleware
│   │
│   ├── 📁 utils/                          # Utility functions
│   │   ├── 📄 generateToken.js            # JWT token generation
│   │   ├── 📄 generateGuestToken.js       # Guest token generation
│   │   ├── 📄 sendEmail.js                # Email sending utilities
│   │   └── 📄 apiClient.js                # API client utilities
│   │
│   ├── 📁 scripts/                        # Utility scripts
│   │   └── 📄 seedFaqs.js                 # FAQ seeding script
│   │
│   └── 📁 __tests__/                      # Jest test files
│       ├── 📄 authController.test.js      # Auth controller tests
│       └── 📄 User.test.js                # User model tests
│
├── 📄 package.json                        # Dependencies & npm scripts
├── 📄 jest.config.js                      # Jest test configuration
└── 📄 README.md                           # Backend documentation
```

### API Endpoints Structure

#### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - Get products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/faqs` - Get all FAQs
- `GET /api/policies/:type` - Get policy document
- `POST /api/contact` - Submit contact form
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/orders/track/:identifier` - Track order

#### Protected User Endpoints
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PATCH /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile

#### Admin Endpoints
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get admin profile
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details

### Database Collections
- `users` - User accounts
- `products` - Product catalog
- `cartitems` - Shopping cart items
- `wishlistitems` - Wishlist items
- `orders` - Customer orders
- `reviews` - Product reviews
- `faqs` - Frequently asked questions
- `policies` - Policy documents
- `contacts` - Contact form submissions

---

## 🔍 Key Observations

### ✅ Strengths
1. **Well-organized structure** - Clear separation of concerns
2. **Modern tech stack** - React, Express, MongoDB
3. **Component-based architecture** - Reusable components
4. **Protected routes** - Authentication implemented
5. **RESTful API** - Clean API structure
6. **TypeScript in Admin** - Better type safety

### ⚠️ Issues & Notes
1. **Typo in folder name**: `Ozme-frontend/src/componets/` should be `components/`
2. **Backend integration**: Frontend and Admin may need API integration
3. **Environment variables**: Ensure `.env` files are configured
4. **Testing**: Limited test coverage (only backend has some tests)
5. **Version inconsistencies**: Different React/Tailwind versions across projects

### 📝 Recommendations
1. Fix the folder typo (`componets` → `components`)
2. Ensure all three applications are properly connected
3. Add comprehensive error handling
4. Implement proper environment variable management
5. Add more test coverage
6. Standardize dependency versions across projects

---

## 🚀 Quick Start Commands

### Backend
```bash
cd ozme-backend
npm install
npm run dev          # Development mode
npm start            # Production mode
npm test             # Run tests
```

### Frontend
```bash
cd Ozme-frontend
npm install
npm run dev          # Development server
npm run build        # Production build
```

### Admin
```bash
cd Ozem-Admin
npm install
npm run dev          # Development server
npm run build        # Production build
```

---

## 📊 Project Statistics

- **Total Applications**: 3 (Frontend, Admin, Backend)
- **Frontend Pages**: ~17 pages
- **Admin Pages**: ~12 pages
- **API Endpoints**: ~30+ endpoints
- **Database Models**: 9 models
- **React Contexts**: 4 contexts (3 frontend + 1 admin)

---

*Last Updated: Generated from project analysis*
*For detailed API documentation, see `ozme-backend/README.md`*

