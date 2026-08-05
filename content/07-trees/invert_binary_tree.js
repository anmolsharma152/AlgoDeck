/**
 * Problem: Invert Binary Tree
 * LeetCode: #226 (Easy) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(H)
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function invertTree(root) {
    if (!root) return null;
    const temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}

if (require.main === module) {
    const root = new TreeNode(4, new TreeNode(2), new TreeNode(7));
    const inverted = invertTree(root);
    console.assert(inverted.left.val === 7, "Test 1 Failed");
    console.assert(inverted.right.val === 2, "Test 2 Failed");
    console.log("All JavaScript tests passed for Invert Binary Tree!");
}
