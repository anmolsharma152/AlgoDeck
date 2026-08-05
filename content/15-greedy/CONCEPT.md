# Pattern 15: Greedy Algorithms

## Core Concepts & Strategy
A Greedy algorithm builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit (i.e. the local optimum). 
Greedy algorithms do not backtrack. To prove a greedy strategy is correct, you must show that making local optimal choices never locks you out of the global optimum.
Greedy algorithms typically involve sorting the input first to make optimal local choices.

## Sub-Patterns & Identification Signatures
1. **Interval Scheduling**:
   - Signature: "Find the maximum number of non-overlapping intervals...", "Meeting rooms II".
   - Technique: Sort intervals by end time (earliest end time first) to leave the maximum room for future intervals.
2. **Reachability**:
   - Signature: "Jump Game", "Minimum number of jumps".
   - Technique: Keep track of the maximum reachable index/goal at any given point.
3. **Partitioning**:
   - Signature: "Partition Labels".
   - Technique: Find the last occurrence of each character to expand the boundary of the current partition.

---

## Code Boilerplate Templates

### Python Template (Jump Game Reachability)
```python
def can_jump(nums: list[int]) -> bool:
    """
    Time Complexity: O(N)
    Space Complexity: O(1)
    """
    goal = len(nums) - 1
    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= goal:
            goal = i
    return goal == 0
```

### JavaScript Template (Jump Game Reachability)
```javascript
function canJump(nums) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let goal = nums.length - 1;
    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= goal) {
            goal = i;
        }
    }
    return goal === 0;
}
```
