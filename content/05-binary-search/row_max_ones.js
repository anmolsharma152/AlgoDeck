/**
 * Problem: Row with Maximum Number of 1s
 * GeeksforGeeks: https://practice.geeksforgeeks.org/problems/row-with-max-1s0023/1
 */

function rowWithMaxOnes(matrix) {
    /**
     * Time Complexity: O(M + N)
     * Space Complexity: O(1)
     */
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return -1;
    
    const r = matrix.length;
    const c = matrix[0].length;
    
    let maxRowIdx = -1;
    let j = c - 1; // Top-right corner
    
    for (let i = 0; i < r; i++) {
        while (j >= 0 && matrix[i][j] === 1) {
            j--;
            maxRowIdx = i;
        }
    }
    
    return maxRowIdx;
}

if (require.main === module) {
    const assert = require('assert');
    const grid = [[0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]];
    assert.strictEqual(rowWithMaxOnes(grid), 2);
    const grid2 = [[0, 0], [0, 0]];
    assert.strictEqual(rowWithMaxOnes(grid2), -1);
    console.log("JS: rowWithMaxOnes passed tests!");
}
