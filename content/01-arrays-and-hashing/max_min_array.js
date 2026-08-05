/**
 * Problem: Maximum and Minimum in an Array
 * GeeksforGeeks: https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/
 */

function getMinMax(arr) {
    /**
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    if (!arr || arr.length === 0) {
        return [-1, -1];
    }
    
    let min = arr[0];
    let max = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        } else if (arr[i] > max) {
            max = arr[i];
        }
    }
    
    return [min, max];
}

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(getMinMax([3, 5, 4, 1, 9]), [1, 9]);
    assert.deepStrictEqual(getMinMax([22, 14, 8, 17, 35, 3]), [3, 35]);
    console.log("JS: max_min_array passed tests!");
}
