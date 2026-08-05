/**
 * Problem: Count Inversions in Array
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/inversion-of-array/0
 */

function countInversions(arr) {
    /**
     * Time Complexity: O(N log N)
     * Space Complexity: O(N)
     */
    function mergeAndCount(tempArr, left, mid, right) {
        let i = left;
        let j = mid + 1;
        let k = left;
        let invCount = 0;
        
        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                tempArr[k] = arr[i];
                i++;
            } else {
                tempArr[k] = arr[j];
                invCount += (mid - i + 1);
                j++;
            }
            k++;
        }
        
        while (i <= mid) {
            tempArr[k] = arr[i];
            i++;
            k++;
        }
        
        while (j <= right) {
            tempArr[k] = arr[j];
            j++;
            k++;
        }
        
        for (let idx = left; idx <= right; idx++) {
            arr[idx] = tempArr[idx];
        }
        
        return invCount;
    }

    function mergeSort(tempArr, left, right) {
        let invCount = 0;
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            invCount += mergeSort(tempArr, left, mid);
            invCount += mergeSort(tempArr, mid + 1, right);
            invCount += mergeAndCount(tempArr, left, mid, right);
        }
        return invCount;
    }

    const temp = new Array(arr.length).fill(0);
    return mergeSort(temp, 0, arr.length - 1);
}

if (require.main === module) {
    const assert = require('assert');
    assert.strictEqual(countInversions([2, 4, 1, 3, 5]), 3);
    assert.strictEqual(countInversions([2, 3, 4, 5, 6]), 0);
    assert.strictEqual(countInversions([10, 10, 10]), 0);
    console.log("JS: countInversions passed tests!");
}
