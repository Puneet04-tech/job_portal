# GigFlow - Deployment Guide

## Hosting Options

### Backend Hosting
- **Render** (Recommended - Free tier available)
- **Railway** (Easy deployment)
- **Heroku** (Reliable, paid)
- **AWS EC2** (Advanced)
- **DigitalOcean** (VPS)

### Frontend Hosting
- **Vercel** (Recommended - Automatic deployments)
- **Netlify** (Easy setup)
- **GitHub Pages** (Free, but limited)
- **AWS S3 + CloudFront** (Advanced)

### Database
- **MongoDB Atlas** (Recommended - Free tier: 512MB)

---

## Step-by-Step Deployment

### Part 1: MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free Shared" tier
   - Select cloud provider and region (closest to your users)
   - Cluster name: `gigflow-cluster`

3. **Setup Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `gigflow-admin`
   - Password: Generate secure password (save it!)
   - User privileges: "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `gigflow`

   Example:
   ```
   mongodb+srv://gigflow-admin:YOUR_PASSWORD@gigflow-cluster.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   ```

---

### Part 2: Backend Deployment (Render)

1. **Prepare Repository**
   ```bash
   cd backend
   # Ensure .gitignore includes .env
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Service name: `gigflow-backend`
   - Root directory: `backend`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`

4. **Set Environment Variables**
   In Render dashboard, add:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://gigflow-admin:YOUR_PASSWORD@gigflow-cluster.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   JWT_SECRET=your_production_jwt_secret_very_long_and_secure_12345678
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend URL: `https://gigflow-backend.onrender.com`

6. **Verify Deployment**
   - Visit: `https://gigflow-backend.onrender.com`
   - Should see: `{"message": "GigFlow API is running"}`

---

### Part 3: Frontend Deployment (Vercel)

1. **Update Frontend Configuration**
   
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://gigflow-backend.onrender.com
   VITE_SOCKET_URL=https://gigflow-backend.onrender.com
   ```

2. **Update CORS in Backend**
   
   Update `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true,
   }));
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Configure for production"
   git push origin main
   ```

4. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

5. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Framework preset: Vite
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

6. **Set Environment Variables**
   ```
   VITE_API_URL=https://gigflow-backend.onrender.com
   VITE_SOCKET_URL=https://gigflow-backend.onrender.com
   ```

7. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Your frontend URL: `https://gigflow.vercel.app`

8. **Update Backend FRONTEND_URL**
   - Go back to Render
   - Update `FRONTEND_URL` to your Vercel URL
   - Trigger manual deploy

---

## Alternative: Railway Deployment (Simpler)

### Deploy Everything on Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add MongoDB Plugin**
   - Click "New" → "Database" → "MongoDB"
   - Automatically creates MONGO_URL variable

4. **Deploy Backend**
   - Add backend service
   - Set root directory: `backend`
   - Add environment variables
   - Deploy

5. **Deploy Frontend**
   - Add frontend service
   - Set root directory: `frontend`
   - Add environment variables
   - Deploy

6. **Get URLs**
   - Railway provides URLs for both services
   - Update FRONTEND_URL in backend env
   - Update VITE_API_URL in frontend env

---

## Environment Variables Checklist

### Backend (.env)
```env
✅ PORT=5000
✅ MONGODB_URI=mongodb+srv://...
✅ JWT_SECRET=very_long_secure_secret
✅ NODE_ENV=production
✅ FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
✅ VITE_API_URL=https://your-backend.onrender.com
✅ VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

## Post-Deployment Checklist

### Backend
- [ ] API endpoint responding
- [ ] MongoDB connection successful
- [ ] CORS configured correctly
- [ ] Socket.io working
- [ ] Environment variables set

### Frontend
- [ ] Application loads
- [ ] Can register/login
- [ ] Can create gigs
- [ ] Can submit bids
- [ ] Real-time notifications work
- [ ] No console errors

### Testing
- [ ] Register new account
- [ ] Login works
- [ ] Create gig works
- [ ] Browse gigs works
- [ ] Submit bid works
- [ ] Hire freelancer works
- [ ] Real-time notification received
- [ ] All pages responsive

---

## Troubleshooting Deployment Issues

### Issue: CORS Error
**Symptom**: `Access-Control-Allow-Origin` error in browser console

**Solutions**:
1. Verify FRONTEND_URL in backend env matches your frontend URL exactly
2. Ensure `credentials: true` in CORS config
3. Check if frontend is sending `withCredentials: true` in axios
4. Verify no trailing slash in URLs

### Issue: Socket.io Not Connecting
**Symptom**: Real-time notifications don't work

**Solutions**:
1. Check VITE_SOCKET_URL is correct
2. Verify backend Socket.io is running
3. Check browser console for WebSocket errors
4. Ensure hosting platform supports WebSockets (Render does)

### Issue: MongoDB Connection Failed
**Symptom**: `MongoNetworkError` or timeout

**Solutions**:
1. Verify connection string format
2. Check password doesn't contain special characters (or URL encode them)
3. Ensure IP whitelist includes deployment server IP (or 0.0.0.0/0)
4. Check MongoDB Atlas cluster is running

### Issue: 500 Internal Server Error
**Symptom**: All API calls return 500 error

**Solutions**:
1. Check backend logs in hosting platform
2. Verify all environment variables are set
3. Ensure MongoDB is connected
4. Check for missing dependencies

### Issue: Authentication Not Working
**Symptom**: Login successful but immediately logged out

**Solutions**:
1. Check JWT_SECRET is set
2. Verify cookie domain settings
3. Ensure HTTPS in production (cookies may not work on HTTP)
4. Check browser cookie settings

### Issue: Build Fails
**Symptom**: Deployment fails during build

**Solutions**:
1. Run `npm run build` locally first
2. Check Node.js version compatibility
3. Verify all dependencies are in package.json
4. Check build logs for specific errors

---

## Performance Optimization

### Backend
```javascript
// Add compression
import compression from 'compression';
app.use(compression());

// Add helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// Add rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Frontend
- Enable Vercel CDN
- Optimize images
- Enable gzip compression
- Use production build

---

## Custom Domain Setup

### Backend (Render)
1. Go to Render dashboard
2. Settings → Custom Domain
3. Add your domain: `api.yourdomain.com`
4. Update DNS records as instructed
5. Enable HTTPS (automatic)

### Frontend (Vercel)
1. Go to Vercel dashboard
2. Settings → Domains
3. Add your domain: `yourdomain.com`
4. Update DNS records as instructed
5. Enable HTTPS (automatic)

### Update Environment Variables
After adding custom domains, update:
- `FRONTEND_URL` in backend
- `VITE_API_URL` and `VITE_SOCKET_URL` in frontend

---

## Monitoring & Maintenance

### Recommended Tools
- **Error Tracking**: Sentry.io
- **Performance**: New Relic, Datadog
- **Uptime Monitoring**: UptimeRobot
- **Analytics**: Google Analytics, Plausible

### Regular Maintenance
- Check error logs weekly
- Monitor database size
- Update dependencies monthly
- Review and rotate secrets quarterly
- Backup database regularly (Atlas has automatic backups)

---

## Cost Estimation

### Free Tier
- **MongoDB Atlas**: Free (512MB)
- **Render**: Free (limited)
- **Vercel**: Free (generous limits)
- **Total**: $0/month

### Paid Tier (Recommended for Production)
- **MongoDB Atlas**: $9/month (2GB)
- **Render**: $7/month (better performance)
- **Vercel**: $20/month (Pro)
- **Total**: ~$36/month

---

## Quick Deploy Commands

### Update Backend
```bash
cd backend
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys
```

### Update Frontend
```bash
cd frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Force Redeploy
- **Render**: Click "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Click "Redeploy"

---

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets** (at least 32 characters)
3. **Enable HTTPS** (automatic on Render/Vercel)
4. **Whitelist specific IPs** in MongoDB (in production)
5. **Rotate secrets** regularly
6. **Keep dependencies updated**
7. **Use environment-specific configs**
8. **Enable rate limiting**
9. **Add request logging**
10. **Monitor for suspicious activity**

---

## Submission Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas configured
- [ ] All features working in production
- [ ] No console errors
- [ ] Real-time notifications working
- [ ] Environment variables set correctly
- [ ] GitHub repository public
- [ ] README.md updated with live URLs
- [ ] Loom video recorded (2 minutes)
- [ ] Email sent to hiring@servicehive.tech

---

**Your deployment URLs should be added to README.md:**

```markdown
## Live Demo

- **Frontend**: https://gigflow.vercel.app
- **Backend API**: https://gigflow-backend.onrender.com
- **Demo Video**: https://www.loom.com/share/your-video-id
```

**Good luck with your deployment! 🚀**
