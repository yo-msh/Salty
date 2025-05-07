export type ASTNode =
  | AssignmentNode  // for assignment statements like `x = 5;` or `x = y + 2;`
  | BinaryExpressionNode // for binary expressions like `x + y`, `x - y`
  | UnaryExpressionNode // for unary expressions like `-x` or `!x`
  | NumberLiteralNode // for number literals like `5`, `3.14`
  | IdentifierNode // for identifiers like `x`, `y`
  | PrintStatementNode // for print statements like `print(x);`
  | BlockStatementNode // for block statements like `{ x = 5; print(x); }`
  | IfStatementNode // for if statements like `if (x > 5) { print(x); } else { print(0); }`
  | WhileStatementNode // for while statements like `while (x < 5) { x = x + 1; }`
  | BreakStatementNode // for break statements like `break;` (to break out of loops)
  | ContinueStatementNode // for continue statements like `continue;` (to skip to the next iteration of a loop)
  | LetStatementNode // for let statements like `let x = 5;` or `let y = x + 2;`
  | FunctionDeclarationNode // for function declarations like `fn add(x, y) { return x + y; }`
  | FunctionCallNode // for function calls like `add(5, 10);`
  | ReturnStatementNode // for return statements like `return x + y;`
  | FunctionExpressionNode // for function expressions like `let add = fn(x, y) { return x + y; };`
  | ArrayLiteralNode // for array literals like `[1, 2, 3]`, `[x, y]`
  | IndexAccessNode // for index access like `arr[0]`, `arr[x]`
  | BooleanLiteralNode; // for boolean literals like `true`, `false`

export interface AssignmentNode {
  type: "Assignment";
  identifier: string;
  value: ASTNode;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "!=" | "&&" | "||"; // Add more operators as needed as they are hardcoded in the parser
  // TODO: Add support for more operators, like `**` for exponentiation
  left: ASTNode;
  right: ASTNode;
}

export interface NumberLiteralNode {
  type: "NumberLiteral";
  value: number;
}

export interface IdentifierNode {
  type: "Identifier";
  value: string;
}

export interface PrintStatementNode {
  type: "Print";
  argument: ASTNode;
}

// hardedcoded in the parser, may add more later, being used negation and logical not
// TODO: ++ and -- operators
export interface UnaryExpressionNode {
  type: "UnaryExpression";
  operator: "-" | "!"; 
  argument: ASTNode;
}

export interface BlockStatementNode {
  type: "BlockStatement";
  body: ASTNode[];
}

export interface IfStatementNode {
  type: "IfStatement";
  condition: ASTNode;
  consequence: BlockStatementNode;
  alternate?: BlockStatementNode; // this if for else statement
}

export interface WhileStatementNode {
  type: "WhileStatement";
  condition: ASTNode;
  body: BlockStatementNode;
}

export interface BreakStatementNode {
  type: "BreakStatement"; // for breaking about of loops
}

export interface ContinueStatementNode {
  type: "ContinueStatement";
}

export interface LetStatementNode {
  type: "LetStatement";
  identifier: string;
  value: ASTNode;
}

export interface FunctionDeclarationNode {
  type: "FunctionDeclaration";
  name: string;
  params: string[];
  body: BlockStatementNode;
}

export interface FunctionCallNode {
  type: "FunctionCall";
  name: string;
  args: ASTNode[];
}

export interface ReturnStatementNode {
  type: "ReturnStatement";
  value: ASTNode;
}

export interface FunctionExpressionNode {
  type: "FunctionExpression";
  params: string[];
  body: BlockStatementNode;
}

export interface ArrayLiteralNode {
  type: "ArrayLiteral";
  elements: ASTNode[];
}

export interface IndexAccessNode {
  type: "IndexAccess";
  array: ASTNode;
  index: ASTNode;
}

export interface BooleanLiteralNode {
  type: "BooleanLiteral";
  value: boolean;
}
