function pacificAtlantic(heights) {
    let ROWS = heights.length, COLS = heights[0].length;
    let pac = new Set(), atl = new Set();

    function dfs(r, c, visit, prevHeight) {
        let key = r + ',' + c;
        if (visit.has(key) || r < 0 || c < 0 || r >= ROWS || c >= COLS || heights[r][c] < prevHeight) {
            return;
        }
        visit.add(key);
        dfs(r + 1, c, visit, heights[r][c]);
        dfs(r - 1, c, visit, heights[r][c]);
        dfs(r, c + 1, visit, heights[r][c]);
        dfs(r, c - 1, visit, heights[r][c]);
    }

    for (let c = 0; c < COLS; c++) {
        dfs(0, c, pac, heights[0][c]);
        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c]);
    }
    for (let r = 0; r < ROWS; r++) {
        dfs(r, 0, pac, heights[r][0]);
        dfs(r, COLS - 1, atl, heights[r][COLS - 1]);
    }

    let res = [];
    for (let key of pac) {
        if (atl.has(key)) {
            res.push(key.split(',').map(Number));
        }
    }
    return res;
}

const assert = require('assert');
const h = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
assert(pacificAtlantic(h).length >= 7);
console.log("All tests passed!");
