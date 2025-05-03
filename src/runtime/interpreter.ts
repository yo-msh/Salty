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
} from "../parser/ast";

class BreakSignal extends Error {}
class ContinueSignal extends Error {}

class ReturnSignal {
  constructor(public value: any) {}
}

// type Environment = Record<string, number>; // this is a map of variable names to their values

type SaltyValue = number | SaltyFunction;
type Environment = Record<string, SaltyValue>;

//  static type for function declarations

type SaltyFunction = {
  declaration: FunctionDeclarationNode;
  closure: Environment[];
};

type RuntimeContext = {
  env: Environment[];
  functions: Record<string, SaltyFunction>;
};

export function evaluate(
  ast: ASTNode[],
  context: RuntimeContext = {
    env: [{}],
    functions: {},
  }
) {
  for (const node of ast) {
    evalNode(node, context);
  }
  return context;
}

// Helpers for scoping

function getVar(name: string, ctx: RuntimeContext): SaltyValue {
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
  if (name in current)
    throw new Error(`Variable '${name}' already declared in this scope`);
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
        case "+":
          return leftVal + rightVal;
        case "-":
          return leftVal - rightVal;
        case "*":
          return leftVal * rightVal;
        case "/":
          return leftVal / rightVal;
        case ">":
          return leftVal > rightVal;
        case "<":
          return leftVal < rightVal;
        case "==":
          return leftVal === rightVal;
        case "!=":
          return leftVal !== rightVal;
        case ">=":
          return leftVal >= rightVal;
        case "<=":
          return leftVal <= rightVal;
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
      // If it's a top-level fn, bind it to its name
      ctx.env[ctx.env.length - 1][fn.name] = {
        declaration: fn,
        closure: [...ctx.env], // deep copy of env stack
      };
      return;
    }

    case "ReturnStatement": {
      const val = evalNode(node.value, ctx);
      throw new ReturnSignal(val);
    }

    case "FunctionCall": {
      const { name, args } = node as FunctionCallNode;

      const fnValue = getVar(name, ctx);
      if (
        typeof fnValue !== "object" ||
        !("declaration" in fnValue) ||
        !("closure" in fnValue)
      ) {
        throw new Error(`${name} is not a function`);
      }

      const { declaration, closure } = fnValue as SaltyFunction;

      // Bind arguments to parameters
      const fnEnv: Environment = {};
      declaration.params.forEach((param, i) => {
        fnEnv[param] = evalNode(args[i], ctx);
      });

      // Push captured env + new local env
      ctx.env.push(...closure.map((e) => ({ ...e }))); // clone captured env
      ctx.env.push(fnEnv);

      let result;
      try {
        evalNode(declaration.body, ctx);
        result = undefined;
      } catch (e) {
        if (e instanceof ReturnSignal) {
          result = e.value;
        } else {
          throw e;
        }
      }

      ctx.env.splice(ctx.env.length - (closure.length + 1), closure.length + 1); // pop all fn envs
      return result;
    }

    case "FunctionExpression": {
      const fn = node as FunctionExpressionNode;
      return {
        declaration: {
          type: "FunctionDeclaration",
          name: "", // no name
          params: fn.params,
          body: fn.body,
        },
        closure: [...ctx.env], // capture the current env
      } as SaltyFunction;
    }
    

    default:
      const _unreachable: never = node;
      throw new Error(`Unknown AST node type: ${(node as any).type}`);
  }
}
