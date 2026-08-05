class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

const assert = require('assert');
const r1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
assert.strictEqual(maxDepth(r1), 3);
const r2 = new TreeNode(1, null, new TreeNode(2));
assert.strictEqual(maxDepth(r2), 2);
console.log("All tests passed!");
