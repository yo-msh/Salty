import fs from "fs";
import path from "path";
import { tokenize } from "./lexer/tokenizer";
import { parse } from "./parser/parser";
import { evaluate } from "./runtime/interpreter";

const filePath = path.join(__dirname, "..", "playground", "test.slty");
const code = fs.readFileSync(filePath, "utf-8");

console.log("Provide Salty code to be executed:\n");
console.log(code);

console.log("After Tokenized:\n");
// console.log(tokenize(code));

const tokens = tokenize(code);
tokens.forEach((token) => {
  console.log(`Type: ${token.type}, Value: ${token.value}`);
});

const ast = parse(tokens);
console.log("After Parsed:\n");
console.dir(ast, { depth: null });

console.log("OUTPUT:\n");
evaluate(ast);
