# Environment Configuration Fix Guide

## Issues Found and Solutions

### 1. ✅ Email Configuration Fixed
The code now supports both `EMAIL_PASS` and `EMAIL_PASSWORD` environment variable names.

**Your Current .env:**
```env
EMAIL_PASSWORD=dukj qzzi wlie svjj
```

**Problem:** The password has spaces and needs to be wrapped in quotes.

**Solution:** Update your `.env` file in `ozme-backend/.env`:

```env
EMAIL_PASSWORD="dukj qzzi wlie svjj"
```

Or remove spaces if it's an App Password:
```env
EMAIL_PASSWORD=dukjqzziwlie svjj
```

**Important:** Gmail App Passwords don't have spaces. If you're using a Gmail App Password, it should be 16 characters without spaces. Check your Gmail App Password and update accordingly.

---

### 2. ✅ Duplicate Index Warning Fixed
The duplicate index warning for the Coupon model has been fixed. The explicit index on `code` field was removed since `unique: true` already creates an index automatically.

---

### 3. Razorpay Configuration

**Your Current .env:**
```env
RAZORPAY_KEY_ID=rzp_test_FoIHGuTuf6DyTj
RAZORPAY_KEY_SECRET=eWASdg7wVTpglpTJ5a6AH5Ab
```

**Status:** ✅ These look correct. Razorpay is configured with lazy initialization, so it will only check credentials when you try to create a payment order.

**To Test Razorpay:**
1. Make sure your Razorpay test keys are active in Razorpay dashboard
2. Try creating a payment order from the frontend checkout
3. Check backend logs for any Razorpay errors

---

## Required .env File Updates

Update your `ozme-backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ozme

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Admin Authentication
ADMIN_EMAIL=admin@ozme.in
ADMIN_PASSWORD=ozme123

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_FoIHGuTuf6DyTj
RAZORPAY_KEY_SECRET=eWASdg7wVTpglpTJ5a6AH5Ab

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dlejwwxqn
CLOUDINARY_API_KEY=417256282328448
CLOUDINARY_API_SECRET=TlkTBsIO_xBh9-DMfBOT6kpLnRg

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kishan7112@gmail.com
EMAIL_PASSWORD="dukj qzzi wlie svjj"  # ⚠️ WRAP IN QUOTES if it has spaces
EMAIL_FROM=OZME Perfumes <noreply@ozme.in>

# Frontend URLs
CLIENT_URL=http://localhost:5174
ADMIN_CLIENT_URL=http://localhost:5175
```

---

## Steps to Fix

1. **Update Email Password in .env:**
   - Open `ozme-backend/.env`
   - Wrap `EMAIL_PASSWORD` value in quotes if it contains spaces
   - OR check if your Gmail App Password is correct (should be 16 chars, no spaces)

2. **Restart Backend Server:**
   ```bash
   cd ozme-backend
   # Stop the current server (Ctrl+C)
   npm start
   ```

3. **Check Server Startup:**
   - You should see: `✅ Email configured successfully` (or no email warning)
   - No duplicate index warnings
   - Server starts on port 5000

---

## Testing

### Test Email Configuration:
- Create an order and check if confirmation email is sent
- Submit contact form and check if notification email is sent

### Test Razorpay:
- Go to checkout page
- Select "Online Payment"
- Try to create a payment order
- Check browser console and backend logs for errors

---

## Common Issues

### Email Still Not Working?
1. Verify Gmail App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate a new App Password if needed
   - Copy the 16-character password (no spaces)

2. Check Email Variables:
   ```bash
   # In backend directory, check if variables are loaded:
   node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');"
   ```

### Razorpay Not Working?
1. Verify your Razorpay dashboard:
   - Login to https://dashboard.razorpay.com
   - Go to Settings → API Keys
   - Ensure test keys are active

2. Check backend logs when creating payment order

3. Verify frontend is calling correct endpoint:
   - Should call: `POST /api/payments/razorpay/create-order`

---

## Next Steps After Fix

1. Restart backend server
2. Test email by creating an order
3. Test Razorpay by going through checkout
4. Continue with Phase 6: Admin Coupons Management

