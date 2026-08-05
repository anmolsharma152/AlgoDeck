/**
 * Problem: Merge Two Sorted Arrays Without Extra Space
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays5135/1
 */

function mergeArrays(arr1, arr2) {
    /**
     * Time Complexity: O((N + M) log(N + M))
     * Space Complexity: O(1)
     */
    const n = arr1.length;
    const m = arr2.length;
    let gap = Math.ceil((n + m) / 2);
    
    while (gap > 0) {
        let i = 0;
        let j = gap;
        
        while (j < n + m) {
            // Case 1: Both pointers in arr1
            if (j < n) {
                if (arr1[i] > arr1[j]) {
                    const temp = arr1[i];
                    arr1[i] = arr1[j];
                    arr1[j] = temp;
                }
            }
            // Case 2: Pointers split
            else if (i < n && j >= n) {
                if (arr1[i] > arr2[j - n]) {
                    const temp = arr1[i];
                    arr1[i] = arr2[j - n];
                    arr2[j - n] = temp;
                }
            }
            // Case 3: Both pointers in arr2
            else {
                if (arr2[i - n] > arr2[j - n]) {
                    const temp = arr2[i - n];
                    arr2[i - n] = arr2[j - n];
                    arr2[j - n] = temp;
                }
            }
            i++;
            j++;
        }
        
        if (gap === 1) break;
        gap = Math.ceil(gap / 2);
    }
}

if (require.main === module) {
    const assert = require('assert');
    const a1 = [1, 3, 5, 7];
    const a2 = [0, 2, 6, 8, 9];
    mergeArrays(a1, a2);
    assert.deepStrictEqual(a1, [0, 1, 2, 3]);
    assert.deepStrictEqual(a2, [5, 6, 7, 8, 9]);
    console.log("JS: mergeArrays passed tests!");
}
