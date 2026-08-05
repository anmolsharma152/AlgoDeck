class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorderList(head: ListNode) -> None:
    if not head:
        return
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    second = slow.next
    prev = slow.next = None
    while second:
        tmp = second.next
        second.next = prev
        prev = second
        second = tmp

    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2

if __name__ == "__main__":
    head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
    reorderList(head)
    out = []
    curr = head
    while curr:
        out.append(curr.val)
        curr = curr.next
    assert out == [1,4,2,3], "Test 1 Failed"
    print("All tests passed!")
