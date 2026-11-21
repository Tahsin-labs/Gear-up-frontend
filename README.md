# GearUp Frontend

Next.js App Router frontend for the GearUp peer-to-peer gear sharing and rental platform.

## Live URL
- **Production URL**: `https://gearup-frontend.vercel.app` (Placeholder)

---

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Lucide Icons, Sonner toasts
- **State & Data Fetching**: TanStack Query (React Query v5)
- **Forms & Validation**: React Hook Form, Zod
- **Auth & Security**: JWT cookie-based session, `jose` JWT verification, Next.js Middleware route guard
- **Media**: Cloudinary (unsigned client-side uploads with size and format validation)
- **Payment Gateway**: SSLCommerz redirect & callback integration

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Express Backend base URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend application origin | `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned preset | `gearup_preset` |
| `JWT_SECRET` | Secret key matching backend `JWT_ACCESS_SECRET` | `your_jwt_secret` |

---

## Demo Credentials

You can test each role using these default seeded accounts or register new ones:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gearup.com` | `admin123456` | Platform administration & moderation |
| **Provider** | `provider@gearup.com` | `password123` | Can list, edit, delete gear and fulfill rental bookings |
| **Customer** | `customer@gearup.com` | `password123` | Can browse, reserve gear, pay via SSLCommerz, and leave reviews |

---

## Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Typecheck codebase
npx tsc --noEmit

# Run ESLint
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```
