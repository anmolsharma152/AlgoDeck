# Pattern 04: Stack

## Core Concepts & Strategy
A Stack is a Last-In-First-Out (LIFO) data structure. The element added last is the first one to be removed. In Python, a list `[]` acts as a perfect stack (using `append()` and `pop()`). In JavaScript, an array `[]` serves the same purpose (using `push()` and `pop()`). 
Stacks are incredibly useful for parsing, reversing operations, or tracking state where the most recent event is the most important (e.g., backtracking steps, matching parentheses).

## Sub-Patterns & Identification Signatures
1. **LIFO / Parsing / Matching**:
   - Signature: "Valid parentheses", "Evaluate Reverse Polish Notation", "Simplify Path".
   - Technique: Push elements to track history. When you encounter a closing or resolving element, pop from the stack to match or compute.
2. **Monotonic Stack**:
   - Signature: "Next greater element", "Daily temperatures", "Largest rectangle in histogram".
   - Technique: Maintain a stack of elements that is strictly increasing (or decreasing). When a new element violates this monotonic property, pop elements from the stack until the property is restored. This allows answering "next greater/smaller" queries in $O(N)$ time.
3. **Min / Max Stack**:
   - Signature: "Design a stack that supports getMin() in O(1) time".
   - Technique: Maintain two stacks internally—one for normal operations, and one parallel stack that keeps track of the current minimum (or maximum) at that exact depth.

---

## Code Boilerplate Templates

### Python Template (Monotonic Decreasing Stack - Next Greater Element)
```python
def next_greater_elements(nums: list[int]) -> list[int]:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    res = [-1] * len(nums)
    stack = [] # Stores indices

    for i, num in enumerate(nums):
        # While stack is not empty and current number is greater than the 
        # number at the index at the top of the stack
        while stack and nums[stack[-1]] < num:
            idx = stack.pop()
            res[idx] = num
        stack.append(i)
        
    return res
```

### JavaScript Template (Monotonic Decreasing Stack - Next Greater Element)
```javascript
function nextGreaterElements(nums) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    const res = new Array(nums.length).fill(-1);
    const stack = []; // Stores indices

    for (let i = 0; i < nums.length; i++) {
        // While stack is not empty and current number is greater than the 
        // number at the index at the top of the stack
        while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
            const idx = stack.pop();
            res[idx] = nums[i];
        }
        stack.push(i);
    }
    
    return res;
}
```
