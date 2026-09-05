export interface Progress {
  completed: number[];
  quizAnswers: Array<string | null>;
  quizSubmitted: boolean;
  notes: string;
}

export const realStorageKey = 'math-tooling-notebook:v1';
export const demoStorageKey = 'demo:math-tooling-notebook:v1';
export const emptyProgress = (): Progress => ({ completed: [], quizAnswers: Array(6).fill(null), quizSubmitted: false, notes: '' });

export function sampleProgress(): Progress {
  return {
    completed: [1, 2, 3, 4, 5],
    quizAnswers: Array(6).fill(null),
    quizSubmitted: false,
    notes: 'I checked repeated growth with a table: at x = 4, 2^x = 16 and 3x = 12.\n\nNext: use a graph when I need to see a crossing or a turning point.',
  };
}

export function loadProgress(key = realStorageKey): { progress: Progress; warning?: string; found: boolean } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { progress: emptyProgress(), found: false };
    const data = JSON.parse(raw) as Partial<Progress>;
    return {
      progress: {
        completed: Array.isArray(data.completed) ? data.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= 20) : [],
        quizAnswers: Array.isArray(data.quizAnswers) ? Array.from({ length: 6 }, (_, i) => data.quizAnswers?.[i] ?? null) : Array(6).fill(null),
        quizSubmitted: Boolean(data.quizSubmitted),
        notes: typeof data.notes === 'string' ? data.notes : '',
      },
      found: true,
    };
  } catch {
    return { progress: emptyProgress(), warning: 'Saved progress could not be read. You can keep working; new changes will replace the damaged local copy.', found: true };
  }
}

export function saveProgress(progress: Progress, key = realStorageKey): string | undefined {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    return 'This browser could not save locally. Keep this tab open or export your notes before leaving.';
  }
}

export function clearProgress(key = realStorageKey): void {
  localStorage.removeItem(key);
}
