class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def diameterOfBinaryTree(root: TreeNode) -> int:
    res = 0
    def dfs(node):
        nonlocal res
        if not node:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        res = max(res, left + right)
        return 1 + max(left, right)
    dfs(root)
    return res

if __name__ == "__main__":
    r1 = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
    assert diameterOfBinaryTree(r1) == 3, "Test 1 Failed"
    r2 = TreeNode(1, TreeNode(2))
    assert diameterOfBinaryTree(r2) == 1, "Test 2 Failed"
    print("All tests passed!")
