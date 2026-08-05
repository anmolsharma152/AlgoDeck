/**
 * Problem: Smallest Subarray with Sum > K
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/smallest-subarray-with-sum-greater-than-x/0
 */

function smallestSubarrayWithSum(arr, x) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    const n = arr.length;
    let currSum = 0;
    let minLen = n + 1;
    let left = 0;
    
    for (let right = 0; right < n; right++) {
        currSum += arr[right];
        
        while (currSum > x) {
            minLen = Math.min(minLen, right - left + 1);
            currSum -= arr[left];
            left++;
        }
    }
    
    return minLen <= n ? minLen : 0;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(smallestSubarrayWithSum([1, 4, 45, 6, 0, 19], 51), 3);
    assert.strictEqual(smallestSubarrayWithSum([1, 10, 5, 2, 7], 9), 1);
    assert.strictEqual(smallestSubarrayWithSum([1, 2, 4], 8), 0);
    console.log("JS: smallestSubarrayWithSum passed tests!");
}
