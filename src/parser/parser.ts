import { Token } from "../lexer/constants";
import {
  ASTNode,
  AssignmentNode,
  BinaryExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  UnaryExpressionNode,
  PrintStatementNode,
  BlockStatementNode,
  IfStatementNode
} from "./ast";

export function parse(tokens: Token[]): ASTNode[] {
  let current = 0;
  const ast: ASTNode[] = [];

  function peek() {
    return tokens[current];
  }

  function consume() {
    return tokens[current++];
  }

  function expect(type: string, value?: string) {
    const token = consume();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error(`Expected ${type} "${value}", got ${token.type} "${token.value}"`);
    }
    return token;
  }

  function parseExpression(): ASTNode {
    let left = parsePrimary();
  
    while (true) {
      const next = peek();
      if (next && next.type === "symbol" && ["+", "-", "*", "/", ">", "<", "==", "!=", ">=", "<="].includes(next.value)) {
        const operator = consume().value;
        const right = parsePrimary();
        left = {
          type: "BinaryExpression",
          operator,
          left,
          right,
        } as BinaryExpressionNode;
      } else {
        break;
      }
    }
  
    return left;
  }
  

  function parsePrimary(): ASTNode {
    const token = peek();

    if (token.type === "symbol" && token.value === "-") {
      consume();
      const argument = parsePrimary();
      return {
        type: "UnaryExpression",
        operator: "-",
        argument,
      } as UnaryExpressionNode;
    }

    if (token.type === "number") {
      consume();
      return {
        type: "NumberLiteral",
        value: parseFloat(token.value),
      } as NumberLiteralNode;
    }

    if (token.type === "identifier") {
      consume();
      return {
        type: "Identifier",
        value: token.value,
      } as IdentifierNode;
    }

    if (token.type === "symbol" && token.value === "(") {
      consume();
      const expr = parseExpression();
      expect("symbol", ")");
      return expr;
    }

    throw new Error(`Unexpected token: ${token.type} ${token.value}`);
  }

  // this is for a block statement
  // like a function body or a code block in an if statement
  // it is not a statement itself, but a collection of statements
  // so yeah lets see how it works
  function parseBlock(): ASTNode {
    expect("symbol", "{");

    const body: ASTNode[] = [];
    while (peek() && peek().value !== "}") {
      body.push(parseStatement());
    }

    expect("symbol", "}");

    return {
      type: "BlockStatement",
      body,
    } as BlockStatementNode;
  }

  function parseStatement(): ASTNode {
    const token = peek();

    if (token.type === "symbol" && token.value === "{") {
      return parseBlock();
    }

    if (token.type === "keyword" && token.value === "if") {
        consume(); // consume "if"
        const condition = parseExpression();
        const consequence = parseBlock();
      
        return {
          type: "IfStatement",
          condition,
          consequence,
        } as IfStatementNode;
      }

    if (token.type === "keyword" && token.value === "print") {
      consume();
      const expr = parseExpression();
      expect("symbol", ";");
      return {
        type: "Print",
        argument: expr,
      } as PrintStatementNode;
    }

    if (token.type === "identifier") {
      const identifier = consume().value;
      expect("symbol", "=");
      const value = parseExpression();
      expect("symbol", ";");

      return {
        type: "Assignment",
        identifier,
        value,
      } as AssignmentNode;
    }

    throw new Error(`Unrecognized statement starting with ${token.type} "${token.value}"`);
  }

  while (current < tokens.length) {
    ast.push(parseStatement());
  }

  return ast;
}
