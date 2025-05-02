# 🧂 Salty Language

**Salty** is a toy programming language written in TypeScript for learning how compilers work.

---

## ✅ Features Implemented

- [x] Tokenizer (Lexical Analyzer)
- [ ] Parser (AST Generator)
- [ ] Interpreter (Runtime)
- [ ] Playground REPL
- [ ] Electron GUI (optional)

---

## 🧠 Language Syntax

```
x = 10;
y = x + 5;
print y;
```

## How to Run

```bash
npm install
npm run start           # run src/index.ts
npm run dev             # auto-reload mode
npm run build           # compile TS to JS
node dist/index.js      # run compiled JS
```

## Project Structure

```bash
src/
├── lexer/            # Tokenizer logic
└── index.ts          # Entry point

playground/           # Sample `.slty` programs
tests/                # Unit tests (coming soon)
```
