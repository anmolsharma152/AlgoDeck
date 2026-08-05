class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    curr = root
    while curr:
        if p.val > curr.val and q.val > curr.val:
            curr = curr.right
        elif p.val < curr.val and q.val < curr.val:
            curr = curr.left
        else:
            return curr
    return None

if __name__ == "__main__":
    p = TreeNode(2)
    q = TreeNode(8)
    root = TreeNode(6, p, q)
    assert lowestCommonAncestor(root, p, q).val == 6, "Test 1 Failed"
    print("All tests passed!")
