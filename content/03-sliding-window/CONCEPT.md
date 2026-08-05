# Pattern 03: Sliding Window

## Core Concepts & Strategy
Sliding Window is a subset of the Two Pointers pattern, specifically used for problems involving contiguous subarrays or sublists. Instead of recalculating a metric (like sum or count) from scratch for every possible subarray, we "slide" a window of size $K$ (or a dynamic size) across the array, adding the new element entering the window and removing the old element exiting the window. This reduces $O(N^2)$ or $O(N \cdot K)$ time complexity down to $O(N)$.

## Sub-Patterns & Identification Signatures
1. **Fixed Size Window**:
   - Signature: "Find the max sum of a subarray of size K", "Find the average of all contiguous subarrays of size K".
   - Technique: Keep the distance between `left` and `right` exactly `K`. When `right` reaches `K`, start incrementing `left` along with `right`.
2. **Variable Size Window**:
   - Signature: "Smallest subarray with sum greater than or equal to S", "Longest substring with at most K distinct characters".
   - Technique: Expand `right` to meet a condition. Once the condition is met (or violated), shrink from the `left` until the condition is violated (or met) again.
3. **Sliding Window with Auxiliary Data Structure**:
   - Signature: "Longest repeating character replacement", "Sliding window maximum".
   - Technique: Maintain a Hash Map of character frequencies, or use a Monotonic Deque to keep track of the maximum/minimum within the current window.

---

## Code Boilerplate Templates

### Python Template (Variable Size Window - Longest Subarray)
```python
def longest_subarray_with_condition(nums: list[int], k: int) -> int:
    """
    Time Complexity: O(N)
    Space Complexity: O(1) or O(N) depending on auxiliary DS
    """
    left = 0
    max_length = 0
    # auxiliary_ds = ... (e.g., sum = 0, or Hash Map)

    for right in range(len(nums)):
        # 1. Add nums[right] to auxiliary_ds
        
        # 2. Check if window is invalid
        while not is_valid_window(auxiliary_ds, k):
            # Remove nums[left] from auxiliary_ds
            left += 1
            
        # 3. Update max_length for valid window
        max_length = max(max_length, right - left + 1)
        
    return max_length
```

### JavaScript Template (Variable Size Window - Longest Subarray)
```javascript
function longestSubarrayWithCondition(nums, k) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1) or O(N) depending on auxiliary DS
     */
    let left = 0;
    let maxLength = 0;
    // let auxiliaryDs = ...

    for (let right = 0; right < nums.length; right++) {
        // 1. Add nums[right] to auxiliaryDs
        
        // 2. Check if window is invalid
        while (!isValidWindow(auxiliaryDs, k)) {
            // Remove nums[left] from auxiliaryDs
            left++;
        }
        
        // 3. Update maxLength for valid window
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```
