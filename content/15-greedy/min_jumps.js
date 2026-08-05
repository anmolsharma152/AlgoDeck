/**
 * Problem: Minimum Jumps to Reach End
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/minimum-number-of-jumps/0
 */

function minJumps(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    const n = arr.length;
    if (n <= 1) return 0;
    if (arr[0] === 0) return -1;
    
    let maxReach = arr[0];
    let steps = arr[0];
    let jumps = 1;
    
    for (let i = 1; i < n - 1; i++) {
        maxReach = Math.max(maxReach, i + arr[i]);
        steps--;
        
        if (steps === 0) {
            jumps++;
            if (i >= maxReach) {
                return -1;
            }
            steps = maxReach - i;
        }
    }
    
    return jumps;
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(minJumps([1, 3, 5, 8, 9, 2, 6, 7, 6, 8, 9]), 3);
    assert.strictEqual(minJumps([1, 1, 1, 1, 1]), 4);
    assert.strictEqual(minJumps([0, 1, 2]), -1);
    console.log("JS: minJumps passed tests!");
}
