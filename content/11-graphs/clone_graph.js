class Node {
    constructor(val = 0, neighbors = []) {
        this.val = val;
        this.neighbors = neighbors;
    }
}

function cloneGraph(node) {
    if (!node) return null;
    let oldToNew = new Map();
    function dfs(n) {
        if (oldToNew.has(n)) return oldToNew.get(n);
        let copy = new Node(n.val);
        oldToNew.set(n, copy);
        for (let nei of n.neighbors) {
            copy.neighbors.push(dfs(nei));
        }
        return copy;
    }
    return dfs(node);
}

const assert = require('assert');
const n1 = new Node(1);
const n2 = new Node(2);
n1.neighbors.push(n2);
n2.neighbors.push(n1);
const cloned = cloneGraph(n1);
assert.strictEqual(cloned.val, 1);
assert.strictEqual(cloned.neighbors[0].val, 2);
console.log("All tests passed!");
