# Pattern 02: Two Pointers

## Core Concepts & Strategy
Two Pointers is an optimization technique used primarily on sorted arrays, strings, or linked lists to search for pairs/triplets or partition arrays in $O(N)$ time instead of $O(N^2)$ brute-force nested loops.

## Common Varieties
1. **Opposite Direction Pointers (`left = 0`, `right = N - 1`)**:
   - Used for sorted pair sums (e.g. Two Sum II, 3Sum), container with most water, valid palindrome checks.
2. **Same Direction Pointers (`fast` & `slow`)**:
   - Used for array partitioning (remove duplicates in-place, move zeroes).
3. **Trapping Water & Bounds**:
   - Maintaining `max_left` and `max_right` bounds inward.

---

## Code Boilerplate Templates

### Python Template (Opposite Pointers)
```python
def two_sum_ii(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []
```

### JavaScript Template (Opposite Pointers)
```javascript
function twoSumII(numbers, target) {
    let left = 0, right = numbers.length - 1;
    while (left < right) {
        const currSum = numbers[left] + numbers[right];
        if (currSum === target) return [left + 1, right + 1];
        if (currSum < target) left++;
        else right--;
    }
    return [];
}
```
