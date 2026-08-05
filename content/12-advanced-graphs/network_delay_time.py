"""
Problem: Network Delay Time
LeetCode: #743 (Medium) | NeetCode 150
"""
import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    """
    Time Complexity: O(E * log V)
    Space Complexity: O(V + E)
    """
    adj = {i: [] for i in range(1, n + 1)}
    for u, v, w in times:
        adj[u].append((v, w))
        
    min_heap = [(0, k)] # (cost, node)
    visit = {}
    
    while min_heap:
        w1, n1 = heapq.heappop(min_heap)
        if n1 in visit:
            continue
        visit[n1] = w1
        
        for n2, w2 in adj[n1]:
            if n2 not in visit:
                heapq.heappush(min_heap, (w1 + w2, n2))
                
    return max(visit.values()) if len(visit) == n else -1

if __name__ == "__main__":
    assert network_delay_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2
    assert network_delay_time([[1, 2, 1]], 2, 1) == 1
    assert network_delay_time([[1, 2, 1]], 2, 2) == -1
    print("Python: network_delay_time passed tests!")
