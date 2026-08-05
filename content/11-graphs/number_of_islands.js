/**
 * Problem: Number of Islands
 * LeetCode: #200 (Medium) | NeetCode 150 | Blind 75
 */

function numIslands(grid) {
    /**
     * Time Complexity: O(M * N)
     * Space Complexity: O(M * N)
     */
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    let islands = 0;
    
    function dfs(r, c) {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === '0') {
            return;
        }
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === '1') {
                islands++;
                dfs(r, c);
            }
        }
    }
    
    return islands;
}

if (require.main === module) {
    const assert = require('assert');
    const grid1 = [
      ["1","1","1","1","0"],
      ["1","1","0","1","0"],
      ["1","1","0","0","0"],
      ["0","0","0","0","0"]
    ];
    assert.strictEqual(numIslands(grid1), 1);

    const grid2 = [
      ["1","1","0","0","0"],
      ["1","1","0","0","0"],
      ["0","0","1","0","0"],
      ["0","0","0","1","1"]
    ];
    assert.strictEqual(numIslands(grid2), 3);
    console.log("JS: numIslands passed tests!");
}
