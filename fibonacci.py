#!/usr/bin/env python3
"""
Fibonacci utilities with a small CLI and robust error handling.

Usage examples:
  - Print first N terms:   python fibonacci.py --count 10
  - Print the Nth term:    python fibonacci.py --nth 7

Notes:
  - "Nth term" is 1-based (1 -> 0, 2 -> 1, 3 -> 1, ...).
  - The series printed by --count starts from 0.
"""

from __future__ import annotations

import argparse
import sys
from typing import List


class FibonacciError(Exception):
    """Base exception for Fibonacci-related errors."""


def _non_negative_int(value: str) -> int:
    """argparse type: integer >= 0 with clear errors."""
    try:
        ivalue = int(value, 10)
    except ValueError as exc:
        raise argparse.ArgumentTypeError(f"Expected an integer, got: {value!r}") from exc
    if ivalue < 0:
        raise argparse.ArgumentTypeError("Value must be >= 0")
    return ivalue


def _positive_int(value: str) -> int:
    """argparse type: integer >= 1 with clear errors."""
    n = _non_negative_int(value)
    if n == 0:
        raise argparse.ArgumentTypeError("Value must be >= 1")
    return n


def fib_sequence(n: int) -> List[int]:
    """Return the first n Fibonacci numbers (starting at 0)."""
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 0:
        raise ValueError("n must be >= 0")
    seq: List[int] = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq


def fib_nth(n: int) -> int:
    """Return the Nth Fibonacci number using 1-based indexing.

    Examples: 1 -> 0, 2 -> 1, 3 -> 1, 4 -> 2
    """
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n <= 0:
        raise ValueError("n must be >= 1")
    if n == 1:
        return 0
    a, b = 0, 1
    # We already handled n == 1; for n == 2, result is b after 0 iterations
    for _ in range(2, n):
        a, b = b, a + b
    return b


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fibonacci series utilities with error handling",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--count",
        type=_non_negative_int,
        help="Print the first N terms starting at 0",
    )
    group.add_argument(
        "--nth",
        type=_positive_int,
        help="Print the Nth term (1-based: 1->0, 2->1)",
    )

    parser.add_argument(
        "--format",
        choices=["list", "lines", "csv"],
        default="list",
        help="Output format for --count",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    try:
        if args.count is not None:
            seq = fib_sequence(args.count)
            if args.format == "list":
                print("[" + ", ".join(str(x) for x in seq) + "]")
            elif args.format == "csv":
                print(",".join(str(x) for x in seq))
            else:  # lines
                for x in seq:
                    print(x)
        else:
            # args.nth must be set due to mutually exclusive required group
            print(fib_nth(args.nth))
        return 0
    except KeyboardInterrupt:
        print("Interrupted by user", file=sys.stderr)
        return 130  # Typical exit code for SIGINT
    except (TypeError, ValueError, FibonacciError) as err:
        print(f"Error: {err}", file=sys.stderr)
        return 2
    except Exception as err:  # defensive: catch-all for unexpected errors
        print(f"Unexpected error: {err}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

