class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function levelOrder(root) {
    let res = [];
    if (!root) return res;
    let queue = [root];
    while (queue.length > 0) {
        let len = queue.length;
        let level = [];
        for (let i = 0; i < len; i++) {
            let node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        res.push(level);
    }
    return res;
}

const assert = require('assert');
const r1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
assert.deepStrictEqual(levelOrder(r1), [[3],[9,20],[15,7]]);
console.log("All tests passed!");
