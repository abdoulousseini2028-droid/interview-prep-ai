# QUICK COMMANDS - OpenAI Version

## 🔑 Get API Key First!
https://platform.openai.com/api-keys

---

## Setup (Run Once)

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=your_key" > .env

# Frontend (new terminal)
cd frontend
npm install
```

---

## ▶️ Start Backend

```bash
cd backend
source venv/bin/activate
python main.py
```

---

## ▶️ Start Frontend

```bash
cd frontend
npm run dev
```

---

## Open App

http://localhost:5173

---

##  Stop

Press `Ctrl+C` in both terminals

---

##  Restart

Just run the "Start Backend" and "Start Frontend" commands again!

---

## Test Problem

**Problem:**
```
Find two numbers in array that sum to target
```

**Code:**
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

---

That's it!
