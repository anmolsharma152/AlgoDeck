# Pattern 17: Math & Geometry

## Core Concepts & Strategy
Math & Geometry problems require algorithmic applications of basic mathematics (division, modulus, matrices, geometry). Common patterns include modular arithmetic, Euclidean GCD algorithm, the Sieve of Eratosthenes, and 2D matrix rotations.

## Sub-Patterns & Identification Signatures
1. **Euclidean GCD**:
   - Signature: "Find greatest common divisor".
   - Equation: $gcd(a, b) = gcd(b, a \pmod b)$ where $gcd(a, 0) = a$.
2. **Modular Exponentiation**:
   - Signature: "Calculate $x^n \pmod m$ efficiently".
   - Technique: Binary exponentiation in $O(\log N)$ time.
3. **Sieve of Eratosthenes**:
   - Signature: "Count primes less than N".
   - Technique: Create a boolean array of size $N$. Cross out multiples of each prime starting from 2 up to $\sqrt{N}$.
4. **2D Matrix Rotation**:
   - Signature: "Rotate matrix by 90 degrees in-place".
   - Technique: Transpose the matrix (swap `matrix[i][j]` with `matrix[j][i]`), then reverse each row.

---

## Code Boilerplate Templates

### Python Template (GCD & Binary Exponentiation)
```python
def gcd(a: int, b: int) -> int:
    """
    Time Complexity: O(log(min(a, b)))
    """
    while b:
        a, b = b, a % b
    return a

def bin_pow(base: int, exp: int) -> int:
    """
    Computes base^exp in O(log exp) time
    """
    res = 1
    while exp > 0:
        if exp & 1:
            res *= base
        base *= base
        exp >>= 1
    return res
```

### JavaScript Template (GCD & Binary Exponentiation)
```javascript
function gcd(a, b) {
    /**
     * Time Complexity: O(log(min(a, b)))
     */
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function binPow(base, exp) {
    /**
     * Computes base^exp in O(log exp) time
     */
    let res = 1;
    base = BigInt(base);
    exp = BigInt(exp);
    while (exp > 0n) {
        if (exp & 1n) {
            res *= base;
        }
        base *= base;
        exp >>= 1n;
    }
    return Number(res);
}
```
