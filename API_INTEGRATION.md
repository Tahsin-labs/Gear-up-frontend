# GearUp — Frontend API Integration Map

This document outlines the complete mapping of backend REST endpoints consumed by each frontend page and component in the GearUp platform.

---

## 1. Authentication & Users

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | `RegisterPage` (`onSubmit`) | `src/app/(auth)/register/page.tsx` | Customer & Provider account registration |
| `POST` | `/api/auth/login` | `LoginPage` (`onSubmit`) | `src/app/(auth)/login/page.tsx` | User login, JWT cookie generation, session creation |
| `GET` | `/api/auth/me` | `AuthProvider` | `src/providers/auth-provider.tsx` | Hydrate active user identity and profile session |

---

## 2. Equipment & Gear (Public & Provider)

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/provider/gear` | `FeaturedGearGrid`, `GearGrid`, `useGear` | `src/components/home/FeaturedGearGrid.tsx`, `src/app/gear/page.tsx` | Fetch gear list with category, brand, and price filters |
| `GET` | `/api/provider/gear/:id` | `GearDetailsPage`, `useGearById` | `src/app/gear/[id]/page.tsx` | Detailed view for specific gear listing with specifications |
| `GET` | `/api/provider/gear/:id/availability` | `RentalBookingCard`, `useGearAvailability` | `src/components/gear/RentalBookingCard.tsx` | Retrieve booked date ranges to block calendar overlap |
| `POST` | `/api/provider/gear` | `GearForm` (`onSubmit`), `useCreateGear` | `src/components/dashboard/GearForm.tsx`, `src/app/dashboard/provider/new/page.tsx` | Provider listing of new rental equipment |
| `PATCH` | `/api/provider/gear/:id` | `GearForm` (`onSubmit`), `useUpdateGear` | `src/components/dashboard/GearForm.tsx`, `src/app/dashboard/provider/edit/[id]/page.tsx` | Update existing gear equipment details and pricing |
| `DELETE` | `/api/provider/gear/:id` | `ProviderInventoryTable`, `useDeleteGear` | `src/components/dashboard/ProviderInventoryTable.tsx` | Remove equipment item from provider inventory |

---

## 3. Equipment Categories

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/categories` | `CategoryCards`, `GearFilters`, `GearForm` | `src/components/home/CategoryCards.tsx`, `src/components/gear/GearFilters.tsx` | Load categories for homepage showcase and gear filter dropdowns |
| `POST` | `/api/admin/categories` | `AdminCategoriesManager` | `src/components/dashboard/AdminCategoriesManager.tsx` | Admin creation of new gear categories with slug |

---

## 4. Rentals & Bookings

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/customer/rentals` | `RentalBookingCard`, `useCreateRental` | `src/components/gear/RentalBookingCard.tsx` | Customer booking reservation submission (`PENDING`) |
| `GET` | `/api/customer/rentals` | `CustomerOrdersTable`, `useRentals` | `src/components/dashboard/CustomerOrdersTable.tsx`, `src/app/dashboard/customer/page.tsx` | View logged-in customer's booking history and status |
| `GET` | `/api/provider/rentals` | `ProviderOrdersTable`, `useProviderOrders` | `src/components/dashboard/ProviderOrdersTable.tsx`, `src/app/dashboard/provider/page.tsx` | Provider view of incoming customer rental requests |
| `PATCH` | `/api/provider/rentals/:id/status` | `ProviderOrdersTable`, `useUpdateRentalStatus` | `src/components/dashboard/ProviderOrdersTable.tsx` | Provider workflow transitions (`CONFIRMED`, `ACTIVE`, `COMPLETED`, `CANCELLED`) |

---

## 5. Payments (SSLCommerz Gateway)

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/customer/payments` | `CustomerOrdersTable`, `usePayNow` | `src/components/dashboard/CustomerOrdersTable.tsx` | Initiate SSLCommerz checkout session and obtain Gateway URL |
| `GET` | `/api/customer/payments` | `CustomerPaymentsTable`, `usePayments` | `src/components/dashboard/CustomerPaymentsTable.tsx` | Customer view of transaction records and receipts |
| `GET` | `/api/customer/payments/:id` | `usePaymentById` | `src/hooks/index.ts` | Detailed transaction verification |

---

## 6. Feedback & Reviews

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/customer/reviews` | `ReviewModal` (`handleSubmit`) | `src/components/dashboard/ReviewModal.tsx` | Customer post-rental review and star rating submission |
| `GET` | `/api/gear/:id/reviews` | `GearReviewsList` | `src/components/gear/GearReviewsList.tsx` | Public display of customer reviews on gear details page |

---

## 7. Administrator Management

| HTTP Method | Backend Endpoint | Component / Hook | File Path | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | `AdminUsersTable` | `src/components/dashboard/AdminUsersTable.tsx` | Retrieve platform user directory with role and status |
| `PATCH` | `/api/admin/users/:id` | `AdminUsersTable` | `src/components/dashboard/AdminUsersTable.tsx` | Suspend / unblock user access (`ACTIVE` / `BLOCKED`) |
| `GET` | `/api/admin/gear` | `AdminGearTable` | `src/components/dashboard/AdminGearTable.tsx` | Platform-wide inventory oversight |
| `GET` | `/api/admin/rentals` | `AdminRentalsTable` | `src/components/dashboard/AdminRentalsTable.tsx` | Comprehensive platform rental order monitoring |
