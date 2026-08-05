/**
 * Problem: Rotate Image
 * LeetCode: #48 (Medium) | NeetCode 150 | Blind 75
 */

function rotate(matrix) {
    /**
     * Time Complexity: O(N^2)
     * Space Complexity: O(1)
     */
    const n = matrix.length;
    // Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    // Reverse rows
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}

if (require.main === module) {
    const assert = require('assert');
    const mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    rotate(mat);
    assert.deepStrictEqual(mat, [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
    console.log("JS: rotate passed tests!");
}
