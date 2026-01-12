# GigFlow - Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd job_portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file or use the existing one (update MongoDB URI if needed):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345678
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Application

### Create Test Accounts

**Account 1 (Client)**
- Email: client@test.com
- Password: password123
- Name: John Client

**Account 2 (Freelancer)**
- Email: freelancer@test.com
- Password: password123
- Name: Jane Freelancer

### Test Flow

1. **Register as Client** (Account 1)
   - Go to http://localhost:5173/register
   - Fill in details and register

2. **Post a Gig**
   - Navigate to "Post a Gig"
   - Title: "Build a React Website"
   - Description: "I need a modern responsive website using React and Tailwind CSS"
   - Budget: 1000
   - Click "Post Gig"

3. **Register as Freelancer** (Account 2)
   - Logout from Account 1
   - Register with different email

4. **Submit a Bid**
   - Browse gigs on home page
   - Click on the gig posted by Client
   - Click "Submit a Bid"
   - Message: "I have 5 years of experience in React development..."
   - Price: 900
   - Submit

5. **Hire the Freelancer**
   - Logout and login as Client (Account 1)
   - Go to "My Gigs"
   - Click on your gig
   - View the bid from Freelancer
   - Click "Hire"
   - ✅ Real-time notification sent to Freelancer!

6. **Verify Real-time Notification**
   - Keep both accounts logged in on different browsers/tabs
   - When Client hires, Freelancer receives instant notification
   - Browser notification appears (if permission granted)

## API Testing with Postman/Curl

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Get All Gigs
```bash
curl http://localhost:5000/api/gigs
```

### Search Gigs
```bash
curl "http://localhost:5000/api/gigs?search=react"
```

### Create Gig (Authenticated)
```bash
curl -X POST http://localhost:5000/api/gigs \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Gig","description":"Test Description","budget":500}'
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Kill the process using port 5000
- Or change PORT in backend/.env to another port (e.g., 5001)

### CORS Error in Browser
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: 
- Ensure backend is running
- Check FRONTEND_URL in backend/.env matches your frontend URL
- Clear browser cache and cookies

### Socket.io Connection Failed
```
WebSocket connection failed
```
**Solution**:
- Verify both frontend and backend are running
- Check VITE_SOCKET_URL in frontend/.env
- Disable browser extensions that block WebSockets

## MongoDB Atlas Setup (Optional)

If you don't have MongoDB installed locally:

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow?retryWrites=true&w=majority
```

## Features to Test

✅ User Registration & Login  
✅ JWT Authentication with HttpOnly Cookies  
✅ Post New Gig (CRUD)  
✅ Browse & Search Gigs  
✅ Submit Bids  
✅ View Bids (Owner Only)  
✅ Hire Freelancer (Atomic Transaction)  
✅ Real-time Notifications (Socket.io)  
✅ My Gigs Dashboard  
✅ My Bids Dashboard  
✅ Responsive Design  

## Tech Stack Verification

### Backend
- ✅ Node.js + Express.js
- ✅ MongoDB + Mongoose
- ✅ JWT Authentication
- ✅ HttpOnly Cookies
- ✅ Socket.io
- ✅ MongoDB Transactions

### Frontend
- ✅ React.js with Vite
- ✅ Tailwind CSS
- ✅ Redux Toolkit
- ✅ React Router
- ✅ Socket.io-client
- ✅ Axios

## Production Deployment

### Backend (Render, Railway, or Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel or Netlify)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

### MongoDB (Atlas)
- Use MongoDB Atlas for production database
- Update MONGODB_URI with production connection string

## Support

For issues or questions:
- Check the main README.md
- Review error logs in terminal
- Test API endpoints directly
- Verify environment variables

---

**Happy Coding! 🚀**
