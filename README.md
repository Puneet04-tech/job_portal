# GigFlow - Freelance Marketplace Platform

GigFlow is a full-stack mini-freelance marketplace where clients can post jobs (Gigs) and freelancers can submit bids. The platform features secure authentication, real-time notifications, and atomic transaction handling for the hiring process.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens stored in HttpOnly cookies
- **Fluid Roles**: Any user can act as both a client (posting gigs) and a freelancer (bidding on gigs)
- **Gig Management**: Full CRUD operations for job postings
- **Search & Filter**: Search gigs by title or description
- **Bidding System**: Freelancers can submit proposals with custom pricing
- **Hiring Logic**: Atomic updates using MongoDB transactions to handle concurrent hiring requests

### Bonus Features Implemented
1. **Transactional Integrity**: MongoDB transactions ensure race condition safety during the hiring process
   - See [BONUS_FEATURES_EXPLANATION.md](BONUS_FEATURES_EXPLANATION.md) for detailed technical documentation
2. **Real-time Notifications**: Socket.io integration for instant notifications when freelancers get hired

## 🛠️ Tech Stack

### Frontend
- React.js 18 with Vite
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Socket.io-client for real-time updates
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- HttpOnly cookies for token storage
- Socket.io for real-time communication
- Bcrypt.js for password hashing

## 📁 Project Structure

```
job_portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── gigController.js      # Gig CRUD operations
│   │   └── bidController.js      # Bidding & hiring logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Gig.js                # Gig schema
│   │   └── Bid.js                # Bid schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── gigRoutes.js          # Gig endpoints
│   │   └── bidRoutes.js          # Bid endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Main server file
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   ├── PrivateRoute.jsx  # Route protection
    │   │   └── SocketNotification.jsx  # Real-time notifications
    │   ├── pages/
    │   │   ├── Home.jsx          # Browse gigs
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Registration page
    │   │   ├── CreateGig.jsx     # Post new gig
    │   │   ├── GigDetail.jsx     # Gig details & bidding
    │   │   ├── MyGigs.jsx        # User's posted gigs
    │   │   └── MyBids.jsx        # User's submitted bids
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.js  # Auth state management
    │   │   │   ├── gigSlice.js   # Gig state management
    │   │   │   └── bidSlice.js   # Bid state management
    │   │   └── store.js          # Redux store configuration
    │   ├── utils/
    │   │   ├── api.js            # Axios instance
    │   │   └── socket.js         # Socket.io client setup
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file (optional, defaults are fine for local development):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Gigs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/gigs` | Get all open gigs (with search) | No |
| POST | `/api/gigs` | Create a new gig | Yes |
| GET | `/api/gigs/:id` | Get single gig | No |
| GET | `/api/gigs/my-gigs` | Get user's posted gigs | Yes |
| DELETE | `/api/gigs/:id` | Delete a gig | Yes (Owner only) |

### Bids
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bids` | Submit a bid | Yes |
| GET | `/api/bids/gig/:gigId` | Get all bids for a gig | Yes (Owner only) |
| GET | `/api/bids/my-bids` | Get user's submitted bids | Yes |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer | Yes (Owner only) |

## 🎯 Key Features Explained

### 1. Hiring Logic (Atomic Updates)

The hiring process uses MongoDB transactions to ensure data consistency:

```javascript
// When a client clicks "Hire" on a bid:
1. Update the Gig status from 'open' to 'assigned'
2. Update the chosen Bid status to 'hired'
3. Update all other Bids for that Gig to 'rejected'
```

All three operations happen atomically within a single transaction, preventing race conditions even if multiple admins try to hire different freelancers simultaneously.

### 2. Real-time Notifications

When a freelancer gets hired:
1. Backend emits a Socket.io event
2. Frontend receives the notification instantly
3. Toast notification appears in the UI
4. Browser notification (if permission granted)

### 3. Authentication Flow

- JWT tokens are generated on login/register
- Tokens are stored in HttpOnly cookies (secure, not accessible via JavaScript)
- Frontend includes credentials in every API request
- Protected routes check for valid tokens via middleware

## 🧪 Testing the Application

### User Flow 1: Client Posts a Gig
1. Register/Login as User A
2. Click "Post a Gig"
3. Fill in title, description, and budget
4. Submit the gig
5. View the gig in "My Gigs"

### User Flow 2: Freelancer Bids
1. Register/Login as User B
2. Browse available gigs on the home page
3. Click on a gig to view details
4. Submit a bid with your proposal and price
5. View your bid in "My Bids"

### User Flow 3: Client Hires Freelancer
1. Login as User A (gig owner)
2. Navigate to "My Gigs"
3. Click on the gig to see all bids
4. Review bids and click "Hire" on the chosen one
5. User B receives instant notification (if online)
6. Gig status changes to "Assigned"
7. Other bids automatically marked as "Rejected"

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with 30-day expiration
- HttpOnly cookies prevent XSS attacks
- CORS configured for specific origin
- Input validation on all endpoints
- Protected routes require authentication
- Owner-only actions (hire, view bids, delete gig)

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # To test the production build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings for MongoDB port (27017)

### CORS Errors
- Verify FRONTEND_URL in backend .env matches frontend URL
- Check that credentials: true is set in both backend and frontend

### Socket.io Not Connecting
- Ensure both frontend and backend are running
- Check VITE_SOCKET_URL in frontend .env
- Verify firewall allows WebSocket connections

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set in backend .env
- Verify token expiration hasn't passed

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Loading states for all async operations
- Toast notifications for user feedback
- Form validation with error messages
- Status badges (Open, Assigned, Pending, Hired, Rejected)
- Search functionality with debouncing
- Clean and modern interface

## 📄 License

This project is created for educational purposes as part of a Full Stack Development Internship Assignment.

## 📧 Submission

**Submission To**: ritik.yadav@servicehive.tech  
**CC**: hiring@servicehive.tech

**GitHub Repository**: [Add your GitHub repository link here]  
**Hosted Link**: [Add your hosted application URL here]  
**Demo Video**: [Add your 2-minute Loom video link here]

**Assignment**: Full Stack Development Internship - GigFlow Platform

---

**Developed for**: ServiceHive Technologies  
**Date**: January 2026
**Estimated Development Time**: 2-3 Days
