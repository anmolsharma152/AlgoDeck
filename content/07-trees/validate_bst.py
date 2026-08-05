class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root: TreeNode) -> bool:
    def valid(node, left, right):
        if not node:
            return True
        if not (left < node.val < right):
            return False
        return valid(node.left, left, node.val) and valid(node.right, node.val, right)
    return valid(root, float("-inf"), float("inf"))

if __name__ == "__main__":
    r1 = TreeNode(2, TreeNode(1), TreeNode(3))
    assert isValidBST(r1) == True, "Test 1 Failed"
    print("All tests passed!")
