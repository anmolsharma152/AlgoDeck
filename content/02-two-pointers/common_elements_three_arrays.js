/**
 * Problem: Common Elements in 3 Sorted Arrays
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/common-elements1132/1
 */

function commonElements(a, b, c) {
    /**
     * Time Complexity: O(N_1 + N_2 + N_3)
     * Space Complexity: O(1) auxiliary
     */
    let i = 0, j = 0, k = 0;
    const res = [];
    
    while (i < a.length && j < b.length && k < c.length) {
        if (a[i] === b[j] && b[j] === c[k]) {
            if (res.length === 0 || res[res.length - 1] !== a[i]) {
                res.push(a[i]);
            }
            i++;
            j++;
            k++;
        } else if (a[i] < b[j]) {
            i++;
        } else if (b[j] < c[k]) {
            j++;
        } else {
            k++;
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    const a = [1, 5, 10, 20, 40, 80];
    const b = [6, 7, 20, 80, 100];
    const c = [3, 4, 15, 20, 30, 70, 80, 120];
    assert.deepStrictEqual(commonElements(a, b, c), [20, 80]);
    console.log("JS: commonElements passed tests!");
}
