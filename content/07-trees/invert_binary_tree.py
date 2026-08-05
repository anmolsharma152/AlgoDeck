"""
Problem: Invert Binary Tree
LeetCode: #226 (Easy) | NeetCode 150 | Blind 75

Given the root of a binary tree, invert the tree, and return its root.

Time Complexity: O(N)
Space Complexity: O(H) where H is tree height
"""

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

if __name__ == "__main__":
    # Tree: 4 -> L:2, R:7
    root = TreeNode(4, TreeNode(2), TreeNode(7))
    inverted = invert_tree(root)
    assert inverted.left.val == 7
    assert inverted.right.val == 2
    print("All Python tests passed for Invert Binary Tree!")
