export const EXAMPLES: Record<string, string> = {
  javascript: `
/**
 * Welcome to the AST Explorer!
 */
const ASTExplorer = ({ version }) => {
  const [active, setActive] = React.useState(true);
  
  return (
    <div className="syntax-tree">
      <h1>Code Analysis V{version}</h1>
      <button onClick={() => setActive(!active)}>
        Toggle Analysis
      </button>
    </div>
  );
};
`,
  typescript: `
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { id: 1, name: "Kartik" };
console.log(greet(user));
`,
  python: `
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# Test the function
print(f"Fibonacci of 10 is: {fibonacci(10)}")
`,
  rust: `
#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    println!("Point: {:?}", p);
}
`,
  c: `
#include <stdio.h>

int main() {
    int n = 10;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    printf("Sum of first %d integers is %d\\n", n, sum);
    return 0;
}
`,
  cpp: `
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    return 0;
}
`
}

export const MONACO_LANGS: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  rust: "rust",
  c: "c",
  cpp: "cpp",
}
