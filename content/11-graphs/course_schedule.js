function canFinish(numCourses, prerequisites) {
    let preMap = {};
    for (let i = 0; i < numCourses; i++) preMap[i] = [];
    for (let [crs, pre] of prerequisites) preMap[crs].push(pre);

    let visiting = new Set();

    function dfs(crs) {
        if (visiting.has(crs)) return false;
        if (preMap[crs].length === 0) return true;
        visiting.add(crs);
        for (let pre of preMap[crs]) {
            if (!dfs(pre)) return false;
        }
        visiting.delete(crs);
        preMap[crs] = [];
        return true;
    }

    for (let c = 0; c < numCourses; c++) {
        if (!dfs(c)) return false;
    }
    return true;
}

const assert = require('assert');
assert.strictEqual(canFinish(2, [[1,0]]), true);
assert.strictEqual(canFinish(2, [[1,0],[0,1]]), false);
console.log("All tests passed!");
