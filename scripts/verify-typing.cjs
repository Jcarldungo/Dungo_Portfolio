// Run with node scripts/verify-typing.cjs; uses the existing TypeScript compiler.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../lib/typing-test.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const api = {};
new Function('exports', compiled)(api);
const { scoreTypingInput, countTypingAttempts, typingMetrics, generateTypingWords } = api;

assert.deepEqual(scoreTypingInput(['hello', 'world'], ''), { correct: 0, complete: false });
assert.deepEqual(scoreTypingInput(['hello', 'world'], 'hello world'), { correct: 11, complete: true });
assert.deepEqual(scoreTypingInput(['hello', 'world'], 'hxllo world'), { correct: 10, complete: true });
assert.deepEqual(scoreTypingInput(['hello', 'world'], 'he world'), { correct: 7, complete: true });
assert.deepEqual(scoreTypingInput(['hello', 'world'], ' world'), { correct: 5, complete: true });
assert.deepEqual(scoreTypingInput(['hello', 'world'], 'hello wor'), { correct: 9, complete: false });
assert.deepEqual(countTypingAttempts(['hello'], 'he', 'hex'), { total: 1, correct: 0 });
assert.deepEqual(countTypingAttempts(['hello'], 'hex', 'he'), { total: 0, correct: 0 });
assert.deepEqual(countTypingAttempts(['hello'], 'he', 'hel'), { total: 1, correct: 1 });
assert.deepEqual(countTypingAttempts(['hello', 'world'], 'hello', 'hello '), { total: 1, correct: 1 });
assert.deepEqual(countTypingAttempts(['hello', 'world'], 'hell', 'hell '), { total: 1, correct: 0 });
assert.deepEqual(typingMetrics(11, 12, 11, 6), { wpm: 22, raw: 24, accuracy: 92 });
assert.deepEqual(typingMetrics(0, 0, 0, 0), { wpm: 0, raw: 0, accuracy: 100 });
const generated = generateTypingWords(['clear', 'build', 'write']);
assert.equal(generated.length, 26);
assert(generated.every((word, index) => ['clear', 'build', 'write'].includes(word) && word !== generated[index - 1]));
console.log('Typing checks passed: scoring, skipped words, corrections, accuracy, speed, and word generation.');
