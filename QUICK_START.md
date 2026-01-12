# 🚀 GigFlow - Quick Start Guide

## ⚡ Fast Setup (5 Minutes)

### Prerequisites Check
```bash
node --version    # Should be v16 or higher
mongod --version  # MongoDB should be installed
```

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone [your-repo-url]
cd job_portal
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
cp .env.example .env
```

`.env` file (default values work):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

### 4. Start MongoDB (If not running)
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

---

## 🧪 Quick Test (2 Minutes)

### Test the Hiring Flow

**Step 1: Register as Client**
1. Visit http://localhost:5173
2. Click "Register"
3. Name: John Doe, Email: john@test.com, Password: 123456
4. Submit

**Step 2: Post a Gig**
1. Click "Post a Gig"
2. Title: "Build a Website"
3. Description: "Need a React developer"
4. Budget: 5000
5. Submit

**Step 3: Register as Freelancer (New Incognito Tab)**
1. Open incognito/private window
2. Visit http://localhost:5173
3. Register: Jane Smith, jane@test.com, 123456

**Step 4: Submit a Bid**
1. Click on "Build a Website" gig
2. Scroll to "Submit Your Bid"
3. Message: "I can build this for you"
4. Price: 4500
5. Submit

**Step 5: Hire Freelancer**
1. Go back to first tab (John's account)
2. Click "My Gigs"
3. Click on "Build a Website"
4. Scroll to "Received Bids"
5. Click "Hire" on Jane's bid

**Step 6: Verify Real-time Notification**
1. Check the incognito tab (Jane's account)
2. You should see instant toast: "You have been hired for Build a Website!"
3. Check "My Bids" - status shows "Hired" 🎉

✅ **All features working!**

---

## 📱 Application Features

### For Clients
- Post gigs with title, description, budget
- View all received bids on your gigs
- Hire freelancers with one click
- Automatic status updates (gig → assigned)
- Automatic rejection of other bids

### For Freelancers
- Browse all open gigs
- Search gigs by keyword
- Submit bids with custom pricing
- Real-time notification when hired
- Track bid status (Pending/Hired/Rejected)

### For All Users
- Secure authentication
- View your posted gigs
- View your submitted bids
- Delete your gigs
- Responsive UI (mobile, tablet, desktop)

---

## 🔥 Key Features Demo

### Real-time Notification
```
Client hires → Socket.io event → Instant toast in freelancer's browser
No page refresh needed! ✨
```

### Atomic Hiring Logic
```
When "Hire" clicked:
1. Gig status: open → assigned
2. Hired bid: pending → hired
3. Other bids: pending → rejected
All in single atomic operation! 🎯
```

### Search Functionality
```
Search: "react developer"
→ Finds gigs with "react" in title OR description
MongoDB text index for fast search! 🔍
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
mongod

# Or check if running
ps aux | grep mongod  # Mac/Linux
tasklist | findstr mongod  # Windows
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` is `http://localhost:5173`
- Restart both servers

### Socket Not Connecting
- Check both servers are running
- Check browser console for errors
- Clear browser cache and reload

---

## 📚 API Endpoints Quick Reference

### Authentication
```bash
POST /api/auth/register  # Register
POST /api/auth/login     # Login
GET  /api/auth/me        # Get current user
POST /api/auth/logout    # Logout
```

### Gigs
```bash
GET    /api/gigs              # Get all gigs (?search=keyword)
POST   /api/gigs              # Create gig (auth)
GET    /api/gigs/:id          # Get single gig
GET    /api/gigs/my-gigs      # Get my gigs (auth)
DELETE /api/gigs/:id          # Delete gig (auth, owner)
```

### Bids
```bash
POST  /api/bids                # Submit bid (auth)
GET   /api/bids/gig/:gigId     # Get bids for gig (auth, owner)
GET   /api/bids/my-bids        # Get my bids (auth)
PATCH /api/bids/:bidId/hire    # Hire freelancer (auth, owner)
```

---

## 📊 Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Gigs
```javascript
{
  title: String,
  description: String,
  budget: Number,
  owner: ObjectId → User,
  status: 'open' | 'assigned',
  createdAt: Date
}
```

### Bids
```javascript
{
  gig: ObjectId → Gig,
  freelancer: ObjectId → User,
  message: String,
  price: Number,
  status: 'pending' | 'hired' | 'rejected',
  createdAt: Date
}
```

---

## 🎯 Assignment Requirements Met

✅ User Authentication (JWT + HttpOnly cookies)
✅ Gig Management (CRUD)
✅ Search/Filter functionality
✅ Bidding system
✅ Hiring logic (atomic updates)
✅ **Bonus 1**: Transactional integrity (race condition prevention)
✅ **Bonus 2**: Real-time Socket.io notifications

---

## 📧 Submission Checklist

Before submitting:
- [ ] Push code to GitHub
- [ ] Update README with your links
- [ ] Record 2-minute Loom demo
- [ ] Test GitHub repo link
- [ ] Test demo video link
- [ ] Send email to ritik.yadav@servicehive.tech
- [ ] CC hiring@servicehive.tech

---

## 🎥 Demo Video Script (2 minutes)

**00:00-00:15** (15s)
"Hi, I'm [Name]. This is GigFlow, a freelance marketplace where clients post gigs and freelancers bid on them."

**00:15-00:30** (15s)
"Let me show you the key feature - the hiring flow with real-time notifications."

**00:30-00:50** (20s)
[Screen: Register and post a gig]
"First, I register as a client and post a gig - Build a Website for $5000."

**00:50-01:10** (20s)
[Screen: New tab, register as freelancer, submit bid]
"Now as a freelancer in a different browser, I submit a bid for $4500."

**01:10-01:30** (20s)
[Screen: Split screen showing both browsers]
"Watch what happens when the client hires the freelancer..."
[Click Hire button]

**01:30-01:50** (20s)
"Boom! Instant notification appears without refreshing. The gig status is now Assigned, this bid is Hired, and any other bids would be automatically Rejected."

**01:50-02:00** (10s)
"This uses Socket.io for real-time updates and atomic MongoDB operations to prevent race conditions. Thanks for watching!"

---

## 🌟 Additional Features

Beyond requirements:
- Delete gig functionality
- My Gigs page
- My Bids page
- Toast notifications
- Loading states
- Form validation
- Responsive design
- Dark theme UI
- Browser notifications

---

## 💡 Pro Tips

1. **Test in Incognito**: Use incognito mode for testing multiple users
2. **Check Console**: Open browser console to see Socket.io connection logs
3. **Use Postman**: Test API endpoints with Postman collection
4. **MongoDB Compass**: View database with MongoDB Compass GUI
5. **Loom Desktop**: Use Loom desktop app for better quality recording

---

## 🔗 Useful Links

- **MongoDB**: https://www.mongodb.com/try/download/community
- **Node.js**: https://nodejs.org/
- **Loom**: https://www.loom.com/
- **Vercel**: https://vercel.com/ (Frontend hosting)
- **Render**: https://render.com/ (Backend hosting)

---

**Need Help?**
- Check README.md for detailed documentation
- Check SUBMISSION_CHECKLIST.md for requirements verification
- Check VERIFICATION_REPORT.md for complete testing results

---

**Ready to Submit? 🚀**

Your GigFlow application is complete and production-ready!

1. Record your 2-minute demo
2. Push to GitHub
3. Send submission email
4. Wait for feedback

Good luck with your internship application! 🎉
