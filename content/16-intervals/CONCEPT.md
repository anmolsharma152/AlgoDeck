# Pattern 16: Intervals & Sweep Line

## Core Concepts & Strategy
Interval problems involve sets of ranges (like start/end times). To solve interval problems, you almost always need to sort the intervals by their start times first. This allows processing intervals linearly to identify overlaps, merges, and insertions.

## Sub-Patterns & Identification Signatures
1. **Merge Intervals**:
   - Signature: "Merge all overlapping intervals".
   - Technique: Sort by start time. Compare current interval's start with previous interval's end. If $start_i \le end_{prev}$, merge them by updating $end_{prev} = \max(end_{prev}, end_i)$.
2. **Insert Interval**:
   - Signature: "Insert a new interval into a list of sorted non-overlapping intervals".
   - Technique: Add all intervals ending before the new interval starts. Merge the new interval with all overlapping intervals. Add all remaining intervals.
3. **Sweep Line / Meeting Rooms**:
   - Signature: "Find minimum number of meeting rooms required".
   - Technique: Separate start times and end times. Sort both. Use two pointers to track how many rooms are active concurrently.

---

## Code Boilerplate Templates

### Python Template (Merge Intervals)
```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    """
    Time Complexity: O(N log N)
    Space Complexity: O(N)
    """
    if not intervals: return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
            
    return merged
```

### JavaScript Template (Merge Intervals)
```javascript
function merge(intervals) {
    /**
     * Time Complexity: O(N log N)
     * Space Complexity: O(N)
     */
    if (intervals.length === 0) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const prev = merged[merged.length - 1];
        if (current[0] <= prev[1]) {
            prev[1] = Math.max(prev[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    
    return merged;
}
```
