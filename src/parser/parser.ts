import { Token } from "../lexer/constants";
import {
  ASTNode,
  AssignmentNode,
  BinaryExpressionNode,
  IdentifierNode,
  NumberLiteralNode,
  PrintStatementNode,
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

    const next = peek();
    if (next && next.type === "symbol" && ["+", "-", "*", "/"].includes(next.value)) {
      const operator = consume().value;
      const right = parseExpression(); // right-associative for now
      return {
        type: "BinaryExpression",
        operator,
        left,
        right,
      } as BinaryExpressionNode;
    }

    return left;
  }

  function parsePrimary(): ASTNode {
    const token = peek();
  

    // Unary minus
    if (token.type === "symbol" && token.value === "-") {
      consume();
      const argument = parsePrimary();
      return {
        type: "UnaryExpression",
        operator: "-",
        argument,
      };
    }
    
    if (token.type === "number") {
      consume();
      return {
        type: "NumberLiteral",
        value: Number(token.value),
      };
    }
  
    if (token.type === "identifier") {
      consume();
      return {
        type: "Identifier",
        value: token.value,
      };
    }
  
    // Handle parentheses
    if (token.type === "symbol" && token.value === "(") {
      consume(); // skip '('
      const expr = parseExpression();
      expect("symbol", ")");
      return expr;
    }
  
    throw new Error(`Unexpected token: ${token.type} ${token.value}`);
  }
  

  function parseStatement(): ASTNode {
    const token = peek();

    // print statement
    if (token.type === "keyword" && token.value === "print") {
      consume();
      const expr = parseExpression();
      expect("symbol", ";");
      return {
        type: "Print",
        argument: expr,
      } as PrintStatementNode;
    }

    // assignment
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

  // main loop
  while (current < tokens.length) {
    ast.push(parseStatement());
  }

  return ast;
}
