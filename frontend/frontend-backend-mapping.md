# Frontend to Backend API Mapping

This document lists which frontend dashboard files should be integrated with which backend API endpoints.

| Frontend File | Dashboard Type | Backend API Endpoint(s) | Notes |
|--------------|---------------|-------------------------|-------|
| `src/app/student/dashboard/page.tsx`<br/>`src/app/components/Student/Dashboard/index.tsx` | Student Dashboard | `/api/client/enrollments`<br/>`/api/client/progress/:productId`<br/>`/api/client/notifications`<br/>`/api/client/transactions`<br/>`/api/client/user-subscriptions` | For stats, content in progress, certificates, reminders, etc. Replace hardcoded/sample data with API calls. |
| `src/app/instructor/dashboard/page.tsx`<br/>`src/app/components/Instructor/Dashboard/index.tsx` | Instructor Dashboard | `/api/courses`<br/>`/api/client/transactions`<br/>`/api/admin/instructor-payouts`<br/>`/api/client/community-posts` | For stats, overall sales, recent sales, events, etc. Replace hardcoded/sample data with API calls. |

## Example
- For `StatsGrid` in both dashboards, replace static data with API calls to fetch real stats (courses, students, reviews, etc.).
- For `ContentInProgress`, fetch user's current enrollments and progress from `/api/client/enrollments` and `/api/client/progress/:productId`.
- For `RecentSales` (instructor), fetch from `/api/client/transactions` or `/api/admin/instructor-payouts`.

> **Note:** Adjust endpoints as needed based on your backend's actual data structure and authentication requirements.
