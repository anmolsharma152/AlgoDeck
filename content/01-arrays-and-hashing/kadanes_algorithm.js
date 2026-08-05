/**
 * Problem: Kadane's Algorithm (Largest Sum Subarray)
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0
 */

function maxSubarraySum(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (!arr || arr.length === 0) return 0;
    
    let maxSoFar = arr[0];
    let maxEndingHere = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(maxSubarraySum([1, 2, 3, -2, 5]), 9);
    assert.strictEqual(maxSubarraySum([-1, -2, -3, -4]), -1);
    assert.strictEqual(maxSubarraySum([5, 4, 7, -2, 2]), 16);
    console.log("JS: maxSubarraySum passed tests!");
}
