# GigFlow - Features & Implementation Details

## Core Features Implementation

### 1. User Authentication System

#### Registration
- **Endpoint**: `POST /api/auth/register`
- **Features**:
  - Email validation and uniqueness check
  - Password hashing using bcrypt (10 salt rounds)
  - Automatic JWT token generation
  - HttpOnly cookie setting for secure token storage
  - Minimum password length validation (6 characters)

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Features**:
  - Email and password verification
  - Password comparison using bcrypt
  - JWT token with 30-day expiration
  - Secure HttpOnly cookie with SameSite=strict
  - User data returned (excluding password)

#### Token Management
- **Token Storage**: HttpOnly cookies (prevents XSS attacks)
- **Token Verification**: Middleware checks token on protected routes
- **Token Expiration**: 30 days
- **Auto Logout**: Token cleared on logout

### 2. Fluid Role System

**Key Feature**: Users don't have fixed roles. Any authenticated user can:
- Post gigs (act as a client)
- Bid on gigs (act as a freelancer)
- Have multiple gigs and bids simultaneously

**Implementation**:
- No role field in User model
- Authorization based on ownership (e.g., only gig owner can see bids)
- Users cannot bid on their own gigs (validation in place)

### 3. Gig Management (CRUD Operations)

#### Create Gig
- **Endpoint**: `POST /api/gigs`
- **Validation**:
  - Title required (max 200 characters)
  - Description required (max 2000 characters)
  - Budget must be positive number
  - Owner automatically set to authenticated user

#### Browse Gigs
- **Endpoint**: `GET /api/gigs`
- **Features**:
  - Default filter: Only "open" gigs shown
  - Search functionality (title & description)
  - Case-insensitive search using regex
  - Sorted by creation date (newest first)
  - Owner information populated

#### Get Single Gig
- **Endpoint**: `GET /api/gigs/:id`
- **Features**:
  - Full gig details
  - Owner information
  - Public access (no auth required)

#### My Gigs
- **Endpoint**: `GET /api/gigs/my-gigs`
- **Features**:
  - Lists all gigs posted by current user
  - Includes both open and assigned gigs
  - Sorted by creation date

#### Delete Gig
- **Endpoint**: `DELETE /api/gigs/:id`
- **Authorization**: Owner only
- **Validation**: Checks ownership before deletion

### 4. Search & Filter System

#### Search Implementation
```javascript
// Frontend: Debounced search input
// Backend: MongoDB regex search on title and description
query.$or = [
  { title: { $regex: search, $options: 'i' } },
  { description: { $regex: search, $options: 'i' } }
];
```

**Features**:
- Real-time search as user types
- Case-insensitive matching
- Searches both title and description
- Empty search returns all open gigs

### 5. Bidding System

#### Submit Bid
- **Endpoint**: `POST /api/bids`
- **Validation**:
  - User cannot bid on own gig
  - Gig must be in "open" status
  - No duplicate bids (unique constraint on gig + freelancer)
  - Message required (max 1000 characters)
  - Price must be positive number

#### View Bids (Owner Only)
- **Endpoint**: `GET /api/bids/gig/:gigId`
- **Authorization**: Only gig owner can view bids
- **Features**:
  - Lists all bids for a specific gig
  - Includes freelancer information
  - Shows bid status (pending, hired, rejected)
  - Sorted by submission date

#### My Bids
- **Endpoint**: `GET /api/bids/my-bids`
- **Features**:
  - Shows all bids submitted by current user
  - Includes associated gig information
  - Shows current status of each bid

### 6. The Hiring Logic (Critical Feature)

#### Implementation Details

**Endpoint**: `PATCH /api/bids/:bidId/hire`

**Atomic Transaction Flow**:
```javascript
1. START TRANSACTION
2. Verify bid exists and belongs to gig
3. Verify user is gig owner
4. Verify gig is still open (prevents double hiring)
5. Update gig status: open → assigned
6. Update chosen bid status: pending → hired
7. Update all other bids: pending → rejected
8. COMMIT TRANSACTION (all or nothing)
```

**Race Condition Handling**:
- Uses MongoDB sessions and transactions
- If transaction fails, all changes are rolled back
- Prevents scenario where two admins hire different freelancers simultaneously
- Only one bid can be hired per gig

**Error Handling**:
- Transaction aborted on any error
- Proper error messages returned
- Database state remains consistent

### 7. Real-time Notifications (Bonus Feature)

#### Socket.io Integration

**Server Side** (backend/server.js):
```javascript
// User joins with their ID when they connect
socket.on('join', (userId) => {
  userSockets.set(userId, socket.id);
});

// Emit notification to specific user
io.to(freelancerSocketId).emit('hiringNotification', data);
```

**Client Side** (frontend/src/utils/socket.js):
```javascript
// Connect to socket server
const socket = io(SOCKET_URL);

// Listen for hiring notifications
socket.on('hiringNotification', (data) => {
  // Show toast notification
  // Show browser notification
});
```

**Notification Flow**:
1. Client hires freelancer via API
2. Backend processes hiring (transaction)
3. Backend emits Socket.io event
4. Frontend receives event in real-time
5. Toast notification appears instantly
6. Browser notification (if permission granted)
7. No page refresh required!

### 8. State Management (Redux Toolkit)

#### Auth Slice
- User authentication state
- Login/Register/Logout actions
- Token management
- Loading and error states

#### Gig Slice
- Gigs list (browse page)
- Current gig (detail page)
- My gigs list
- Create/Read operations
- Search functionality

#### Bid Slice
- Bids for specific gig
- My bids list
- Create bid action
- Hire bid action
- Success/Error messages

### 9. Security Features

#### Password Security
- Bcrypt hashing with 10 salt rounds
- Passwords never stored in plain text
- Password field excluded from queries by default
- Minimum length requirement (6 characters)

#### Token Security
- JWT with secret key
- 30-day expiration
- HttpOnly cookies (JavaScript cannot access)
- SameSite=strict (CSRF protection)
- Secure flag in production (HTTPS only)

#### API Security
- Protected routes require authentication
- Ownership verification for sensitive operations
- Input validation on all endpoints
- MongoDB injection prevention (Mongoose)
- CORS configured for specific origin

#### Rate Limiting (Recommended for Production)
```javascript
// Add express-rate-limit package
// Prevent brute force attacks
// Limit login attempts
```

### 10. Database Schema Design

#### User Model
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, validated),
  password: String (required, hashed, min 6 chars),
  timestamps: true
}
```

#### Gig Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  budget: Number (required, positive),
  owner: ObjectId (ref: User),
  status: Enum ['open', 'assigned'],
  timestamps: true
}
// Indexes: text search on title and description
```

#### Bid Model
```javascript
{
  gig: ObjectId (ref: Gig, required),
  freelancer: ObjectId (ref: User, required),
  message: String (required, max 1000 chars),
  price: Number (required, positive),
  status: Enum ['pending', 'hired', 'rejected'],
  timestamps: true
}
// Indexes: unique constraint on (gig, freelancer)
```

### 11. Frontend Components Architecture

#### Pages
- **Home**: Browse and search gigs
- **Login/Register**: Authentication forms
- **CreateGig**: Post new gig form
- **GigDetail**: View gig, submit bid, manage bids
- **MyGigs**: Dashboard for posted gigs
- **MyBids**: Dashboard for submitted bids

#### Components
- **Navbar**: Navigation with auth state
- **PrivateRoute**: Route protection wrapper
- **SocketNotification**: Real-time notification handler

#### Routing
- Public routes: `/`, `/login`, `/register`
- Protected routes: `/create-gig`, `/gigs/:id`, `/my-gigs`, `/my-bids`
- Auto-redirect: Logged in users redirected from login page

### 12. Error Handling

#### Backend
- Try-catch blocks in all controllers
- Mongoose validation errors
- Custom error messages
- HTTP status codes (200, 201, 400, 401, 403, 404, 500)

#### Frontend
- Redux error states
- Toast notifications for errors
- Loading states during API calls
- Form validation before submission

### 13. UI/UX Features

#### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Touch-friendly buttons
- Readable fonts on all devices

#### Visual Feedback
- Loading spinners
- Toast notifications
- Status badges with colors
- Hover effects on interactive elements
- Disabled states for buttons

#### User Experience
- Auto-focus on form fields
- Clear error messages
- Confirmation dialogs for important actions
- Breadcrumb navigation
- Empty states with helpful messages

### 14. Performance Optimizations

#### Backend
- Database indexes for faster queries
- Lean queries (only necessary fields)
- Pagination-ready structure
- Connection pooling (MongoDB)

#### Frontend
- Code splitting with React Router
- Lazy loading components
- Redux memoization
- Debounced search input
- Optimized re-renders

### 15. Testing Recommendations

#### Backend Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Test MongoDB transactions
- Mock database for testing
- Test authentication flow

#### Frontend Testing
- Component unit tests
- Integration tests for user flows
- Redux action/reducer tests
- Mock API responses
- E2E tests with Cypress/Playwright

### 16. Future Enhancements

#### Phase 2 Features
- [ ] File upload for gig attachments
- [ ] User profiles with portfolio
- [ ] Rating and review system
- [ ] Messaging between client and freelancer
- [ ] Milestone-based payments
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Pagination for gigs and bids
- [ ] Admin dashboard
- [ ] Analytics and reporting

#### Technical Improvements
- [ ] Rate limiting
- [ ] Request logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database backups
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Load balancing
- [ ] Caching (Redis)
- [ ] CDN for static assets

---

## Technology Justification

### Why React?
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem
- Excellent developer experience

### Why Redux Toolkit?
- Centralized state management
- Built-in dev tools
- Async handling with thunks
- Less boilerplate than vanilla Redux

### Why Vite?
- Lightning-fast HMR
- Optimized build
- Modern tooling
- Better DX than Create React App

### Why Tailwind CSS?
- Utility-first approach
- No CSS file bloat
- Consistent design system
- Responsive utilities

### Why MongoDB?
- Flexible schema
- Excellent with Node.js
- Transactions support
- Scalable for future

### Why Socket.io?
- Real-time bidirectional communication
- Fallback support
- Room-based messaging
- Simple API

---

**This document provides comprehensive details about every feature implemented in GigFlow. Use it as a reference for understanding the codebase and for presenting the project.**
