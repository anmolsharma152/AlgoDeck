# Pattern 09: Backtracking

## Core Concepts & Strategy
Backtracking is a systematic method for exploring all possible configurations or permutations of a search space. It operates by building candidate solutions incrementally, and "backtracks" (abandons a candidate path) as soon as it determines that the candidate cannot possibly lead to a valid full solution.
It is structurally equivalent to Depth First Search (DFS) on a decision tree.

## Sub-Patterns & Identification Signatures
1. **Subsets & Power Set**:
   - Signature: "Generate all possible subsets...", "Combinations of a set".
   - Technique: At each index, decide whether to include the element in the current subset or not, then recurse.
2. **Permutations**:
   - Signature: "Return all permutations of an array/string".
   - Technique: Swap elements or maintain a `visited` boolean set to pick each available element for the current position, then backtrack.
3. **Pruning Decision Trees**:
   - Signature: "Sudoku solver", "N-Queens", "Word Search".
   - Technique: Validate if the current state is safe/valid before recursing. If invalid, abort early to save exponential time.

---

## Code Boilerplate Templates

### Python Template (Subset Generation)
```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Time Complexity: O(N * 2^N)
    Space Complexity: O(N) for recursion stack
    """
    res = []
    
    def backtrack(start: int, path: list[int]):
        res.append(path.copy())
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop() # backtrack step
            
    backtrack(0, [])
    return res
```

### JavaScript Template (Subset Generation)
```javascript
function subsets(nums) {
    /**
     * Time Complexity: O(N * 2^N)
     * Space Complexity: O(N)
     */
    const res = [];
    
    function backtrack(start, path) {
        res.push([...path]);
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop(); // backtrack
        }
    }
    
    backtrack(0, []);
    return res;
}
```
