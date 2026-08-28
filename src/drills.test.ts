import { describe, expect, it } from 'vitest';
import { drills, quiz } from './drills';

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
});
