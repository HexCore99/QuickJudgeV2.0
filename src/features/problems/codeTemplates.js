export const LANGUAGES = [
  { id: "c", label: "C", monacoLang: "c" },
  { id: "cpp", label: "C++", monacoLang: "cpp" },
  { id: "java", label: "Java", monacoLang: "java" },
  { id: "python", label: "Python", monacoLang: "python" },
  { id: "rust", label: "Rust", monacoLang: "rust" },
];

export const CODE_TEMPLATES = {
  c: `#include <stdio.h>

int main() {
    // your code here

    return 0;
}
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

    // your code here

    return 0;
}
`,

  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // your code here

        sc.close();
    }
}
`,

  python: `# your code here
`,

  rust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();

    // your code here
}
`,
};
