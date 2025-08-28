
def generate_fibonacci(n):
    """
    Generates and prints the Fibonacci series up to n numbers.
    
    Parameters:
    n (int): The length of the Fibonacci series to be generated.
    """
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b
    print()  # for newline after printing the series