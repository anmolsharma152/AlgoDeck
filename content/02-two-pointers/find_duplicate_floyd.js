/**
 * Problem: Find Duplicate Number (Floyd's Cycle Detection)
 * LeetCode: #287 (Medium)
 */

function findDuplicate(nums) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let slow = nums[0];
    let fast = nums[0];
    
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    let slow2 = nums[0];
    while (slow !== slow2) {
        slow = nums[slow];
        slow2 = nums[slow2];
    }
    
    return slow;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(findDuplicate([1, 3, 4, 2, 2]), 2);
    assert.strictEqual(findDuplicate([3, 1, 3, 4, 2]), 3);
    assert.strictEqual(findDuplicate([3, 3, 3, 3, 3]), 3);
    console.log("JS: findDuplicate passed tests!");
}
