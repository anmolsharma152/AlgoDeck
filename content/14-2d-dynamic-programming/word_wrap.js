/**
 * Problem: Word Wrap Problem
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/word-wrap/0
 */

function solveWordWrap(nums, k) {
    /**
     * Time Complexity: O(N^2)
     * Space Complexity: O(N)
     */
    const n = nums.length;
    const dp = new Array(n).fill(Infinity);
    
    for (let i = n - 1; i >= 0; i--) {
        let currLen = -1;
        for (let j = i; j < n; j++) {
            currLen += nums[j] + 1;
            if (currLen > k) {
                break;
            }
            
            let cost = 0;
            if (j !== n - 1) {
                cost = Math.pow(k - currLen, 2);
            }
            
            const nextCost = cost + (j + 1 < n ? dp[j + 1] : 0);
            if (nextCost < dp[i]) {
                dp[i] = nextCost;
            }
        }
    }
    
    return dp[0];
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(solveWordWrap([3, 2, 2, 5], 6), 10);
    assert.strictEqual(solveWordWrap([4, 3], 6), 4);
    console.log("JS: solveWordWrap passed tests!");
}
