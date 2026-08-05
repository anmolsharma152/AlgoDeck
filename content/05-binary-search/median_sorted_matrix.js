/**
 * Problem: Median in Row-wise Sorted Matrix
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1
 */

function bisectRight(arr, target) {
    let left = 0;
    let right = arr.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

function getMedian(matrix) {
    /**
     * Time Complexity: O(32 * M * log N)
     * Space Complexity: O(1)
     */
    const r = matrix.length;
    const c = matrix[0].length;
    
    let min = matrix[0][0];
    let max = matrix[0][c - 1];
    
    for (let i = 1; i < r; i++) {
        min = Math.min(min, matrix[i][0]);
        max = Math.max(max, matrix[i][c - 1]);
    }
    
    const desired = Math.floor((r * c + 1) / 2);
    
    while (min < max) {
        const mid = min + Math.floor((max - min) / 2);
        let count = 0;
        
        for (let i = 0; i < r; i++) {
            count += bisectRight(matrix[i], mid);
        }
        
        if (count < desired) {
            min = mid + 1;
        } else {
            max = mid;
        }
    }
    
    return min;
}

if (require.main === module) {
    const assert = require('assert');
    const mat = [[1, 3, 5], [2, 6, 9], [3, 6, 9]];
    assert.strictEqual(getMedian(mat), 5);
    const mat2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
    assert.strictEqual(getMedian(mat2), 1);
    console.log("JS: getMedian passed tests!");
}
