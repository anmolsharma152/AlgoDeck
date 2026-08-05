/**
 * Problem: Climbing Stairs
 * LeetCode: #70 (Easy) | NeetCode 150 | Blind 75
 */

function climbStairs(n) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (n <= 2) return n;
    
    let one = 1, two = 2;
    for (let i = 3; i <= n; i++) {
        const temp = one + two;
        one = two;
        two = temp;
    }
    return two;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(climbStairs(2), 2);
    assert.strictEqual(climbStairs(3), 3);
    assert.strictEqual(climbStairs(5), 8);
    console.log("JS: climbStairs passed tests!");
}
