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
} from "../parser/ast";

class BreakSignal extends Error {}
class ContinueSignal extends Error {}

class ReturnSignal {
  constructor(public value: any) {}
}

type Environment = Record<string, number>; // this is a map of variable names to their values

type RuntimeContext = {
  env: Environment[]; // stack of variable scopes
  functions: Record<string, FunctionDeclarationNode>;

};

export function evaluate(ast: ASTNode[], context: RuntimeContext = {
  env: [ {} ],
  functions: {}
}) {
  for (const node of ast) {
    evalNode(node, context);
  }
  return context;
}

// Helpers for scoping

function getVar(name: string, ctx: RuntimeContext): number {
  for (let i = ctx.env.length - 1; i >= 0; i--) {
    if (name in ctx.env[i]) return ctx.env[i][name];
  }
  throw new Error(`Undefined variable: ${name}`);
}

function setVar(name: string, value: number, ctx: RuntimeContext) {
  for (let i = ctx.env.length - 1; i >= 0; i--) {
    if (name in ctx.env[i]) {
      ctx.env[i][name] = value;
      return;
    }
  }
  throw new Error(`Assignment to undefined variable: ${name}`);
}

function declareVar(name: string, value: number, ctx: RuntimeContext) {
  const current = ctx.env[ctx.env.length - 1];
  if (name in current) throw new Error(`Variable '${name}' already declared in this scope`);
  current[name] = value;
}

// AST evaluator

function evalNode(node: ASTNode, ctx: RuntimeContext): any {
  switch (node.type) {
    case "NumberLiteral":
      return (node as NumberLiteralNode).value;

    case "Identifier":
      return getVar((node as IdentifierNode).value, ctx);

    case "UnaryExpression":
      return -evalNode(node.argument, ctx);

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
      setVar(identifier, val, ctx);
      return;
    }

    case "LetStatement": {
      const { identifier, value } = node as LetStatementNode;
      const val = evalNode(value, ctx);
      declareVar(identifier, val, ctx);
      return;
    }

    case "Print": {
      const val = evalNode((node as PrintStatementNode).argument, ctx);
      console.log(val);
      return;
    }

    case "IfStatement": {
      const { condition, consequence, alternate } = node as IfStatementNode;
      const cond = evalNode(condition, ctx);
      if (cond) {
        evalNode(consequence, ctx);
      } else if (alternate) {
        evalNode(alternate, ctx);
      }
      return;
    }

    case "WhileStatement": {
      const { condition, body } = node as WhileStatementNode;
      while (evalNode(condition, ctx)) {
        try {
          evalNode(body, ctx);
        } catch (e) {
          if (e instanceof BreakSignal) break;
          if (e instanceof ContinueSignal) continue;
          throw e;
        }
      }
      return;
    }

    case "BreakStatement":
      throw new BreakSignal();

    case "ContinueStatement":
      throw new ContinueSignal();

    case "BlockStatement": {
      const block = node as BlockStatementNode;
      ctx.env.push({});
      for (const stmt of block.body) {
        evalNode(stmt, ctx);
      }
      ctx.env.pop();
      return;
    }

    case "FunctionDeclaration": {
      const fn = node as FunctionDeclarationNode;
      ctx.functions[fn.name] = fn;
      return;
    }
    
    case "ReturnStatement": {
      const val = evalNode(node.value, ctx);
      throw new ReturnSignal(val);
    }

    case "FunctionCall": {
      const { name, args } = node as FunctionCallNode;
      const fn = ctx.functions[name];
      if (!fn) throw new Error(`Undefined function: ${name}`);
    
      // Bind parameters
      const fnEnv: Environment = {};
      fn.params.forEach((param, index) => {
        fnEnv[param] = evalNode(args[index], ctx);
      });
    
      // Push new scope
      ctx.env.push(fnEnv);
      let result;
      try {
        evalNode(fn.body, ctx);
        result = undefined; // in case there's no return
      } catch (e) {
        if (e instanceof ReturnSignal) {
          result = e.value;
        } else {
          throw e;
        }
      }
      ctx.env.pop();
      return result;
    }
        

    default:
      const _unreachable: never = node;
      throw new Error(`Unknown AST node type: ${(node as any).type}`);
  }
}
