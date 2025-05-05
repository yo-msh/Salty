export type Environment = Record<string, any>;

export function lookup(name: string, envStack: Environment[]): any {
  for (let i = envStack.length - 1; i >= 0; i--) {
    if (name in envStack[i]) return envStack[i][name];
  }
  throw new Error(`Undefined variable: ${name}`);
}

export function assign(name: string, value: any, envStack: Environment[]): void {
  for (let i = envStack.length - 1; i >= 0; i--) {
    if (name in envStack[i]) {
      envStack[i][name] = value;
      return;
    }
  }
  throw new Error(`Assignment to undefined variable: ${name}`);
}

export function declare(name: string, value: any, envStack: Environment[]): void {
  const current = envStack[envStack.length - 1];
  if (name in current) {
    throw new Error(`Variable '${name}' already declared in this scope`);
  }
  current[name] = value;
}
