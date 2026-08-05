# Pattern 01: Arrays & Hashing

## Core Concepts & Strategy
Arrays & Hashing forms the foundation of modern algorithmic problem solving. The key objective is trading $O(N)$ auxiliary space (via Hash Maps or Hash Sets) to reduce lookup time from $O(N)$ down to average $O(1)$.

## Sub-Patterns & Identification Signatures
1. **Frequency Counter / Hash Set Lookup**:
   - Signature: "Find duplicates", "Check valid anagrams", "Find elements with sum X".
   - Technique: Maintain a hash map of `{ element: count }` or `{ complement: index }`.
2. **Prefix Sum Technique**:
   - Signature: "Subarray sum equals K", "Range sum queries without modification".
   - Equation: $PrefixSum[j] - PrefixSum[i-1] = RangeSum[i...j]$.
3. **Kadane's Algorithm**:
   - Signature: "Maximum subarray sum".
   - Equation: $CurrentMax = \max(Num, CurrentMax + Num)$.

---

## Code Boilerplate Templates

### Python Template (Hash Map Complement Lookup)
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    seen = {}
    for index, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index
    return []
```

### JavaScript Template (Hash Map Complement Lookup)
```javascript
function twoSum(nums, target) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
```
