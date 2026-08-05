/**
 * Problem: Chocolate Distribution Problem
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/chocolate-distribution-problem/0
 */

function findMinDiff(arr, m) {
    /**
     * Time Complexity: O(N log N)
     * Space Complexity: O(1)
     */
    const n = arr.length;
    if (m === 0 || n === 0) return 0;
    if (n < m) return -1;
    
    arr.sort((a, b) => a - b);
    let minDiff = Infinity;
    
    for (let i = 0; i <= n - m; i++) {
        const diff = arr[i + m - 1] - arr[i];
        minDiff = Math.min(minDiff, diff);
    }
    
    return minDiff;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(findMinDiff([7, 3, 2, 4, 9, 12, 56], 3), 2);
    assert.strictEqual(findMinDiff([3, 4, 1, 9, 56, 7, 9, 12], 5), 6);
    console.log("JS: findMinDiff passed tests!");
}
