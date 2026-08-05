class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function isValidBST(root) {
    function valid(node, min, max) {
        if (!node) return true;
        if (node.val <= min || node.val >= max) return false;
        return valid(node.left, min, node.val) && valid(node.right, node.val, max);
    }
    return valid(root, -Infinity, Infinity);
}

const assert = require('assert');
const r1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
assert.strictEqual(isValidBST(r1), true);
console.log("All tests passed!");
