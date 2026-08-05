/**
 * Problem: Kth Largest Element in an Array
 * LeetCode: #215 (Medium) | NeetCode 150
 * 
 * Time Complexity: O(N log N) with sort or O(N log K) with min-heap
 * Space Complexity: O(1) or O(K)
 */

function findKthLargest(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}

if (require.main === module) {
    console.assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5, "Test 1 Failed");
    console.assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4, "Test 2 Failed");
    console.log("All JavaScript tests passed for Kth Largest Element!");
}
