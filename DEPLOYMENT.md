# Production Deployment Guide

## Architecture Overview
- **Frontend**: Next.js App Router deployed on **Vercel**.
- **Backend**: Express TypeScript REST API deployed on **Render** (or Vercel / Railway).
- **Database**: **Neon PostgreSQL** serverless database with connection pooling.
- **Media**: **Cloudinary** for unsigned image uploads.
- **Payments**: **SSLCommerz** payment gateway.

---

## 1. Frontend Deployment (Vercel)

### Required Environment Variables on Vercel:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
JWT_SECRET=your_jwt_secret_matching_backend
```

### Build & Output Settings:
- Framework Preset: **Next.js**
- Root Directory: `frontend` (or root if imported from `Gear-up-frontend` repo directly)
- Build Command: `npm run build`
- Output Directory: `.next`

---

## 2. Backend Deployment (Render / Railway / Vercel)

### Required Environment Variables on Backend:
```bash
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"
JWT_ACCESS_SECRET=your_jwt_secret_matching_frontend
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-backend-domain.onrender.com
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false
ADMIN_EMAIL=admin@gearup.com
ADMIN_PASSWORD=admin_strong_password
ADMIN_NAME="GearUp Administrator"
```

### Backend Build & Start Commands:
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm run start`

---

## 3. Post-Deployment Checklist
1. Verify CORS in `backend/src/app.ts` includes `FRONTEND_URL`.
2. Confirm SSLCommerz callback routes redirect to `FRONTEND_URL/payment/success` and `FRONTEND_URL/payment/fail`.
3. Run `npm run seed:admin` once to initialize the administrator credentials.
