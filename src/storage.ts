export interface Progress {
  completed: number[];
  quizAnswers: Array<string | null>;
  quizSubmitted: boolean;
  notes: string;
}

const key = 'math-tooling-notebook:v1';
export const emptyProgress = (): Progress => ({ completed: [], quizAnswers: Array(6).fill(null), quizSubmitted: false, notes: '' });

export function loadProgress(): { progress: Progress; warning?: string } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { progress: emptyProgress() };
    const data = JSON.parse(raw) as Partial<Progress>;
    return {
      progress: {
        completed: Array.isArray(data.completed) ? data.completed.filter((id) => Number.isInteger(id) && id >= 1 && id <= 20) : [],
        quizAnswers: Array.isArray(data.quizAnswers) ? Array.from({ length: 6 }, (_, i) => data.quizAnswers?.[i] ?? null) : Array(6).fill(null),
        quizSubmitted: Boolean(data.quizSubmitted),
        notes: typeof data.notes === 'string' ? data.notes : '',
      },
    };
  } catch {
    return { progress: emptyProgress(), warning: 'Saved progress could not be read. You can keep working; new changes will replace the damaged local copy.' };
  }
}

export function saveProgress(progress: Progress): string | undefined {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    return 'This browser could not save locally. Keep this tab open or export your notes before leaving.';
  }
}

export function clearProgress(): void {
  localStorage.removeItem(key);
}
