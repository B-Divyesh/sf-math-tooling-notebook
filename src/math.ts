type Token = { type: 'number' | 'name' | 'op' | 'eof'; value: string };

const functions: Record<string, (value: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: Math.sqrt,
  abs: Math.abs,
  log: Math.log10,
  ln: Math.log,
  exp: Math.exp,
};

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
    } else if (/[0-9.]/.test(char)) {
      const match = source.slice(index).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      if (!match) throw new Error('That number is not valid.');
      tokens.push({ type: 'number', value: match[0] });
      index += match[0].length;
    } else if (/[a-z]/i.test(char)) {
      const match = source.slice(index).match(/^[a-z]+/i)!;
      tokens.push({ type: 'name', value: match[0].toLowerCase() });
      index += match[0].length;
    } else if ('+-*/^()'.includes(char)) {
      tokens.push({ type: 'op', value: char });
      index += 1;
    } else {
      throw new Error(`“${char}” is not supported. Use numbers, x, +, −, *, /, ^, and named functions.`);
    }
  }
  tokens.push({ type: 'eof', value: '' });
  return tokens;
}

export function compileExpression(source: string): (x: number) => number {
  if (!source.trim()) throw new Error('Enter a function to plot.');
  const tokens = tokenize(source);
  let current = 0;
  const peek = () => tokens[current];
  const take = () => tokens[current++];

  function primary(): (x: number) => number {
    const token = take();
    if (token.type === 'number') {
      const value = Number(token.value);
      return () => value;
    }
    if (token.type === 'name') {
      if (token.value === 'x') return (x) => x;
      if (token.value === 'pi') return () => Math.PI;
      if (token.value === 'e') return () => Math.E;
      const fn = functions[token.value];
      if (!fn) throw new Error(`Unknown name “${token.value}”. Try sin, cos, sqrt, abs, log, ln, or exp.`);
      if (take().value !== '(') throw new Error(`Put the input to ${token.value} in parentheses.`);
      const inner = expression();
      if (take().value !== ')') throw new Error('A closing parenthesis is missing.');
      return (x) => fn(inner(x));
    }
    if (token.value === '(') {
      const inner = expression();
      if (take().value !== ')') throw new Error('A closing parenthesis is missing.');
      return inner;
    }
    throw new Error('Expected a number, x, or a parenthesized expression.');
  }

  function unary(): (x: number) => number {
    if (peek().value === '+') {
      take();
      return unary();
    }
    if (peek().value === '-') {
      take();
      const inner = unary();
      return (x) => -inner(x);
    }
    return power();
  }

  function power(): (x: number) => number {
    const left = primary();
    if (peek().value === '^') {
      take();
      const right = unary();
      return (x) => left(x) ** right(x);
    }
    return left;
  }

  function term(): (x: number) => number {
    let left = unary();
    while (peek().value === '*' || peek().value === '/') {
      const operator = take().value;
      const right = unary();
      const previous = left;
      left = operator === '*' ? (x) => previous(x) * right(x) : (x) => previous(x) / right(x);
    }
    return left;
  }

  function expression(): (x: number) => number {
    let left = term();
    while (peek().value === '+' || peek().value === '-') {
      const operator = take().value;
      const right = term();
      const previous = left;
      left = operator === '+' ? (x) => previous(x) + right(x) : (x) => previous(x) - right(x);
    }
    return left;
  }

  const result = expression();
  if (peek().type !== 'eof') throw new Error(`Unexpected “${peek().value}”. Check the expression.`);
  return result;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return 'undefined';
  if (Math.abs(value) < 1e-10) return '0';
  return Number(value.toPrecision(6)).toString();
}

export function makeTable(source: string, values: number[]): Array<{ x: number; y: number }> {
  const fn = compileExpression(source);
  return values.map((x) => ({ x, y: fn(x) }));
}
