export type ASTNode =
    | AssignmentNode
    | BinaryExpressionNode
    | UnaryExpressionNode
    | NumberLiteralNode
    | IdentifierNode
    | PrintStatementNode
    | BlockStatementNode
    | IfStatementNode;

    
export interface AssignmentNode {
  type: "Assignment";
  identifier: string;
  value: ASTNode;
}

export interface BinaryExpressionNode {
  type: "BinaryExpression";
  operator: "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "!=";  // Add more operators as needed as they are hardcoded in the parser
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

export interface UnaryExpressionNode {
    type: "UnaryExpression";
    operator: "-";
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
  }