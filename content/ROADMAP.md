# 🗺️ Master DSA & Competitive Programming Progression Roadmap

This roadmap acts as your offline navigation map through the 19 topic pattern directories across **75 problems**.

---

## 🚀 The 5-Level Visualizer Progression Path

Below is the structured learning sequence matching the directory layout under the [`content/`](.) folder and the 5 Visualizer Levels:

| Level | Directory | Topic | Key Patterns & Algorithms Covered | Problem Count |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1 (Linear)** | [`01-arrays-and-hashing/`](01-arrays-and-hashing/) | Arrays & Hashing | Two Sum, Contains Duplicate, Kadane's, Dutch National Flag | 16 Problems |
| | [`02-two-pointers/`](02-two-pointers/) | Two Pointers | Reverse Array, Three Sum, Container with Water, Valid Palindrome | |
| | [`03-sliding-window/`](03-sliding-window/) | Sliding Window | Buy & Sell Stock, Chocolate Distribution, Smallest Subarray Sum | |
| | [`06-linked-list/`](06-linked-list/) | Linked Lists | Reverse Linked List, Merge Two Sorted Lists | |
| **Level 2 (Search & Trees)** | [`05-binary-search/`](05-binary-search/) | Binary Search | Matrix Binary Search, Search Space Reduction, Median Matrix | 15 Problems |
| | [`07-trees/`](07-trees/) | Binary Trees & BSTs | Invert Tree, Max Depth, Diameter, LCA, Level Order, Validate BST | |
| | [`08-heap-priority-queue/`](08-heap-priority-queue/) | Heaps & Priority Queues | Kth Largest Element, Top K Frequent Elements | |
| | [`04-stack/`](04-stack/) | Stacks & Queues | Valid Parentheses, Min Stack, Daily Temperatures | |
| **Level 3 (Graphs)** | [`09-backtracking/`](09-backtracking/) | Backtracking | Subsets, Permutations, Decision Trees | 14 Problems |
| | [`10-tries/`](10-tries/) | Tries | Prefix Matcher, Word Search | |
| | [`11-graphs/`](11-graphs/) | Graphs | Number of Islands, Clone Graph, Course Schedule, Rotting Oranges | |
| | [`12-advanced-graphs/`](12-advanced-graphs/) | Advanced Graphs | Shortest Paths (Dijkstra), Network Delay Time | |
| **Level 4 (DP & Greedy)** | [`13-1d-dynamic-programming/`](13-1d-dynamic-programming/) | 1D Dynamic Programming | Climbing Stairs, Max Product Subarray, Coin Change, House Robber | 15 Problems |
| | [`14-2d-dynamic-programming/`](14-2d-dynamic-programming/) | 2D Dynamic Programming | Longest Common Subsequence, Edit Distance, Partition Equal Subset | |
| | [`15-greedy/`](15-greedy/) | Greedy Algorithms | Jump Game, Min Jumps to End, Gas Station | |
| | [`16-intervals/`](16-intervals/) | Intervals | Merge Intervals | |
| **Level 5 (CP & Math)** | [`17-math-and-geometry/`](17-math-and-geometry/) | Math & Geometry | Large Factorials, Matrix Rotations, Spiral Traversals | 13 Problems |
| | [`18-bit-manipulation/`](18-bit-manipulation/) | Bit Manipulation | Number of 1 Bits, Bitwise Operations | |
| | [`19-advanced-cp-patterns/`](19-advanced-cp-patterns/) | Advanced CP Patterns | Rabin-Karp Hash, KMP, Boyer-Moore, Static Range Sum Queries | |

---

## 📊 Algorithmic Complexity Cheatsheet

### 1. Operations Complexity

| Data Structure | Access | Search | Insertion | Deletion | Space Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array** | $O(1)$ | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
| **Dynamic Array (`list` / `Array`)** | $O(1)$ | $O(N)$ | $O(1)$ amortized | $O(N)$ | $O(N)$ |
| **Singly-Linked List** | $O(N)$ | $O(N)$ | $O(1)$ (known node) | $O(1)$ | $O(N)$ |
| **Hash Table (`dict` / `Map`)** | N/A | $O(1)$ average | $O(1)$ average | $O(1)$ average | $O(N)$ |
| **Binary Search Tree (Balanced)**| $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| **Min/Max Heap** | $O(1)$ peek | $O(N)$ | $O(\log N)$ | $O(\log N)$ pop | $O(N)$ |

### 2. Standard Sorting Algorithms

| Sorting Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space Complexity | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ auxiliary | Yes |
| **Insertion Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ auxiliary | Yes |
| **Merge Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | Yes |
| **Quick Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ auxiliary | No |
| **Heap Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(1)$ auxiliary | No |

---

## 🛠️ Algorithm Decision Tree

When looking at a new coding problem, use this decision tree to identify the correct strategy:

```text
                               Is the Input Data Sorted?
                                     /           \
                                   Yes            No
                                   /                \
                       Use Binary Search        Is it an Array/String/List?
                       Or Two-Pointer Sweep       /                     \
                                                Yes                      No
                                                /                          \
                               Need subarrays/substrings?          Is it a Hierarchical/Network Structure?
                                     /             \                       /                 \
                                   Yes              No                   Yes                  No
                                   /                  \                  /                      \
                     Use Sliding Window          Use Hash Map/Set    Tree/Trie/Graph        Use Math/Bits/DP
                     Or Prefix Sums              Or Stack            Traversal (DFS/BFS)
```

---

## 🧠 Master Class Templates Index

Our repository implements standard boilerplates for competitive programming data structures:

* **Disjoint Set Union (DSU) / Union-Find**:
  * Located in: [`12-advanced-graphs/`](12-advanced-graphs/) (conceptual implementations)
  * Time Complexity: $O(\alpha(N))$ amortized (inverse Ackermann) via path compression and rank union.
* **Segment Trees (Range Queries)**:
  * Located in: [`19-advanced-cp-patterns/`](19-advanced-cp-patterns/)
  * Time Complexity: $O(\log N)$ for updates and queries.
* **String Pattern Matching (KMP, Rabin-Karp, Boyer-Moore)**:
  * Located in: [`19-advanced-cp-patterns/`](19-advanced-cp-patterns/)
  * Allows linear and sub-linear substring lookup.
