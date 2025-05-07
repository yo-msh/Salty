import readline from 'readline';
import { tokenize } from './lexer/tokenizer';
import { parse } from './parser/parser';
import { evaluate } from './runtime/interpreter';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '🧂> ',
});

console.log("Welcome to Salty REPL (type 'exit' to quit)");
let buffer = "";
let context = { variables: {} };

rl.prompt();

rl.on('line', (line) => {
  if (line.trim() === 'exit') {
    rl.close();
    return;
  }

  buffer += line.trim();

  // Allow multi-line support if needed
  if (!buffer.endsWith(';')) {
    rl.prompt();
    return;
  }

  try {
    const tokens = tokenize(buffer);
    const ast = parse(tokens);
    evaluate(ast, context);
  } catch (err: any) {
    console.error("Error:", err.message);
  }

  buffer = "";
  rl.prompt();
});
