/**
 * Problem: Jump Game
 * LeetCode: #55 (Medium) | NeetCode 150 | Blind 75
 */

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

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(canJump([2, 3, 1, 1, 4]), true);
    assert.strictEqual(canJump([3, 2, 1, 0, 4]), false);
    console.log("JS: canJump passed tests!");
}
