class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function mergeTwoLists(l1, l2) {
    let dummy = new ListNode();
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val < l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    if (l1) tail.next = l1;
    if (l2) tail.next = l2;
    return dummy.next;
}

const assert = require('assert');
const a = new ListNode(1, new ListNode(2, new ListNode(4)));
const b = new ListNode(1, new ListNode(3, new ListNode(4)));
let res = mergeTwoLists(a, b);
let out = [];
while (res) {
    out.push(res.val);
    res = res.next;
}
assert.deepStrictEqual(out, [1,1,2,3,4,4]);
console.log("All tests passed!");
