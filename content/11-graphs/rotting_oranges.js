function orangesRotting(grid) {
    let ROWS = grid.length, COLS = grid[0].length;
    let queue = [];
    let fresh = 0, time = 0;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (grid[r][c] === 1) fresh++;
            else if (grid[r][c] === 2) queue.push([r, c]);
        }
    }

    let directions = [[0,1],[0,-1],[1,0],[-1,0]];
    while (queue.length > 0 && fresh > 0) {
        let len = queue.length;
        for (let i = 0; i < len; i++) {
            let [r, c] = queue.shift();
            for (let [dr, dc] of directions) {
                let row = r + dr, col = c + dc;
                if (row >= 0 && row < ROWS && col >= 0 && col < COLS && grid[row][col] === 1) {
                    grid[row][col] = 2;
                    queue.push([row, col]);
                    fresh--;
                }
            }
        }
        time++;
    }

    return fresh === 0 ? time : -1;
}

const assert = require('assert');
const g1 = [[2,1,1],[1,1,0],[0,1,1]];
assert.strictEqual(orangesRotting(g1), 4);
console.log("All tests passed!");
