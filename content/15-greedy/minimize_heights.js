/**
 * Problem: Minimize Maximum Difference of Heights
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/minimize-the-heights3351/1
 */

function getMinDiff(arr, k) {
    /**
     * Time Complexity: O(N log N)
     * Space Complexity: O(1)
     */
    const n = arr.length;
    if (n === 1) return 0;
    
    arr.sort((a, b) => a - b);
    
    let ans = arr[n - 1] - arr[0];
    
    for (let i = 0; i < n - 1; i++) {
        if (arr[i + 1] - k < 0) {
            continue;
        }
        const tempMin = Math.min(arr[0] + k, arr[i + 1] - k);
        const tempMax = Math.max(arr[n - 1] - k, arr[i] + k);
        
        ans = Math.min(ans, tempMax - tempMin);
    }
    
    return ans;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(getMinDiff([1, 5, 8, 10], 2), 5);
    assert.strictEqual(getMinDiff([3, 9, 12, 16, 20], 3), 11);
    console.log("JS: getMinDiff passed tests!");
}
