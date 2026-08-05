"""
Problem: Reverse Linked List
LeetCode: #206 (Easy) | NeetCode 150 | Blind 75

Given the head of a singly linked list, reverse the list, and return the reversed list.

Time Complexity: O(N)
Space Complexity: O(1)
"""

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

def to_list(head: ListNode) -> list:
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

if __name__ == "__main__":
    node3 = ListNode(3)
    node2 = ListNode(2, node3)
    node1 = ListNode(1, node2)
    
    reversed_head = reverse_list(node1)
    assert to_list(reversed_head) == [3, 2, 1]
    print("All Python tests passed for Reverse Linked List!")
