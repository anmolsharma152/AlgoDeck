# Pattern 06: Linked List

## Core Concepts & Strategy
Linked lists consist of nodes linked by pointers. Mastery of linked list manipulation requires pointer manipulation discipline (preventing loss of reference) and Floyd's Tortoise & Hare algorithm.

## Key Techniques
1. **Dummy Head Pointer**: Simplifies edge cases when inserting/deleting the original head.
2. **In-Place Pointer Reversal**: Maintain `prev`, `curr`, and `nxt`.
3. **Fast & Slow Pointers**: Find middle node, detect cycle, find $K$-th node from end.

---

## Code Boilerplate Templates

### Python Template (Reverse Linked List)
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
```

### JavaScript Template (Reverse Linked List)
```javascript
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    let prev = null, curr = head;
    while (curr) {
        const nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}
```
