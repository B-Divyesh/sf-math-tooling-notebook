import { describe, expect, it } from 'vitest';
import { compileExpression, formatNumber, makeTable } from './math';

describe('expression compiler', () => {
  it('respects arithmetic precedence and variables', () => {
    expect(compileExpression('2 + 3*x^2')(4)).toBe(50);
  });

  it('handles unary minus outside powers', () => {
    expect(compileExpression('-x^2')(3)).toBe(-9);
    expect(compileExpression('-(x - 2)^2 + 4')(2)).toBe(4);
    expect(compileExpression('-(x - 2)^2 + 4')(4)).toBe(0);
  });

  it('supports named functions and constants', () => {
    expect(compileExpression('sin(pi/2)')(0)).toBeCloseTo(1);
    expect(compileExpression('sqrt(abs(x))')(-9)).toBe(3);
  });

  it('reports unsupported syntax clearly', () => {
    expect(() => compileExpression('alert(1)')).toThrow(/Unknown name/);
    expect(() => compileExpression('2x')).toThrow(/Unexpected/);
    expect(() => compileExpression('')).toThrow(/Enter a function/);
  });
});

describe('table helpers', () => {
  it('makes numeric tables without executing arbitrary code', () => {
    expect(makeTable('x^2', [-2, 0, 2])).toEqual([{ x: -2, y: 4 }, { x: 0, y: 0 }, { x: 2, y: 4 }]);
  });

  it('formats special values for readers', () => {
    expect(formatNumber(Infinity)).toBe('undefined');
    expect(formatNumber(0.00000000001)).toBe('0');
  });
});
