class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function lowestCommonAncestor(root, p, q) {
    let curr = root;
    while (curr) {
        if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else {
            return curr;
        }
    }
    return null;
}

const assert = require('assert');
const p = new TreeNode(2);
const q = new TreeNode(8);
const root = new TreeNode(6, p, q);
assert.strictEqual(lowestCommonAncestor(root, p, q).val, 6);
console.log("All tests passed!");
