# 🚀 OpenAI Version - Quick Setup

## ✅ This Version Uses OpenAI (GPT-4) Instead of Claude

### Step 1: Get Your OpenAI API Key (2 minutes)

1. Go to: https://platform.openai.com/
2. Sign up (FREE $5 credits for new users!)
3. Click your profile → **"View API Keys"** or go to https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Name it "Interview Prep"
6. Copy the key (starts with `sk-proj-...` or `sk-...`)

⚠️ **SAVE IT IMMEDIATELY** - You can't see it again!

---

### Step 2: Backend Setup (5 minutes)

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE" > .env
```

**Or manually create `.env` file:**
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

---

### Step 3: Frontend Setup (3 minutes)

**Open NEW terminal:**
```bash
cd frontend

# Install dependencies
npm install
```

---

### Step 4: Run It! (1 minute)

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
python main.py
```

Should see:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Should see:
```
  ➜  Local:   http://localhost:5173/
```

---

### Step 5: Test It! (2 minutes)

1. Open: **http://localhost:5173**
2. Enter a problem: "Write a function that finds two numbers that sum to target"
3. Click "Start Interview"
4. Explain approach: "I'll use a hash map"
5. Write code:
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```
6. Click "Submit for Review"
7. **Get AI feedback!** 🎉

---

## 🎯 What Changed?

- ✅ Uses OpenAI GPT-4 instead of Claude
- ✅ FREE $5 credits for new users
- ✅ Same features, different AI model
- ✅ Still production-ready

---

## 💰 Costs

**OpenAI Pricing:**
- GPT-4: ~$0.03 per interview session
- Your free $5 = ~166 practice sessions
- More than enough for testing & demos!

---

## 🐛 Troubleshooting

### "openai.AuthenticationError"
→ Check your API key in `.env` file

### "Module not found: openai"
→ Did you activate venv? Run: `source venv/bin/activate`

### "Rate limit exceeded"
→ You're out of free credits, add payment method on OpenAI

### Backend won't start
→ Make sure `.env` file exists in `backend/` folder

---

## 🚀 Next Steps

1. ✅ Get it running locally
2. ✅ Test with example problems
3. ✅ Customize & polish
4. ✅ Deploy (follow DEPLOYMENT.md)
5. ✅ Add to resume (follow RESUME_GUIDE.md)

---

## 📊 OpenAI vs Claude Comparison

| Feature | OpenAI (GPT-4) | Claude |
|---------|---------------|--------|
| Free Credits | ✅ $5 | ❌ None |
| Code Analysis | ✅ Excellent | ✅ Excellent |
| Response Speed | ~2-4 seconds | ~2-3 seconds |
| Cost per Session | ~$0.03 | ~$0.02 |
| This Project | ✅ Works perfectly | ✅ Works perfectly |

**Bottom line:** Both work great. OpenAI is free to start!

---

## ✅ You're All Set!

The backend code has been updated to use OpenAI.

**Now just:**
1. Get your API key
2. Follow steps above
3. Start building!

**Questions?** Check QUICKSTART.md for more troubleshooting.

**Ready to deploy?** Check DEPLOYMENT.md when you're ready.

🎉 **Let's build this thing!**
