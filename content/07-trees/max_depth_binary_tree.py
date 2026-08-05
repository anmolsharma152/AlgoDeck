class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))

if __name__ == "__main__":
    r1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
    assert maxDepth(r1) == 3, "Test 1 Failed"
    r2 = TreeNode(1, None, TreeNode(2))
    assert maxDepth(r2) == 2, "Test 2 Failed"
    print("All tests passed!")
