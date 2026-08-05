# Pattern 05: Binary Search

## Core Concepts & Strategy
Binary Search is a divide-and-conquer algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array. If they are unequal, the half in which the target cannot lie is eliminated, and the search continues on the remaining half until the target is found or the search space is empty. This reduces lookup time from $O(N)$ (linear search) to $O(\log N)$.

## Sub-Patterns & Identification Signatures
1. **Standard Binary Search on Sorted Arrays**:
   - Signature: "Given a sorted array...", "Find target in $O(\log N)$ time".
   - Technique: Maintain `left` and `right` pointers. Calculate `mid = left + (right - left) / 2`. Move `left = mid + 1` or `right = mid - 1` depending on the comparison.
2. **Binary Search on the Answer (Value Range)**:
   - Signature: "Find the minimum maximum...", "Minimize the maximum...", "Koko Eating Bananas", "Capacity to Ship Packages Within D Days".
   - Technique: When the array itself isn't necessarily sorted, but the *domain of possible answers* is monotonically increasing/decreasing (e.g., if you can do it with capacity X, you can do it with capacity X+1). You Binary Search over the range of possible answers, using an $O(N)$ helper function `isValid(mid)` to check if a particular answer works.
3. **Rotated Sorted Arrays**:
   - Signature: "Search in rotated sorted array", "Find minimum in rotated sorted array".
   - Technique: At least one half of the array will always be strictly sorted. Figure out which half is sorted, then check if the target falls within the bounds of that sorted half to decide which way to move the pointers.

---

## Code Boilerplate Templates

### Python Template (Binary Search on Answer)
```python
def binary_search_on_answer(nums: list[int], target_condition: int) -> int:
    """
    Time Complexity: O(N log(Max_Value - Min_Value))
    Space Complexity: O(1)
    """
    def is_valid(mid: int) -> bool:
        # Check if 'mid' satisfies the target condition
        # This usually takes O(N) time
        return True 

    left = 0 # Minimum possible answer
    right = max(nums) # Maximum possible answer (or sum, etc.)
    ans = -1

    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            ans = mid
            # If we want the MINIMUM valid answer, try to go smaller
            right = mid - 1
        else:
            # If 'mid' is invalid, we must go larger
            left = mid + 1
            
    return ans
```

### JavaScript Template (Binary Search on Answer)
```javascript
function binarySearchOnAnswer(nums, targetCondition) {
    /**
     * Time Complexity: O(N log(MaxValue - MinValue))
     * Space Complexity: O(1)
     */
    function isValid(mid) {
        // Check if 'mid' satisfies the target condition
        // This usually takes O(N) time
        return true;
    }

    let left = 0; // Minimum possible answer
    let right = Math.max(...nums); // Maximum possible answer
    let ans = -1;

    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        
        if (isValid(mid)) {
            ans = mid;
            // If we want the MINIMUM valid answer, try to go smaller
            right = mid - 1;
        } else {
            // If 'mid' is invalid, we must go larger
            left = mid + 1;
        }
    }
    
    return ans;
}
```
