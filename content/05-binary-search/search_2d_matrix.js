/**
 * Problem: Search a 2D Matrix
 * LeetCode: #74 (Medium)
 */

function searchMatrix(matrix, target) {
    /**
     * Time Complexity: O(log(M * N))
     * Space Complexity: O(1)
     */
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0;
    let right = m * n - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const midVal = matrix[Math.floor(mid / n)][mid % n];
        
        if (midVal === target) {
            return true;
        } else if (midVal < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}

if (require.main === module) {
    const assert = require('assert');
    const matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
    assert.strictEqual(searchMatrix(matrix, 3), true);
    assert.strictEqual(searchMatrix(matrix, 13), false);
    console.log("JS: searchMatrix passed tests!");
}
