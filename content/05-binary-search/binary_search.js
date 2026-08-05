/**
 * Problem: Binary Search
 * LeetCode: #704 (Easy) | NeetCode 150
 */

function search(nums, target) {
    /**
     * Time Complexity: O(log N)
     * Space Complexity: O(1)
     */
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(search([-1, 0, 3, 5, 9, 12], 9), 4);
    assert.strictEqual(search([-1, 0, 3, 5, 9, 12], 2), -1);
    console.log("JS: search passed tests!");
}
