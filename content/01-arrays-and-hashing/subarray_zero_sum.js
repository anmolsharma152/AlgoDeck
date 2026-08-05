/**
 * Problem: Subarray with 0 Sum
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/subarray-with-0-sum/0
 */

function hasZeroSumSubarray(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    const prefixSumSet = new Set();
    let currSum = 0;
    
    for (let i = 0; i < arr.length; i++) {
        currSum += arr[i];
        if (currSum === 0 || prefixSumSet.has(currSum)) {
            return true;
        }
        prefixSumSet.add(currSum);
    }
    
    return false;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(hasZeroSumSubarray([4, 2, -3, 1, 6]), true);
    assert.strictEqual(hasZeroSumSubarray([4, 2, 0, 1, 6]), true);
    assert.strictEqual(hasZeroSumSubarray([1, 2, 3, 4]), false);
    console.log("JS: hasZeroSumSubarray passed tests!");
}
