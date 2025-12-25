#!/usr/bin/env python3
"""
Fibonacci series generator.

Usage:
  python fibonacci.py 10    # prints the first 10 Fibonacci numbers

You can also import `fibonacci` from this module:
  from fibonacci import fibonacci
  list(fibonacci(10))
"""

from __future__ import annotations
import sys


def fibonacci(n: int):
    """Yield the first n numbers of the Fibonacci sequence.

    Args:
        n: How many terms to generate (must be >= 0).

    Yields:
        The next Fibonacci number in the sequence.
    """
    if n < 0:
        raise ValueError("n must be non-negative")
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv

    if not argv or argv[0] in {"-h", "--help"}:
        print("Usage: python fibonacci.py <count>")
        return 0

    try:
        n = int(argv[0])
    except ValueError:
        print("Error: <count> must be an integer.", file=sys.stderr)
        return 1

    if n < 0:
        print("Error: <count> must be non-negative.", file=sys.stderr)
        return 1

    print(" ".join(str(x) for x in fibonacci(n)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())