import { describe, expect, it } from 'vitest';
import { drills, quiz } from './drills';
import { makeTable } from './math';

describe('curriculum data', () => {
  it('ships twenty numbered drills across all tool routes', () => {
    expect(drills).toHaveLength(20);
    expect(drills.map((drill) => drill.id)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(new Set(drills.map((drill) => drill.tool))).toEqual(new Set(['estimate', 'table', 'graph', 'algebra']));
  });

  it('keeps every answer and graph setup valid', () => {
    for (const drill of drills) {
      expect(drill.options[drill.answer]).toBeTruthy();
      if (drill.tool === 'graph' || drill.tool === 'table') expect(drill.expression).toBeTruthy();
    }
    expect(quiz).toHaveLength(6);
  });

  it('accepts the first repeated-growth crossing at x = 4', () => {
    const drill = drills.find(({ id }) => id === 2);
    expect(drill).toBeDefined();
    expect(drill?.options[drill.answer]).toBe('x = 4');

    const values = makeTable('2^x', [1, 2, 3, 4]).map(({ x, y }) => ({ x, exponential: y, linear: 3 * x }));
    expect(values.slice(0, 3).every(({ exponential, linear }) => exponential <= linear)).toBe(true);
    expect(values[3]).toEqual({ x: 4, exponential: 16, linear: 12 });
    expect(values[3].exponential).toBeGreaterThan(values[3].linear);
  });
});
