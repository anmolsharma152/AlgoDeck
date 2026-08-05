/**
 * Problem: Count Pairs with Given Sum
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1
 */

function getPairsCount(arr, target) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(N)
     */
    let count = 0;
    const freq = new Map();
    
    for (let i = 0; i < arr.length; i++) {
        const complement = target - arr[i];
        if (freq.has(complement)) {
            count += freq.get(complement);
        }
        freq.set(arr[i], (freq.get(arr[i]) || 0) + 1);
    }
    
    return count;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(getPairsCount([1, 5, 7, 1], 6), 2);
    assert.strictEqual(getPairsCount([1, 1, 1, 1], 2), 6);
    console.log("JS: getPairsCount passed tests!");
}
