/**
 * Problem: Cyclically Rotate Array by One
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one/0
 */

function rotateByOne(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (!arr || arr.length <= 1) return arr;
    
    const last = arr[arr.length - 1];
    for (let i = arr.length - 1; i > 0; i--) {
        arr[i] = arr[i - 1];
    }
    arr[0] = last;
    return arr;
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(rotateByOne([1, 2, 3, 4, 5]), [5, 1, 2, 3, 4]);
    assert.deepStrictEqual(rotateByOne([9, 8, 7, 6]), [6, 9, 8, 7]);
    console.log("JS: rotateByOne passed tests!");
}
