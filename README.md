# 🧂 Salty Language

**Salty** is a toy programming language written in TypeScript.  
It's built from scratch with its own lexer, parser, and runtime — designed to learn how languages and interpreters work.

---

## ✅ Features Implemented

- [x] Tokenizer (lexer)
- [x] Parser (AST generator)
- [x] Runtime interpreter
- [x] Arithmetic & expressions (`+`, `-`, `*`, `/`)
- [x] Conditionals (`if`, `else`)
- [x] Loops (`while`)
- [x] Control statements (`break`, `continue`)
- [x] Blocks (`{ ... }`)
- [x] Print output

---

## 🧠 Language Syntax

```
x = 0;
while x < 5 {
  x = x + 1;
  if x == 3 {
    continue;
  }
  print x;
}
```

## Support Tokens

- **Identifiers:** x, foo, count
- **Numbers:** 42, 3.14
- **Symbols:** =, +, -, \*, /, {, }, (, ), ;
- **Operators:** ==, !=, <, >, <=, >=
- **Keywords:** if, else, while, print, break, continue

## How to Run

```bash
# Install dependencies
npm install

# Run a program from playground/test.slty
npm run start

# Dev mode with file watching
npm run dev

# Compile to JavaScript
npm run build

# Run compiled version
node dist/index.js

# Start interactive REPL
npm run repl

```

## Project Structure

```bash
src/
├── lexer/              # Tokenizer
├── parser/             # AST & parser logic
├── runtime/            # Interpreter
├── index.ts            # Entry point
├── repl.ts             # Interactive REPL

playground/             # Sample .slty programs
tests/                  # (optional) Test cases
```

## More Sample Code

```salty
x = 10;

if x > 5 {
  print x;
} else {
  print 0;
}

while x > 0 {
  print x;
  x = x - 1;
  if x == 5 {
    break;
  }
}

```
