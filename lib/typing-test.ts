export type TypingScore = { correct: number; complete: boolean };

export function generateTypingWords(bank: readonly string[], count = 26): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const choices = bank.filter(word => word !== words[i - 1]);
    words.push(choices[Math.floor(Math.random() * choices.length)]);
  }
  return words;
}

/** Words stay aligned even when a visitor skips one or adds extra letters. */
export function scoreTypingInput(words: readonly string[], input: string): TypingScore {
  const typed = input.split(' ');
  let correct = 0;
  words.forEach((word, index) => {
    const entry = typed[index] ?? '';
    for (let i = 0; i < word.length; i++) if (entry[i] === word[i]) correct++;
    if (index < words.length - 1 && typed.length > index + 1 && entry.length === word.length) correct++;
  });
  const last = words.length - 1;
  return { correct, complete: typed.length >= words.length && (typed[last]?.length ?? 0) >= words[last].length };
}

/** Count newly inserted characters, retaining mistakes in accuracy after correction. */
export function countTypingAttempts(words: readonly string[], previous: string, next: string) {
  let prefix = 0;
  while (prefix < previous.length && prefix < next.length && previous[prefix] === next[prefix]) prefix++;
  let suffix = 0;
  while (suffix < previous.length - prefix && suffix < next.length - prefix && previous[previous.length - 1 - suffix] === next[next.length - 1 - suffix]) suffix++;
  const inserted = next.slice(prefix, next.length - suffix);
  let correct = 0;
  for (let i = 0; i < inserted.length; i++) {
    const before = next.slice(0, prefix + i).split(' ');
    const index = before.length - 1;
    const offset = before[index].length;
    if (inserted[i] === ' ' ? offset === words[index]?.length : inserted[i] === words[index]?.[offset]) correct++;
  }
  return { total: inserted.length, correct };
}

export function typingMetrics(correct: number, attempts: number, correctAttempts: number, seconds: number) {
  return {
    wpm: seconds > 0 ? Math.round(correct * 12 / seconds) : 0,
    raw: seconds > 0 ? Math.round(attempts * 12 / seconds) : 0,
    accuracy: attempts ? Math.round(correctAttempts / attempts * 100) : 100,
  };
}
