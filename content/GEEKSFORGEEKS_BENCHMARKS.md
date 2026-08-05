# GeeksforGeeks & Classic Interview Benchmarks

This guide curates classic problem benchmarks, explanations, and direct links to **GeeksforGeeks** and **LeetCode** practice challenges categorized by data structure and pattern.

---

## 📚 Table of Contents
1. [Array Benchmarks](#-array-benchmarks)
2. [Matrix Benchmarks](#-matrix-benchmarks)
3. [String Benchmarks](#-string-benchmarks)
4. [Linked List Benchmarks](#-linked-list-benchmarks)
5. [Stack & Queue Benchmarks](#-stack--queue-benchmarks)
6. [Tree & BST Benchmarks](#-tree--bst-benchmarks)
7. [Graph & DP Benchmarks](#-graph--dp-benchmarks)

---

## 📊 Array Benchmarks

| Problem Statement | Pattern / Algorithm | Practice Link | Time | Space |
| :--- | :--- | :--- | :--- | :--- |
| **Reverse the array** | Two Pointers | [GeeksforGeeks](https://www.geeksforgeeks.org/write-a-program-to-reverse-an-array-or-string/) | $O(N)$ | $O(1)$ |
| **Maximum and Minimum in an array** | Linear Scan / Divide & Conquer | [GeeksforGeeks](https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/) | $O(N)$ | $O(1)$ |
| **Kth Smallest / Largest Element** | Min-Heap / QuickSelect | [GFG Practice](https://practice.geeksforgeeks.org/problems/kth-smallest-element/0) | $O(N \log K)$ | $O(K)$ |
| **Sort an array of 0s, 1s, and 2s** | Dutch National Flag (3-Way) | [GFG Practice](https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s/0) | $O(N)$ | $O(1)$ |
| **Move negative numbers to beginning** | Two Pointers / Partition | [GeeksforGeeks](https://www.geeksforgeeks.org/move-negative-numbers-beginning-positive-end-constant-extra-space/) | $O(N)$ | $O(1)$ |
| **Union and Intersection of sorted arrays** | Two Pointers | [GFG Practice](https://practice.geeksforgeeks.org/problems/union-of-two-arrays/0) | $O(N + M)$ | $O(1)$ |
| **Cyclically rotate array by one** | Pointer Shift | [GFG Practice](https://practice.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one/0) | $O(N)$ | $O(1)$ |
| **Largest sum contiguous subarray** | Kadane's Algorithm | [GFG Practice](https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0) | $O(N)$ | $O(1)$ |
| **Minimize maximum difference of heights** | Greedy Sorting | [GFG Practice](https://practice.geeksforgeeks.org/problems/minimize-the-heights3351/1) | $O(N \log N)$ | $O(1)$ |
| **Minimum jumps to reach end** | Dynamic Programming / Greedy | [GFG Practice](https://practice.geeksforgeeks.org/problems/minimum-number-of-jumps/0) | $O(N)$ | $O(1)$ |
| **Find duplicate in N+1 array** | Floyd's Tortoise & Hare | [LeetCode #287](https://leetcode.com/problems/find-the-duplicate-number/) | $O(N)$ | $O(1)$ |
| **Merge two sorted arrays without extra space**| Gap Algorithm / Sorting | [GFG Practice](https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays5135/1) | $O((N+M) \log(N+M))$ | $O(1)$ |
| **Count Inversions in Array** | Merge Sort Divide & Conquer | [GFG Practice](https://practice.geeksforgeeks.org/problems/inversion-of-array/0) | $O(N \log N)$ | $O(N)$ |
| **Best time to buy/sell stock** | Dynamic Programming / Greedy | [LeetCode #121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | $O(N)$ | $O(1)$ |
| **Count pairs with given sum** | Hash Map Complement | [GFG Practice](https://practice.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1) | $O(N)$ | $O(N)$ |
| **Common elements in 3 sorted arrays** | Three Pointers | [GFG Practice](https://practice.geeksforgeeks.org/problems/common-elements1132/1) | $O(N_1 + N_2 + N_3)$ | $O(1)$ |
| **Subarray with 0 sum** | Prefix Sum + Hash Set | [GFG Practice](https://practice.geeksforgeeks.org/problems/subarray-with-0-sum/0) | $O(N)$ | $O(N)$ |
| **Factorials of large numbers** | BigInt Array Multiplications | [GFG Practice](https://practice.geeksforgeeks.org/problems/factorials-of-large-numbers/0) | $O(N^2)$ | $O(N)$ |
| **Maximum product subarray** | Modified Kadane's | [GFG Practice](https://practice.geeksforgeeks.org/problems/maximum-product-subarray3604/1) | $O(N)$ | $O(1)$ |
| **Longest consecutive subsequence** | Hash Set Traversal | [GFG Practice](https://practice.geeksforgeeks.org/problems/longest-consecutive-subsequence/0) | $O(N)$ | $O(N)$ |
| **Elements appearing more than N/K times** | Boyer-Moore Majority Vote | [GeeksforGeeks](https://www.geeksforgeeks.org/given-an-array-of-of-size-n-finds-all-the-elements-that-appear-more-than-nk-times/) | $O(N)$ | $O(K)$ |
| **Trapping Rain Water** | Two Pointers / Monotonic Stack | [GFG Practice](https://practice.geeksforgeeks.org/problems/trapping-rain-water/0) | $O(N)$ | $O(1)$ |
| **Chocolate Distribution Problem** | Sorting + Sliding Window | [GFG Practice](https://practice.geeksforgeeks.org/problems/chocolate-distribution-problem/0) | $O(N \log N)$ | $O(1)$ |
| **Smallest subarray with sum > K** | Sliding Window (Variable) | [GFG Practice](https://practice.geeksforgeeks.org/problems/smallest-subarray-with-sum-greater-than-x/0) | $O(N)$ | $O(1)$ |

---

## 🔲 Matrix Benchmarks

| Problem Statement | Pattern / Algorithm | Practice Link | Time | Space |
| :--- | :--- | :--- | :--- | :--- |
| **Spiral traversal on a Matrix** | Boundary Simulation | [GFG Practice](https://practice.geeksforgeeks.org/problems/spirally-traversing-a-matrix/0) | $O(M \times N)$ | $O(1)$ |
| **Search an element in 2D Matrix** | Binary Search on 1D Mapping | [LeetCode #74](https://leetcode.com/problems/search-a-2d-matrix/) | $O(\log(M \times N))$ | $O(1)$ |
| **Find median in row-wise sorted matrix** | Binary Search on Value Range | [GFG Practice](https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1) | $O(32 \cdot M \log N)$ | $O(1)$ |
| **Row with maximum number of 1s** | Binary Search / Top-Right Start | [GFG Practice](https://practice.geeksforgeeks.org/problems/row-with-max-1s0023/1) | $O(M + N)$ | $O(1)$ |
| **Rotate Matrix by 90 degrees** | Transpose + Reverse Rows | [GeeksforGeeks](https://www.geeksforgeeks.org/rotate-a-matrix-by-90-degree-in-clockwise-direction-without-using-any-extra-space/) | $O(N^2)$ | $O(1)$ |

---

## 🔤 String Benchmarks

| Problem Statement | Pattern / Algorithm | Practice Link | Time | Space |
| :--- | :--- | :--- | :--- | :--- |
| **Check Palindrome** | Two Pointers | [GFG Practice](https://practice.geeksforgeeks.org/problems/palindrome-string0817/1) | $O(N)$ | $O(1)$ |
| **Check String Rotations** | String Concatenation `(S1+S1)` | [GeeksforGeeks](https://www.geeksforgeeks.org/a-program-to-check-if-strings-are-rotations-of-each-other/) | $O(N)$ | $O(N)$ |
| **Longest Palindromic Substring** | Expand Around Center / DP | [GFG Practice](https://practice.geeksforgeeks.org/problems/longest-palindrome-in-a-string/0) | $O(N^2)$ | $O(1)$ |
| **Print all Permutations of String** | Backtracking | [GFG Practice](https://practice.geeksforgeeks.org/problems/permutations-of-a-given-string/0) | $O(N \cdot N!)$ | $O(N)$ |
| **Word Wrap Problem** | Dynamic Programming | [GFG Practice](https://practice.geeksforgeeks.org/problems/word-wrap/0) | $O(N^2)$ | $O(N)$ |
| **Edit Distance** | 2D Dynamic Programming | [GFG Practice](https://practice.geeksforgeeks.org/problems/edit-distance3702/1) | $O(M \cdot N)$ | $O(M \cdot N)$ |
| **Rabin-Karp Pattern Searching** | Rolling Hash Algorithm | [GeeksforGeeks](https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/) | $O(N + M)$ avg | $O(1)$ |
| **KMP Pattern Searching** | Longest Prefix Suffix (LPS) | [GFG Practice](https://practice.geeksforgeeks.org/problems/longest-prefix-suffix2527/1) | $O(N + M)$ | $O(M)$ |
| **Boyer Moore Algorithm** | Bad Character Heuristic | [GeeksforGeeks](https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/) | $O(N / M)$ best | $O(\Sigma)$ |
