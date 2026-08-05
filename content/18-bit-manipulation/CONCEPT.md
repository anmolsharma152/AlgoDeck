# Pattern 18: Bit Manipulation

## Core Concepts & Strategy
Bit Manipulation involves checking, setting, clearing, or toggling individual bits of integers. It is highly optimized at the CPU level and executes in $O(1)$ time. 

## Bitwise Operators
- **AND (`&`)**: Sets each bit to 1 if both bits are 1.
- **OR (`|`)**: Sets each bit to 1 if at least one bit is 1.
- **XOR (`^`)**: Sets each bit to 1 if only one of the bits is 1. Important property: $X \wedge X = 0$ and $X \wedge 0 = X$.
- **NOT (`~`)**: Inverts all the bits.
- **Shifts (`<<`, `>>`)**: Shifts bits to left or right (equivalent to multiplying or dividing by 2).

## Common Bit Hacks
- Check if odd: `x & 1 == 1`
- Clear lowest set bit: `x & (x - 1)`
- Get lowest set bit (lowbit): `x & (-x)`
- Multiply by $2^k$: `x << k`
- Divide by $2^k$: `x >> k`

---

## Code Boilerplate Templates

### Python Template (Count Set Bits / Hamming Weight)
```python
def hamming_weight(n: int) -> int:
    """
    Counts the number of set bits (1s) in an integer.
    Time Complexity: O(1) -> Max 32 or 64 iterations
    Space Complexity: O(1)
    """
    count = 0
    while n:
        n &= (n - 1)  # Clear the lowest set bit
        count += 1
    return count
```

### JavaScript Template (Count Set Bits / Hamming Weight)
```javascript
function hammingWeight(n) {
    /**
     * Counts the number of set bits (1s) in an integer.
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     */
    let count = 0;
    while (n !== 0) {
        n &= (n - 1); // Clear the lowest set bit
        count++;
    }
    return count;
}
```
