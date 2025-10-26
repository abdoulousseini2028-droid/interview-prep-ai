# 🚀 QUICK START GUIDE

## Get This Running in 10 Minutes

### Prerequisites Check
```bash
python3 --version  # Need 3.11+
node --version     # Need 18+
```

If missing, install from:
- Python: https://python.org
- Node: https://nodejs.org

---

## Option 1: Automated Setup (Easiest)

```bash
cd interview-prep-ai
chmod +x setup.sh
./setup.sh
```

Follow the prompts. Done!

---

## Option 2: Manual Setup

### Step 1: Backend Setup (2 minutes)
```bash
cd interview-prep-ai/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Add API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

Get your API key: https://console.anthropic.com/

### Step 2: Frontend Setup (2 minutes)
```bash
cd interview-prep-ai/frontend

# Install dependencies
npm install
```

### Step 3: Run It! (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```
You should see: `Application startup complete`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

### Step 4: Test It (5 minutes)

1. Open http://localhost:5173
2. Paste this problem:
```
Given an array of integers and a target, find two numbers that sum to the target.
Example: [2,7,11,15], target=9 → return [0,1]
```
3. Explain your approach
4. Write code
5. Get AI feedback!

---

## Common Issues & Fixes

### "ModuleNotFoundError: No module named 'fastapi'"
→ Did you activate venv? Run: `source venv/bin/activate`

### "WebSocket connection failed"
→ Is backend running? Check Terminal 1 for errors

### "npm ERR! code ERESOLVE"
→ Delete `node_modules` and run `npm install --legacy-peer-deps`

### "Anthropic API key not found"
→ Create `.env` file in backend folder with your key

### Port 5173 already in use
→ Change port in `vite.config.js` or kill existing process

---

## Next Steps

### 1. Test the Demo (5 min)
- [ ] Try the Two Sum problem from EXAMPLES.md
- [ ] Submit code and get feedback
- [ ] Ask follow-up questions
- [ ] End session and view summary

### 2. Customize (10 min)
- [ ] Add your name to README.md
- [ ] Update resume bullets in RESUME_GUIDE.md
- [ ] Customize colors in tailwind.config.js
- [ ] Add more example problems

### 3. Deploy (20 min)
- [ ] Push to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Test live version

### 4. Showcase (30 min)
- [ ] Record demo video
- [ ] Update LinkedIn with project
- [ ] Add to resume
- [ ] Share with network

---

## File You Need to Edit

### Must Edit:
1. **backend/.env** - Add your API key
2. **README.md** - Add your name/links

### Should Edit:
3. **RESUME_GUIDE.md** - Track your metrics
4. **frontend/src/App.jsx** - Customize UI

### Optional:
5. **tailwind.config.js** - Change colors
6. **EXAMPLES.md** - Add problems you like

---

## Development Workflow

### Making Changes:
1. Edit files
2. Save
3. Auto-reload happens
4. Test in browser

### Adding Features:
1. Read PROJECT_STRUCTURE.md
2. Find relevant file
3. Make changes
4. Test thoroughly
5. Commit to Git

### Debugging:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Check WebSocket connection status
4. Add `console.log()` statements

---

## Pro Tips

### Tip 1: Keep Backend Running
Open 2 terminal tabs, one for backend (leave it running), one for everything else.

### Tip 2: Test Without API Calls
Comment out AI calls during UI development to save API credits:
```python
# response = client.messages.create(...)
# Fake response for testing:
response = type('obj', (object,), {'content': [type('obj', (object,), {'text': 'Test response'})]})
```

### Tip 3: Use React DevTools
Install React DevTools browser extension to debug state.

### Tip 4: Watch the Network Tab
Open browser DevTools → Network → WS to see WebSocket messages.

### Tip 5: Start Simple
Get basic flow working first, then add features.

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] WebSocket shows "Connected"
- [ ] Can submit problem description
- [ ] Can explain approach
- [ ] Code editor works
- [ ] Code submission triggers AI
- [ ] Feedback displays
- [ ] Chat messages work
- [ ] Session summary generates

---

## What to Do If Stuck

### Quick Fixes:
1. Restart both servers
2. Clear browser cache
3. Delete node_modules and reinstall
4. Delete venv and recreate
5. Check .env file exists

### Get Help:
- Check EXAMPLES.md for test cases
- Read PROJECT_STRUCTURE.md
- Review backend terminal for errors
- Check browser console
- Google the error message

---

## Ready to Ship?

### Pre-Deploy Checklist:
- [ ] All tests passing
- [ ] No console errors
- [ ] API key in environment vars (not hardcoded!)
- [ ] README.md updated
- [ ] .gitignore includes .env
- [ ] Demo video recorded
- [ ] GitHub repo public

### Deploy Commands:
```bash
# Frontend (Vercel)
cd frontend && vercel

# Backend (Railway)
# Connect GitHub repo in Railway dashboard
```

Full deployment guide: **DEPLOYMENT.md**

---

## Time Budget (10 Hours)

- ✅ Setup & Installation: 30 min
- ✅ Test basic functionality: 30 min  
- ✅ Customize & brand: 1 hour
- ✅ Test with real problems: 1 hour
- ✅ Bug fixes & polish: 2 hours
- ✅ Deploy to production: 1 hour
- ✅ Documentation & demo: 2 hours
- ✅ Resume/portfolio prep: 2 hours

**You've got 10 hours. Let's ship it! 🚀**

---

## Success Criteria

You'll know it's ready when:
✅ You can complete a full interview session
✅ AI provides relevant feedback
✅ No console errors
✅ WebSocket stays connected
✅ You can explain every part of the code
✅ It's deployed and accessible via URL
✅ You have a 2-minute demo video
✅ Your resume mentions it

---

## Resources

- **Anthropic Docs**: https://docs.anthropic.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev
- **Monaco Editor**: https://microsoft.github.io/monaco-editor
- **Tailwind CSS**: https://tailwindcss.com

---

## Final Words

This project is **different** because:
1. It solves a real problem you've experienced
2. It's not another TODO app
3. It demonstrates modern AI integration
4. It shows full-stack + real-time systems
5. It has clear business value

**Now go build it and land that job! 💪**

Questions? Re-read this guide. Still stuck? Check the docs above.

You've got this! 🎯
