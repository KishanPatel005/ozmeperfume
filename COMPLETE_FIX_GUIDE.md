# Complete Fix Guide - Email & Razorpay

## Issue 1: Email Authentication Error ❌

**Error:** `535-5.7.8 Username and Password not accepted`

**Root Cause:** Using regular Gmail password instead of Gmail App Password

**Fix Steps:**

1. **Generate Gmail App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable **2-Step Verification** (if not already enabled)
   - Go to: **Security** → **2-Step Verification** → **App Passwords**
   - Click **Select app** → Choose **Mail**
   - Click **Select device** → Choose **Other (Custom name)** → Enter "OZME Backend"
   - Click **Generate**
   - Copy the **16-character password** (no spaces!)

2. **Update `.env` file:**
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop  # 16 chars, NO SPACES, NO QUOTES
   ```
   Remove quotes - Gmail App Passwords don't have spaces.

3. **Restart backend server**

**Verification:** After restart, try placing an order. Email should send successfully.

---

## Issue 2: Razorpay Payment Not Working ❌

**Problem:** Frontend Checkout page is using **Cashfree**, but backend has **Razorpay** configured.

**Root Cause:** Frontend code needs to be updated to use Razorpay SDK and API endpoints.

**Fix Required:** Update `Ozme-frontend/src/pages/Checkout.jsx` to:
1. Replace Cashfree SDK with Razorpay Checkout
2. Update API endpoint to `/api/payments/razorpay/create-order`
3. Update payment flow to match Razorpay requirements

---

## Quick Summary

### For Email Fix:
1. Generate Gmail App Password (16 chars, no spaces)
2. Update `EMAIL_PASSWORD` in `.env` (no quotes)
3. Restart server

### For Razorpay Fix:
- Frontend code needs to be updated (will be done in next step)

---

## Files Modified

1. ✅ `ozme-backend/src/utils/sendEmail.js` - Better error messages for email auth failures
2. ⏳ `Ozme-frontend/src/pages/Checkout.jsx` - Update to use Razorpay (pending)

