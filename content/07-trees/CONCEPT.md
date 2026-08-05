# Pattern 07: Binary Trees & BST

## Core Concepts & Strategy
Binary Trees exhibit hierarchical branching. Tree problems are naturally solved using **Recursion / DFS** (Pre-order, In-order, Post-order) or **BFS Level Order Traversal** using a Queue.

## Key Traversal Types
1. **Pre-order (Root ➔ Left ➔ Right)**: Tree cloning / serialization.
2. **In-order (Left ➔ Root ➔ Right)**: Gives sorted order for BSTs!
3. **Post-order (Left ➔ Right ➔ Root)**: Bottom-up computation (e.g. tree height, path sum).
4. **BFS Level-order**: Row-by-row traversal using Queue.

---

## Code Boilerplate Templates

### Python Template (Invert Binary Tree)
```python
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
```

### JavaScript Template (Invert Binary Tree)
```javascript
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
```
