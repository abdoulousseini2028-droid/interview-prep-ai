# Deployment Guide

## Quick Deploy (Production Ready)

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend Deploy (Vercel)
```bash
cd frontend
npm install
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### Backend Deploy (Railway)

1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select backend directory
4. Add environment variables:
   - `ANTHROPIC_API_KEY=your_key`
   - `PORT=8000`
5. Deploy automatically

**Railway Configuration:**
```
Start Command: python main.py
```

### Option 2: Render (All-in-one)

#### Backend on Render

Create `render.yaml`:
```yaml
services:
  - type: web
    name: interview-prep-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python main.py"
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: PORT
        value: 8000
```

#### Frontend on Render

```yaml
  - type: web
    name: interview-prep-frontend
    env: node
    buildCommand: "cd frontend && npm install && npm run build"
    startCommand: "cd frontend && npm run preview"
    envVars:
      - key: VITE_WS_URL
        value: wss://your-backend.onrender.com/ws
```

### Option 3: Docker Compose (Self-Hosted)

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Environment Variables

### Backend
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=8000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend
```
VITE_WS_URL=wss://your-backend.railway.app/ws
```

## Post-Deployment Checklist

- [ ] Test WebSocket connection
- [ ] Verify API key works
- [ ] Check CORS settings
- [ ] Test code submission flow
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

## Scaling Considerations

### For Production Use:
1. **Database**: Replace in-memory sessions with PostgreSQL
2. **Rate Limiting**: Implement per-user rate limits
3. **Caching**: Add Redis for session caching
4. **Load Balancing**: Use multiple backend instances
5. **Monitoring**: Add Sentry or DataDog
6. **CDN**: Serve frontend assets via CDN

## Cost Estimates (Monthly)

**Basic Setup:**
- Vercel: Free tier
- Railway: ~$5-10 (backend)
- Anthropic API: Pay-per-use (~$0.02/interview)

**Total for 100 users:** ~$15-20/month

## Custom Domain Setup

### Vercel (Frontend)
```bash
vercel domains add yourdomain.com
```

### Railway (Backend)
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records as shown

## Monitoring & Analytics

Add to backend for basic analytics:

```python
# Add to main.py
from datetime import datetime

analytics = {
    'total_sessions': 0,
    'avg_session_duration': 0,
    'total_code_submissions': 0
}

@app.get("/analytics")
async def get_analytics():
    return analytics
```

## Troubleshooting

**WebSocket won't connect:**
- Check CORS settings
- Verify backend URL in frontend
- Ensure wss:// for HTTPS sites

**API rate limits:**
- Implement request queuing
- Add user-facing rate limit notices

**High latency:**
- Use WebSocket compression
- Optimize AI prompts
- Consider edge deployment

## Security Hardening

1. **API Keys**: Never commit to Git
2. **Rate Limiting**: Implement per-IP limits
3. **Input Validation**: Sanitize all user inputs
4. **HTTPS Only**: Force SSL in production
5. **Session Expiry**: Auto-expire old sessions

## Backup Strategy

```bash
# Backup sessions (if using file storage)
tar -czf backup-$(date +%Y%m%d).tar.gz sessions/

# Backup to S3
aws s3 cp backup-*.tar.gz s3://your-bucket/backups/
``
