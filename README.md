# OZME Perfumery - Full Stack E-commerce Platform

Complete e-commerce platform for OZME Perfumery with React frontend, Node.js/Express backend, and MongoDB database.

## Project Structure

```
OZME/
├── Ozme-frontend/          # React frontend application
├── Ozme-Admin/             # Admin dashboard (TypeScript)
├── ozme-backend/           # Node.js/Express backend API
└── PROJECT_ANALYSIS.md     # Project documentation
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd ozme-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd Ozme-frontend
npm install
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on `http://localhost:5174`

### 3. Admin Setup (Optional)

```bash
cd Ozme-Admin
npm install
npm run dev
```

## Environment Variables

### Backend (.env in ozme-backend/)
```env
MONGO_URI=mongodb://localhost:27017/ozme
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5174
PORT=5000
```

### Frontend (.env in Ozme-frontend/)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Features

### Frontend (Ozme-frontend)
- 🏠 Homepage with hero slider
- 🛍️ Product catalog with filters
- 🛒 Shopping cart (guest & logged-in)
- ❤️ Wishlist (guest & logged-in)
- 📦 Order tracking
- 📝 FAQ page
- 📧 Contact form
- 🔐 User authentication

### Backend (ozme-backend)
- RESTful API with Express
- JWT authentication
- MongoDB database
- Guest cart/wishlist support
- Order management
- Email notifications (optional)

### Admin (Ozme-Admin)
- Product management
- Order management
- User management
- Dashboard analytics

## API Documentation

See `ozme-backend/README.md` for complete API documentation.

### Key Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get products (with filters)
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/orders` - Create order
- `GET /api/orders/track/:id` - Track order
- `GET /api/faqs` - Get FAQs

## Development

### Backend
```bash
cd ozme-backend
npm run dev      # Development with nodemon
npm start        # Production
npm test         # Run tests
npm run lint     # Lint code
```

### Frontend
```bash
cd Ozme-frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Database

MongoDB collections:
- `users` - User accounts
- `products` - Product catalog
- `cartitems` - Shopping cart items
- `wishlistitems` - Wishlist items
- `orders` - Customer orders
- `reviews` - Product reviews
- `faqs` - Frequently asked questions
- `policies` - Policy documents
- `contacts` - Contact form submissions

## Seeding Data

Seed FAQs:
```bash
cd ozme-backend
node src/scripts/seedFaqs.js
```

## Testing

### Backend Tests
```bash
cd ozme-backend
npm test
```

## Code Quality

- ESLint configured for both frontend and backend
- Prettier for code formatting
- Jest for backend testing

## Deployment

### Backend
1. Set production environment variables
2. `npm start` or use PM2/forever
3. Ensure MongoDB is accessible

### Frontend
1. Build: `npm run build`
2. Serve `dist/` folder with nginx/Apache
3. Configure API base URL for production

## Support

For issues or questions:
- Email: support@ozme.in
- Check `PROJECT_ANALYSIS.md` for detailed documentation

## License

ISC

