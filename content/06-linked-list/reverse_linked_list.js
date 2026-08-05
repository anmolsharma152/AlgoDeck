/**
 * Problem: Reverse Linked List
 * LeetCode: #206 (Easy) | NeetCode 150 | Blind 75
 * 
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */

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

function toArray(head) {
    const res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    return res;
}

if (require.main === module) {
    const node3 = new ListNode(3);
    const node2 = new ListNode(2, node3);
    const node1 = new ListNode(1, node2);

    const reversedHead = reverseList(node1);
    console.assert(JSON.stringify(toArray(reversedHead)) === JSON.stringify([3, 2, 1]), "Test Failed");
    console.log("All JavaScript tests passed for Reverse Linked List!");
}
