# TalentAxis — Professional Internship & Job Portal

TalentAxis is a production-grade, full-stack MERN (MongoDB, Express.js, React.js, Node.js) recruitment platform built for university students, job seekers, and recruiters. It features dedicated public, student, and administrator interfaces, strict role-based access control, mandatory CV resume upload, real-time in-app notifications, and responsive layouts.

---

## 1. Technology Stack

TalentAxis strictly adheres to the approved university curriculum technology stack:

- **Frontend**: React.js 19 (Vite), JavaScript (ES6+), Vanilla CSS3, Axios, React Router v7.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Community Server with Mongoose ODM.
- **File Uploads**: Multer (configured with local disk storage for student CV files in PDF/Word format).
- **Authentication & Security**: `bcryptjs` for one-way password hashing, `jsonwebtoken` (JWT) for stateless bearer authentication.
- **Design System**: Vanilla CSS design tokens (Google Font **Inter**), zero emojis, restrained navy/blue palette, responsive layouts with custom container widths (`1280px`).

### Strict HTTP Method Compliance
As required by university project constraints, the application strictly permits only four HTTP methods:
- `GET`: Retrieve public jobs, job details, applications, notifications, users, and contact submissions.
- `POST`: Create job postings, submit applications with CV files, register student accounts, authenticate login, and submit contact inquiries.
- `PATCH`: Partially update job postings, update application review statuses, edit student profiles, update student passwords, and mark notifications as read.
- `DELETE`: Delete job postings (with cascade cleanup), withdraw applications, dismiss contact submissions, and delete notifications.

*(Note: `PUT`, `OPTIONS` as application endpoints, `HEAD`, or custom methods are strictly prohibited).*

---

## 2. Key Features

### Public Portal
- **Modern Homepage (`/`)**: Hero section with prominent search interface (keyword, location, job type), platform metrics, popular industry categories, and a 3-step recruitment walkthrough.
- **Job Discovery & Filtering (`/jobs`)**: Real-time keyword filtering, location search, and filter pills (Internship, Full-time, Part-time, Remote).
- **Detailed Job Overview (`/jobs/:id`)**: Comprehensive view of responsibilities, qualifications, required skills, compensation, and application deadlines.
- **About Us (`/about`)**: Overview of the platform's mission and architectural standards.
- **Contact Us (`/contact`)**: Public inquiry form storing validated inquiries directly into MongoDB.

### Student Experience
- **Registration with Password Visibility Toggle (`/register`)**: Register student accounts with show/hide eye toggles on both Password and Confirm Password inputs.
- **Mandatory CV Upload**: Students must upload a CV/Resume (`.pdf`, `.doc`, `.docx`, max 5MB) to apply for any opening. Applications without a CV are blocked both on the client and server.
- **Student Dashboard (`/student/dashboard`)**: Computed summary statistics (Total, Pending, Under Review, Shortlisted, Accepted, Rejected), recommended opportunities matching user skills, and recent applications.
- **My Applications (`/student/applications`)**: Track all submitted applications, review attached CVs, check recruiter review statuses, and withdraw active submissions (`DELETE`).
- **Student Profile (`/student/profile`)**: Manage personal details, academic education, technical skills, and update passwords via secure current-password verification.
- **Duplicate Application Prevention**: Compound database index `{ studentId: 1, jobId: 1 }` prevents duplicate submissions.

### Administrator Experience
- **Administrator Overview (`/admin/dashboard`)**: Operational metrics (Registered Students, Total Jobs, Active Openings, Total Applications, Review Backlog, Shortlisted, Accepted).
- **Manage Jobs (`/admin/jobs`)**: Directory of all postings with live status toggles, candidate counters, and quick actions.
- **Create Job (`/admin/jobs/create`)**: Multi-field job posting form with formatted multiline textareas for Responsibilities and Qualifications.
- **Edit Job (`/admin/jobs/:id/edit`)**: Pre-populated editing form for updating active listings (`PATCH`).
- **Application Review (`/admin/applications`)**: Review applicant portfolios, view statement letters, inspect/download attached CV documents, and update review statuses (`Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`).
- **User Directory (`/admin/users`)**: Inspect all registered accounts with role badges, without exposing password hashes.
- **Contact Inquiries (`/admin/contacts`)**: Read messages submitted via the public contact form with delete/dismiss capability.

### In-App Notification System (Student & Admin)
- **Notification Bell**: Navbar bell icon with unread count badge in both student navbar and administrator layout.
- **Real-time Event Triggers**:
  - When a student applies: The student receives an instant submission confirmation, and all administrators receive an alert of the new candidate.
  - When an administrator updates an application: The student receives an alert (*"Your application has been updated to Shortlisted"*).
  - When an administrator posts a job: All registered students receive an alert (*"New opportunity available"*).
  - When a contact inquiry is sent: Administrators receive an alert.
- **Actions**: Mark single notification as read, mark all as read (`PATCH`), or dismiss individual notifications (`DELETE`).

---

## 3. Project Directory Structure

```text
TalentAxis/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── applicationController.js # Mandatory CV apply, status updates, withdraw
│   │   ├── authController.js        # Register, Login, GetMe
│   │   ├── contactController.js     # Contact inquiries & admin review/deletion
│   │   ├── jobController.js         # CRUD for job postings
│   │   ├── notificationController.js# Notification retrieval, read, & delete
│   │   └── userController.js        # Student profile, password change, user directory
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT token verification & role authorization
│   │   └── uploadMiddleware.js      # Multer file storage & validation for CVs
│   ├── models/
│   │   ├── Application.js           # Application model with CV fields & unique index
│   │   ├── Contact.js               # Contact message schema with timestamps
│   │   ├── Job.js                   # Job model with qualifications & responsibilities
│   │   ├── Notification.js          # In-app notification schema
│   │   └── User.js                  # User model with bcrypt hashing & safe toJSON
│   ├── routes/
│   │   ├── applicationRoutes.js     # /api/applications
│   │   ├── authRoutes.js            # /api/auth
│   │   ├── contactRoutes.js         # /api/contact
│   │   ├── jobRoutes.js             # /api/jobs
│   │   ├── notificationRoutes.js    # /api/notifications
│   │   └── userRoutes.js            # /api/users
│   ├── uploads/
│   │   └── cvs/                     # Uploaded student CV files (.pdf, .doc, .docx)
│   ├── seed.js                      # Database population script
│   ├── server.js                    # Express app entry point & static file server
│   ├── .env                         # Server environment configuration
│   ├── .env.example                 # Environment template
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx      # Admin sidebar navigation & topbar
│   │   │   ├── Footer.jsx           # Multi-column footer
│   │   │   ├── JobCard.jsx          # Job card component
│   │   │   ├── Modal.jsx            # Reusable accessible dialog modal
│   │   │   ├── Navbar.jsx           # Responsive navbar with NotificationBell
│   │   │   ├── NotificationBell.jsx # Notification bell dropdown component
│   │   │   ├── Pagination.jsx       # Data table pagination controls
│   │   │   ├── ProtectedRoute.jsx   # Role-based route guard (student/admin)
│   │   │   └── StatusBadge.jsx      # Clean status indicator badge
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication provider
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminApplications.jsx # Candidate review & CV viewer
│   │   │   │   ├── AdminContacts.jsx     # Inquiries review & delete
│   │   │   │   ├── AdminCreateJob.jsx    # Create job posting form
│   │   │   │   ├── AdminEditJob.jsx      # Edit job posting form
│   │   │   │   ├── AdminJobs.jsx         # Manage job directory
│   │   │   │   ├── AdminOverview.jsx     # Admin metrics overview
│   │   │   │   └── AdminUsers.jsx        # Registered users directory
│   │   │   ├── About.jsx            # About Us page
│   │   │   ├── Companies.jsx        # Featured employers directory
│   │   │   ├── Contact.jsx          # Contact submission form
│   │   │   ├── Home.jsx             # Homepage with search & apply modal
│   │   │   ├── JobDetails.jsx       # Job details & mandatory CV apply modal
│   │   │   ├── Jobs.jsx             # Job search & filtering directory
│   │   │   ├── Login.jsx            # Login with one-click demo credentials
│   │   │   ├── MyApplications.jsx   # Student applications history & CV link
│   │   │   ├── NotFound.jsx         # 404 error page
│   │   │   ├── Profile.jsx          # Profile editor & password change
│   │   │   ├── Register.jsx         # Registration with password visibility toggle
│   │   │   └── StudentDashboard.jsx # Student portal with metrics & apply modal
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API client
│   │   ├── App.css                  # Component & layout styling
│   │   ├── index.css                # CSS variables, typography, & global classes
│   │   ├── App.jsx                  # Application routing definitions
│   │   └── main.jsx
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration with API proxy
│   └── package.json
│
└── README.md
```

---

## 4. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **MongoDB**: Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or MongoDB Atlas.
- **MongoDB Compass** (optional): Recommended desktop GUI for viewing database collections.

---

## 5. Installation and Setup

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
Verify or create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal
JWT_SECRET=dd517a05f007ff9ef5f3737ac34969cf69576768a8e73710c344b2fa14b9d284bcdd5972c762234b5fec7a05816430d6799ed24695fb59c2ba4c32a34ce6fe9c
JWT_EXPIRES_IN=1d
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:5173
```

Verify or create `frontend/.env`:
```env
VITE_API_URL=/api
```

### Step 3: Seed Sample Data
Populate MongoDB with sample job listings, student profiles, and administrator accounts:
```bash
cd backend
node seed.js
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 6. Running the Application

### Start the Backend Server
```bash
cd backend
npm start
```
*Backend runs live at `http://localhost:5000`.*

### Start the Frontend Client
In a separate terminal:
```bash
cd frontend
npm run dev
```
*Frontend runs live at `http://localhost:5173`.*

---

## 7. Connecting to MongoDB to View Data

### Using MongoDB Compass (GUI)
1. Open **MongoDB Compass**.
2. In the connection field, enter:
   ```text
   mongodb://127.0.0.1:27017/job_portal
   ```
3. Click **Connect**.
4. You will see the **`job_portal`** database with all 5 active collections:
   - `users` — Student and administrator accounts.
   - `jobs` — Active and closed job postings.
   - `applications` — Candidate submissions with CV references.
   - `notifications` — In-app notification alerts.
   - `contacts` — Public contact messages.

---

## 8. Demonstration Credentials

For testing and grading, pre-configured accounts are provided:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@talentaxis.com` | `password123` | Browse jobs, upload CV & apply, track application progress, change password |
| **Administrator** | `admin@talentaxis.com` | `password123` | Create/edit/delete jobs, review candidate CVs, update application statuses, manage inquiries |

*(Note: On the `/login` page, convenient "Fill Student Demo" and "Fill Admin Demo" buttons allow one-click credential insertion).*

---

## 9. API Endpoint Documentation

Every endpoint strictly uses only four HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`):

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a student account (passwords hashed with bcrypt) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return signed JWT |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile (excludes password) |

### Users & Profiles (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Protected | Get current user's profile |
| `PATCH` | `/api/users/me` | Protected | Update student name, email, skills, or education |
| `PATCH` | `/api/users/me/password` | Protected | Change password (verifies current password, hashes new password) |
| `GET` | `/api/users` | Admin Only | List all registered users (passwords excluded) |

### Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | List opportunities with search, location, and type filters |
| `GET` | `/api/jobs/:id` | Public | Retrieve single opportunity by MongoDB ID |
| `POST` | `/api/jobs` | Admin Only | Create a new job posting |
| `PATCH` | `/api/jobs/:id` | Admin Only | Partially update a job posting |
| `DELETE` | `/api/jobs/:id` | Admin Only | Delete job posting and cascade associated applications |

### Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications/my` | Student Only | Get logged-in student's applications |
| `GET` | `/api/applications` | Protected | Admin views all applications; student views own |
| `GET` | `/api/applications/:id` | Protected | View single application (owner student or admin) |
| `POST` | `/api/applications` | Student Only | Apply for job (**mandatory CV upload**; prevents duplicates) |
| `PATCH` | `/api/applications/:id` | Protected | Admin updates status; student updates cover letter |
| `DELETE` | `/api/applications/:id` | Protected | Student withdraws application or admin removes record |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Protected | Get notifications for logged-in user with unread count |
| `PATCH` | `/api/notifications/read-all` | Protected | Mark all user notifications as read |
| `PATCH` | `/api/notifications/:id/read` | Protected | Mark single notification as read |
| `DELETE` | `/api/notifications/:id` | Protected | Dismiss / delete a notification |

### Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Public | Submit contact message (saved in MongoDB) |
| `GET` | `/api/contact` | Admin Only | Retrieve all contact submissions |
| `DELETE` | `/api/contact/:id` | Admin Only | Delete/dismiss contact submission |

---

## 10. Security & Architecture

1. **Password Hashing**: Passwords are encrypted using `bcryptjs` with salt work factor 10. Plaintext passwords are never stored.
2. **Safe Serialization**: The `User` Mongoose schema overrides `toJSON` to delete the `password` field before serialization, preventing leaks.
3. **Role Authorization**: Middleware (`protect`, `requireAdmin`, `requireStudent`) verifies JWT tokens and checks user permissions on every protected endpoint.
4. **CORS Isolation**: Allowed origins are restricted through `process.env.ALLOWED_ORIGIN`.
5. **No Cloud Dependencies**: CV resumes are stored locally on the server filesystem in `backend/uploads/cvs/` with file extension and MIME type whitelisting.

---

## 11. University Evaluation Checklist

- [x] **Approved MERN Stack**: React.js, Node.js, Express.js, MongoDB, Mongoose, Axios, React Router, bcryptjs, JWT.
- [x] **Permitted HTTP Methods Only**: Strictly `GET`, `POST`, `PATCH`, `DELETE` (no `PUT`).
- [x] **No Unapproved Third-Party APIs**: No external cloud storage (AWS S3, Cloudinary), no external job aggregators.
- [x] **Mandatory CV Upload**: Verified before submission.
- [x] **In-App Notifications**: Real-time alerts for both students and administrators.
- [x] **Clean Vanilla CSS**: No heavy UI frameworks; responsive styling with balanced container widths.
