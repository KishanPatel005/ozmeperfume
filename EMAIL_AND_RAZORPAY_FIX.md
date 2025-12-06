# Email & Razorpay Fix Guide

## Issues Identified

### 1. ❌ Email Authentication Error (535 - BadCredentials)
**Error:** Gmail is rejecting your credentials

**Causes:**
- Using regular Gmail password instead of App Password
- App Password is incorrect or expired
- Password has spaces and needs proper handling

**Solution:**
1. **Generate Gmail App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification (if not already enabled)
   - Go to: Security → 2-Step Verification → App Passwords
   - Generate a new App Password for "Mail"
   - Copy the 16-character password (NO SPACES)

2. **Update your `.env` file:**
   ```env
   EMAIL_PASSWORD=your_16_char_app_password_no_spaces
   ```
   **Remove quotes** - Gmail App Passwords don't have spaces

3. **Verify your email settings:**
   - EMAIL_USER should be your full Gmail address
   - EMAIL_PASSWORD should be the 16-character App Password (no spaces)

---

### 2. ❌ Razorpay Payment Not Working
**Problem:** Frontend Checkout page is using Cashfree, but backend has Razorpay configured.

**Solution:** Update Checkout page to use Razorpay instead of Cashfree.

---

## Fixes to Apply

### Fix 1: Email Password Configuration

Your current `.env`:
```env
EMAIL_PASSWORD=dukj qzzi wlie svjj
```

**Problem:** This looks like a regular password with spaces. Gmail requires App Password for SMTP.

**Steps:**
1. Generate Gmail App Password (see above)
2. Update `.env`:
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop  # 16 chars, no spaces
   ```

### Fix 2: Update Checkout to Use Razorpay

The Checkout page needs to be updated to:
- Call `/api/payments/razorpay/create-order` instead of Cashfree
- Use Razorpay Checkout SDK instead of Cashfree SDK
- Handle Razorpay payment response

---

## Next Steps

1. **Fix Email:** Generate Gmail App Password and update `.env`
2. **Fix Razorpay:** Update Checkout page to use Razorpay
3. **Restart Server:** After updating `.env`

Would you like me to:
- Update the Checkout page to use Razorpay?
- Improve email error handling?

