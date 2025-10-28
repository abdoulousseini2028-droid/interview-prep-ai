# Example Problems & Test Scenarios

## Quick Test Problems (For Demo)

### 1. Two Sum (Easy)
**Problem:**
```
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: nums[0] + nums[1] == 9, so we return [0, 1].
```

**Good Solution (Python):**
```python
def two_sum(nums, target):
    """
    Find two numbers that sum to target.
    Time: O(n), Space: O(n)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

**What to Say:**
"I'll use a hash map to store numbers I've seen. For each number, I check if its complement exists. This gives us O(n) time complexity instead of O(n²) with nested loops."

---

### 2. Valid Parentheses (Easy-Medium)
**Problem:**
```
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Opening brackets must be closed by the same type of brackets in the correct order.

Example:
Input: s = "()[]{}"
Output: true
```

**Good Solution (Python):**
```python
def is_valid(s):
    """
    Check if parentheses are balanced using a stack.
    Time: O(n), Space: O(n)
    """
    stack = []
    pairs = {'(': ')', '{': '}', '[': ']'}
    
    for char in s:
        if char in pairs:  # Opening bracket
            stack.append(char)
        elif not stack or pairs[stack.pop()] != char:
            return False
    
    return len(stack) == 0
```

**What to Say:**
"This is a classic stack problem. I'll push opening brackets onto a stack and pop when I see closing brackets. If they don't match or the stack isn't empty at the end, it's invalid."

---

### 3. Merge Intervals (Medium)
**Problem:**
```
Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals.

Example:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
```

**Good Solution (Python):**
```python
def merge_intervals(intervals):
    """
    Merge overlapping intervals.
    Time: O(n log n), Space: O(n)
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        # If overlapping, merge
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged
```

**What to Say:**
"First, I'll sort intervals by start time - that's O(n log n). Then I iterate through, merging when the current start is before or equal to the previous end. The key insight is that after sorting, I only need to check the last merged interval."

---

## Test Scenarios for AI Feedback

### Scenario 1: Good Code, Poor Explanation
**Code:** ✅ Correct, efficient
**Explanation:** "I just loop through and check stuff"
**Expected Feedback:** "Your code is solid, but in an interview you need to explain WHY you chose this approach. Try: 'I'm using X because...' and mention time/space complexity."

### Scenario 2: Buggy Code, Good Explanation
**Code:** ❌ Off-by-one error
**Explanation:** "I'm using a sliding window approach because..."
**Expected Feedback:** "Great explanation of your approach! However, there's an edge case: what happens when...? Let's debug together."

### Scenario 3: Overengineered Solution
**Code:** ✅ Works but complex
**Explanation:** "I built a recursive solution with memoization..."
**Expected Feedback:** "This works, but there's a simpler approach. For interviews, start simple first. Can you solve this iteratively?"

### Scenario 4: Perfect Interview
**Code:** ✅ Clean, efficient
**Explanation:** ✅ Clear, mentions complexity
**Expected Feedback:** "Excellent work! You clearly explained your approach, handled edge cases, and analyzed complexity. In a real interview, you might also discuss..."

---

## Interview Communication Best Practices

### ✅ DO:
1. **Think out loud**: "I notice we need fast lookups, so a hash map makes sense"
2. **State assumptions**: "I'm assuming the array isn't sorted..."
3. **Discuss tradeoffs**: "This uses more memory but improves time complexity from O(n²) to O(n)"
4. **Mention edge cases**: "We should handle empty input and duplicates"
5. **Analyze complexity**: "This is O(n) time and O(n) space"

### ❌ DON'T:
1. **Silent coding**: Writing code without explanation
2. **Vague statements**: "This should work" or "It's obvious"
3. **Ignoring hints**: Interviewer asks about optimization and you don't explore
4. **Defensive**: "I don't remember the syntax" → "Let me pseudocode this"
5. **Rush**: Start coding before explaining approach

---

## Progressive Difficulty Test Plan

### Phase 1: Warm-up (2 min)
- Simple problem (Two Sum)
- Test basic communication
- Get comfortable with interface

### Phase 2: Core Assessment (5 min)
- Medium problem (Valid Parentheses)
- Test code quality + communication
- Follow-up questions

### Phase 3: Advanced (3 min)
- Follow-up optimization questions
- Edge case discussion
- Alternative approaches

---

## Sample AI Questions to Expect

### Initial Questions:
- "Can you explain your approach before coding?"
- "What data structures are you considering?"
- "What's the time complexity of your solution?"

### During Coding:
- "Can you walk me through this line?"
- "What edge cases should we consider?"
- "Is there a way to optimize this?"

### After Submission:
- "How would this handle [edge case]?"
- "What if the input size was 1 billion?"
- "Can you explain why you chose this approach over alternatives?"

---

## Demo Script (5 minutes)

**Minute 1:** Enter problem (Two Sum)
**Minute 2:** Explain approach clearly
**Minute 3:** Write clean code with comments
**Minute 4:** Submit and review AI feedback
**Minute 5:** Answer follow-up question

**Result:** Demonstrate dual feedback on both code AND communication

---
