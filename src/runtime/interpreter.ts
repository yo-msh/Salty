import {
    ASTNode,
    AssignmentNode,
    BinaryExpressionNode,
    IdentifierNode,
    NumberLiteralNode,
    PrintStatementNode,
    UnaryExpressionNode,
    BlockStatementNode,
  } from "../parser/ast";
  
  type RuntimeContext = {
    variables: Record<string, number>;
  };
  
  export function evaluate(ast: ASTNode[], context: RuntimeContext = { variables: {} }) {
    for (const node of ast) {
      evalNode(node, context);
    }
    return context;
  }
  
  function evalNode(node: ASTNode, ctx: RuntimeContext): any {
    switch (node.type) {
      case "NumberLiteral":
        return (node as NumberLiteralNode).value;
  
      case "Identifier":
        const id = (node as IdentifierNode).value;
        if (!(id in ctx.variables)) {
          throw new Error(`Undefined variable: ${id}`);
        }
        return ctx.variables[id];
  
      case "UnaryExpression": {
        const { operator, argument } = node as UnaryExpressionNode;
        if (operator === "-") {
          return -evalNode(argument, ctx);
        } else {
          const _exhaustiveCheck: never = operator;
          throw new Error(`Unsupported unary operator: ${_exhaustiveCheck}`);
        }
      }
  
      case "BinaryExpression": {
        const { operator, left, right } = node as BinaryExpressionNode;
        const leftVal = evalNode(left, ctx);
        const rightVal = evalNode(right, ctx);
      
        switch (operator) {
          case "+": return leftVal + rightVal;
          case "-": return leftVal - rightVal;
          case "*": return leftVal * rightVal;
          case "/": return leftVal / rightVal;
          case ">": return leftVal > rightVal;
          case "<": return leftVal < rightVal;
          case "==": return leftVal === rightVal;
          case "!=": return leftVal !== rightVal;
          case ">=": return leftVal >= rightVal;
          case "<=": return leftVal <= rightVal;
      
          default:
            const _exhaustiveCheck: never = operator;
            throw new Error(`Unknown binary operator: ${_exhaustiveCheck}`);
        }
      }
      
  
      case "Assignment": {
        const { identifier, value } = node as AssignmentNode;
        const val = evalNode(value, ctx);
        ctx.variables[identifier] = val;
        return;
      }
  
      case "Print": {
        const { argument } = node as PrintStatementNode;
        const output = evalNode(argument, ctx);
        console.log(output);
        return;
      }

      case "BlockStatement": {
        const block = node as BlockStatementNode;
        for (const stmt of block.body) {
          evalNode(stmt, ctx);
        }
        return;
      }

      case "IfStatement": {
        const conditionValue = evalNode(node.condition, ctx);
        if (conditionValue) {
          evalNode(node.consequence, ctx);
        }
        return;
      }
      
  
      default:
        const _unreachable: never = node;
        throw new Error(`Unknown AST node type: ${(node as any).type}`);
    }
  }
  