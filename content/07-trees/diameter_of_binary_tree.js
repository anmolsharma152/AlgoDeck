class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function diameterOfBinaryTree(root) {
    let res = 0;
    function dfs(node) {
        if (!node) return 0;
        let left = dfs(node.left);
        let right = dfs(node.right);
        res = Math.max(res, left + right);
        return 1 + Math.max(left, right);
    }
    dfs(root);
    return res;
}

const assert = require('assert');
const r1 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3));
assert.strictEqual(diameterOfBinaryTree(r1), 3);
console.log("All tests passed!");
