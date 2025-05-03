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
  IfStatementNode,
  WhileStatementNode,
  BreakStatementNode,
  ContinueStatementNode,
  LetStatementNode,
  FunctionDeclarationNode,
  FunctionCallNode,
  ReturnStatementNode,
  FunctionExpressionNode,
} from "./ast";

export function parse(tokens: Token[]): ASTNode[] {
  let current = 0;
  const ast: ASTNode[] = [];

  function peek(): Token | undefined {
    return tokens[current];
  }

  function consume(): Token {
    return tokens[current++];
  }

  function expect(type: string, value?: string): Token {
    const token = consume();
    if (token.type !== type || (value !== undefined && token.value !== value)) {
      throw new Error(
        `Expected ${type} "${value}", got ${token.type} "${token.value}"`
      );
    }
    return token;
  }

  function parseExpression(): ASTNode {
    let left = parsePrimary();

    while (true) {
      const next = peek();
      if (
        next &&
        next.type === "symbol" &&
        ["+", "-", "*", "/", ">", "<", "==", "!=", ">=", "<="].includes(
          next.value
        )
      ) {
        const operator = consume().value;
        const right = parsePrimary();
        left = {
          type: "BinaryExpression",
          operator: operator as BinaryExpressionNode["operator"],
          left,
          right,
        };
      } else {
        break;
      }
    }

    return left;
  }

  function parsePrimary(): ASTNode {
    const token = peek();

    // Anonymous function (FunctionExpression)
    if (token?.type === "keyword" && token.value === "fn") {
      consume(); // "fn"
      expect("symbol", "(");

      const params: string[] = [];
      while (peek()?.value !== ")") {
        const param = expect("identifier").value;
        params.push(param);
        if (peek()?.value === ",") consume();
      }

      expect("symbol", ")");
      const body = parseBlock();

      return {
        type: "FunctionExpression",
        params,
        body,
      } as FunctionExpressionNode;
    }

    // Unary minus
    if (token?.type === "symbol" && token.value === "-") {
      consume();
      const argument = parsePrimary();
      return {
        type: "UnaryExpression",
        operator: "-",
        argument,
      } as UnaryExpressionNode;
    }

    // Numbers
    if (token?.type === "number") {
      consume();
      return {
        type: "NumberLiteral",
        value: parseFloat(token.value),
      } as NumberLiteralNode;
    }

    // Parenthesized expression
    if (token?.type === "symbol" && token.value === "(") {
      consume();
      const expr = parseExpression();
      expect("symbol", ")");
      return expr;
    }

    // Identifiers and function calls
    if (token?.type === "identifier") {
      const id = consume().value;

      if (peek()?.value === "(") {
        consume(); // "("
        const args: ASTNode[] = [];
        while (peek()?.value !== ")") {
          args.push(parseExpression()); // <-- allows nested expressions like fn(n){...}
          if (peek()?.value === ",") consume();
        }
        expect("symbol", ")");

        return {
          type: "FunctionCall",
          name: id,
          args,
        } as FunctionCallNode;
      }

      return {
        type: "Identifier",
        value: id,
      } as IdentifierNode;
    }

    throw new Error(`Unexpected token: ${token?.type} ${token?.value}`);
  }

  function parseBlock(): BlockStatementNode {
    expect("symbol", "{");

    const body: ASTNode[] = [];
    while (peek() && peek()?.value !== "}") {
      body.push(parseStatement());
    }

    expect("symbol", "}");

    return {
      type: "BlockStatement",
      body,
    };
  }

  function parseStatement(): ASTNode {
    const token = peek();

    if (token?.type === "keyword" && token.value === "fn") {
      consume(); // "fn"

      const name = expect("identifier").value;
      expect("symbol", "(");

      const params: string[] = [];
      while (peek()?.value !== ")") {
        const param = expect("identifier").value;
        params.push(param);
        if (peek()?.value === ",") consume(); // skip comma
      }

      expect("symbol", ")");

      const body = parseBlock();

      return {
        type: "FunctionDeclaration",
        name,
        params,
        body,
      } as FunctionDeclarationNode;
    }

    if (token?.type === "keyword" && token.value === "return") {
      consume(); // "return"
      const value = parseExpression();
      expect("symbol", ";");

      return {
        type: "ReturnStatement",
        value,
      } as ReturnStatementNode;
    }

    if (token?.type === "keyword" && token.value === "let") {
      consume(); // "let"
      const identifier = expect("identifier").value;
      expect("symbol", "=");
      const value = parseExpression();
      expect("symbol", ";");

      return {
        type: "LetStatement",
        identifier,
        value,
      } as LetStatementNode;
    }

    if (token?.type === "keyword" && token.value === "continue") {
      consume(); // "continue"
      expect("symbol", ";");
      return {
        type: "ContinueStatement",
      } as ContinueStatementNode;
    }

    if (token?.type === "keyword" && token.value === "break") {
      consume(); // "break"
      expect("symbol", ";");
      return {
        type: "BreakStatement",
      } as BreakStatementNode;
    }

    if (token?.type === "keyword" && token.value === "while") {
      consume(); // "while"
      const condition = parseExpression();
      const body = parseBlock();

      return {
        type: "WhileStatement",
        condition,
        body,
      } as WhileStatementNode;
    }

    if (token?.type === "keyword" && token.value === "if") {
      consume(); // "if"
      const condition = parseExpression();
      const consequence = parseBlock();

      let alternate: BlockStatementNode | undefined = undefined;
      const next = peek();
      if (next && next.type === "keyword" && next.value === "else") {
        consume();
        alternate = parseBlock();
      }

      return {
        type: "IfStatement",
        condition,
        consequence,
        alternate,
      } as IfStatementNode;
    }

    if (token?.type === "symbol" && token.value === "{") {
      return parseBlock();
    }

    if (token?.type === "keyword" && token.value === "print") {
      consume();
      const expr = parseExpression();
      expect("symbol", ";");
      return {
        type: "Print",
        argument: expr,
      } as PrintStatementNode;
    }

    if (token?.type === "identifier") {
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

    throw new Error(
      `Unrecognized statement starting with ${token?.type} "${token?.value}"`
    );
  }

  while (current < tokens.length) {
    ast.push(parseStatement());
  }

  return ast;
}
