/**
 * Problem: Move Negative Numbers to Beginning
 * GeeksforGeeks: https://www.geeksforgeeks.org/move-negative-numbers-beginning-positive-end-constant-extra-space/
 */

function moveNegatives(arr) {
    /**
     * Moves all negative elements to the beginning of the array in-place.
     * Time Complexity: O(N)
     * Space Complexity: O(1)
     */
    let left = 0;
    for (let right = 0; right < arr.length; right++) {
        if (arr[right] < 0) {
            const temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
        }
    }
    return arr;
}

if (require.main === module) {
    const assert = require('assert');
    const arr1 = [-12, 11, -13, -5, 6, -7, 5, -3, -6];
    moveNegatives(arr1);
    
    // Validate first 6 elements are negative and the rest positive
    for (let i = 0; i < 6; i++) assert.ok(arr1[i] < 0);
    for (let i = 6; i < arr1.length; i++) assert.ok(arr1[i] >= 0);
    console.log("JS: moveNegatives passed tests!");
}
