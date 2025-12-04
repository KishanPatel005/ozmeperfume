# Frontend-Backend Integration Guide

This guide explains how to integrate the frontend with the new backend API.

## Setup

### 1. Environment Variables

Create `.env` file in `Ozme-frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Update Contexts to Use API

The contexts (`CartContext`, `WishlistContext`, `AuthContext`) should be updated to:
1. Try API first
2. Fall back to localStorage if API is unreachable
3. Sync localStorage with API when backend is available

## API Integration Points

### CartContext Updates Needed

Replace localStorage-only logic with:
```javascript
// Try API first
const apiCart = await apiRequest('/cart');
if (apiCart) {
  setCart(apiCart.data.items);
} else {
  // Fallback to localStorage
  const savedCart = localStorage.getItem('ozmeCart');
  if (savedCart) setCart(JSON.parse(savedCart));
}
```

### WishlistContext Updates Needed

Similar pattern - try API, fallback to localStorage.

### AuthContext Updates Needed

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login` (stores token in localStorage)
- Logout: `POST /api/auth/logout`
- Get user: `GET /api/auth/me`

### Contact Form

Update `Contact.jsx` to submit to:
```javascript
await apiRequest('/contact', {
  method: 'POST',
  body: JSON.stringify(formData),
});
```

### Track Order

Update `TrackOrder.jsx` to fetch from:
```javascript
const order = await apiRequest(`/orders/track/${orderId}`);
```

## Guest Mode

The backend automatically handles guest users:
- Guest token is set as cookie automatically
- Cart/wishlist persist for guests
- When user logs in, guest data can be merged

## Error Handling

Always check if API response is null (backend unreachable) and use localStorage fallback.

## Testing Integration

1. Start backend: `cd ozme-backend && npm run dev`
2. Start frontend: `cd Ozme-frontend && npm run dev`
3. Test cart/wishlist - should sync with backend
4. Stop backend - frontend should fallback to localStorage gracefully

