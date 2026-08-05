class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reorderList(head) {
    if (!head) return;
    let slow = head, fast = head.next;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    let second = slow.next;
    let prev = slow.next = null;
    while (second) {
        let tmp = second.next;
        second.next = prev;
        prev = second;
        second = tmp;
    }

    let first = head;
    second = prev;
    while (second) {
        let tmp1 = first.next, tmp2 = second.next;
        first.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}

const assert = require('assert');
const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4))));
reorderList(head);
let out = [];
let curr = head;
while (curr) {
    out.push(curr.val);
    curr = curr.next;
}
assert.deepStrictEqual(out, [1,4,2,3]);
console.log("All tests passed!");
