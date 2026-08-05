# Pattern 08: Heap / Priority Queue

## Core Concepts & Strategy
A Heap (or Priority Queue) is a specialized tree-based data structure that satisfies the heap property: in a Min-Heap, the parent key is always less than or equal to the child keys, making the minimum element always at the root. Heap insertion and deletion take $O(\log N)$ time, while fetching the top element is $O(1)$. 
Use heaps when you need to repeatedly retrieve the minimum or maximum element while dynamically adding new elements.

## Sub-Patterns & Identification Signatures
1. **Top K Elements**:
   - Signature: "Find the K largest/smallest elements...", "K closest points to origin".
   - Technique: Maintain a Min-Heap of size $K$ for "largest" elements or Max-Heap of size $K$ for "smallest" elements.
2. **K-way Merge**:
   - Signature: "Merge K sorted lists/arrays".
   - Technique: Push the first element of each of the $K$ lists into a Min-Heap. Repeatedly extract the min element and push the next element of that specific list.
3. **Two Heaps (Stream Median)**:
   - Signature: "Find the median of a running stream of numbers".
   - Technique: Maintain a Max-Heap for the lower half of the numbers, and a Min-Heap for the upper half. Balance their sizes so they differ by at most 1.

---

## Code Boilerplate Templates

### Python Template (Using `heapq`)
```python
import heapq

def find_k_largest(nums: list[int], k: int) -> list[int]:
    """
    Time Complexity: O(N log K)
    Space Complexity: O(K)
    """
    # Keep heap of size K
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap
```

### JavaScript Template (Manual Min-Heap insertion / extract)
```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }
    push(val) {
        this.heap.push(val);
        this.siftUp(this.heap.length - 1);
    }
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return root;
    }
    siftUp(idx) {
        let parent = Math.floor((idx - 1) / 2);
        while (idx > 0 && this.heap[idx] < this.heap[parent]) {
            [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
            idx = parent;
            parent = Math.floor((idx - 1) / 2);
        }
    }
    siftDown(idx) {
        let smallest = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
        if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
        if (smallest !== idx) {
            [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
            this.siftDown(smallest);
        }
    }
}
```
