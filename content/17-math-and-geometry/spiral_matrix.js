/**
 * Problem: Spiral Traversal on a Matrix
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/spirally-traversing-a-matrix/0
 */

function spiralOrder(matrix) {
    /**
     * Time Complexity: O(M * N)
     * Space Complexity: O(1) auxiliary
     */
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return [];
    
    const res = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse right
        for (let col = left; col <= right; col++) {
            res.push(matrix[top][col]);
        }
        top++;
        
        // Traverse down
        for (let row = top; row <= bottom; row++) {
            res.push(matrix[row][right]);
        }
        right--;
        
        // Traverse left
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                res.push(matrix[bottom][col]);
            }
            bottom--;
        }
        
        // Traverse up
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                res.push(matrix[row][left]);
            }
            left++;
        }
    }
    
    return res;
}

if (require.main === module) {
    const assert = require('assert');
    const mat = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    assert.deepStrictEqual(spiralOrder(mat), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    console.log("JS: spiralOrder passed tests!");
}
