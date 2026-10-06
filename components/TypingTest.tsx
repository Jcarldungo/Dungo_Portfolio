'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { typingWordBank } from '@/lib/content';
import { countTypingAttempts, generateTypingWords, scoreTypingInput, typingMetrics } from '@/lib/typing-test';

const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export default function TypingTest({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<number | null>(null);
  const titleId = useId();
  const helpId = useId();
  const passageId = useId();
  const [words, setWords] = useState(() => generateTypingWords(typingWordBank));
  const [input, setInput] = useState('');
  const [composition, setComposition] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [attempts, setAttempts] = useState({ total: 0, correct: 0 });
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [focused, setFocused] = useState(true);
  const [pressed, setPressed] = useState('');
  const [confirmRestart, setConfirmRestart] = useState(false);
  const score = scoreTypingInput(words, input);
  const metrics = typingMetrics(score.correct, attempts.total, attempts.correct, elapsed);
  const typedWords = input.split(' ');
  const beforeCursor = input.slice(0, cursor).split(' ');
  const activeWord = Math.min(words.length - 1, beforeCursor.length - 1);
  const activeChar = beforeCursor[beforeCursor.length - 1].length;
  const nextKey = words[activeWord]?.[activeChar] ?? ' ';

  useEffect(() => {
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    // Removing the dialog on unmount dismisses it. Calling close in this
    // cleanup would fire onClose during React Strict Mode's effect replay.
  }, []);

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => setElapsed((performance.now() - startRef.current!) / 1000), 250);
    return () => window.clearInterval(timer);
  }, [running, finished]);

  useEffect(() => {
    caretRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [cursor]);

  useEffect(() => {
    if (finished) retryRef.current?.focus();
  }, [finished]);

  function restart() {
    setWords(generateTypingWords(typingWordBank));
    setInput(''); setComposition(null); setCursor(0); setAttempts({ total: 0, correct: 0 }); setElapsed(0);
    setRunning(false); setFinished(false); setConfirmRestart(false); setPressed('');
    startRef.current = null;
    // The input is mounted again after the results screen is removed.
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function requestRestart() {
    if (running && !finished) setConfirmRestart(true);
    else restart();
  }

  function updateInput(value: string, selection: number) {
    if (finished || confirmRestart) return;
    if (!value && !running) return;
    if (startRef.current === null) {
      startRef.current = performance.now();
      setRunning(true);
    }
    const inserted = countTypingAttempts(words, input, value);
    setAttempts(current => ({ total: current.total + inserted.total, correct: current.correct + inserted.correct }));
    setInput(value); setCursor(selection);
    if (scoreTypingInput(words, value).complete) {
      setElapsed(Math.max(0.001, (performance.now() - startRef.current) / 1000));
      setFinished(true); setRunning(false); setPressed('');
    }
  }

  return <dialog ref={dialogRef} className="typing-dialog" aria-labelledby={titleId} aria-describedby={helpId}
    onClose={onClose}
    onCancel={event => { if (confirmRestart) { event.preventDefault(); setConfirmRestart(false); inputRef.current?.focus(); } }}
    onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
    onKeyDown={event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); requestRestart(); }
      if (confirmRestart && event.key === 'Enter') { event.preventDefault(); restart(); }
    }}>
    <div className="typing-panel">
      <header className="typing-header"><div><h2 id={titleId}>Typing test</h2><p>26 words. Find your rhythm.</p></div><button type="button" className="typing-close" aria-label="Close typing test" onClick={() => dialogRef.current?.close()}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></header>
      {finished ? <section className="typing-results" aria-live="polite">
        <div className="typing-result-speed"><strong>{metrics.wpm}</strong><span>words per minute</span></div>
        <div className="typing-stats"><div><strong>{metrics.accuracy}<small>%</small></strong><span>accuracy</span></div><div><strong>{metrics.raw}</strong><span>raw WPM</span></div><div><strong>{elapsed.toFixed(1)}<small>s</small></strong><span>time</span></div></div>
        <p>Accuracy includes mistakes you corrected.</p>
        <button ref={retryRef} type="button" className="typing-primary" onClick={restart}>Try again</button>
      </section> : <>
        <div className="typing-stats" aria-label="Live typing statistics"><div><strong>{elapsed >= 0.5 ? metrics.wpm : 0}</strong><span>WPM</span></div><div><strong>{metrics.accuracy}<small>%</small></strong><span>accuracy</span></div><div><strong>{Math.floor(elapsed)}<small>s</small></strong><span>time</span></div></div>
        <div className={`typing-text-wrap${focused ? '' : ' typing-unfocused'}`}>
          <div className="typing-words" aria-hidden="true">{words.map((word, wi) => {
            const typed = typedWords[wi] ?? '';
            const characters = Array.from(word + typed.slice(word.length));
            return <span key={wi} className={`typing-word${wi < typedWords.length - 1 && typed !== word ? ' typing-word-missed' : ''}`}>{characters.map((char, ci) => <span key={ci}>{wi === activeWord && ci === activeChar && <span ref={caretRef} className="typing-caret" />}<span className={typed[ci] === undefined ? '' : typed[ci] === word[ci] ? 'typing-correct' : 'typing-incorrect'}>{char}</span></span>)}{wi === activeWord && activeChar >= characters.length && <span ref={caretRef} className="typing-caret" />}</span>;
          })}</div>
          <span id={passageId} className="sr-only">{words.join(' ')}</span>
          <textarea ref={inputRef} className="typing-input" aria-label="Type the displayed words" aria-describedby={`${helpId} ${passageId}`} value={composition ?? input} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} wrap="off"
            onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setPressed(''); }}
            onPaste={event => event.preventDefault()} onDrop={event => event.preventDefault()}
            onChange={event => { if ((event.nativeEvent as InputEvent).isComposing) setComposition(event.target.value); else updateInput(event.target.value.replace(/[\r\n]/g, ''), event.target.selectionStart); }}
            onCompositionStart={event => setComposition(event.currentTarget.value)}
            onCompositionEnd={event => { setComposition(null); updateInput(event.currentTarget.value, event.currentTarget.selectionStart); }}
            onSelect={event => setCursor(event.currentTarget.selectionStart)}
            onKeyDown={event => { if (event.key === 'Enter') event.preventDefault(); if (!event.ctrlKey && !event.metaKey && !event.altKey) setPressed(event.key.toLowerCase()); }}
            onKeyUp={() => setPressed('')} />
          {!focused && <span className="typing-focus-hint" aria-hidden="true">Click here to type</span>}
        </div>
        <p id={helpId} className="typing-instruction">{running ? 'Keep going. Backspace to correct a mistake.' : 'Type the words above. The timer starts with your first keystroke.'}</p>
        <div className="typing-keyboard" aria-hidden="true">{KEY_ROWS.map(row => <div key={row} className="typing-key-row">{Array.from(row).map(key => <span key={key} className={`typing-key${nextKey.toLowerCase() === key ? ' typing-key-next' : ''}${pressed === key ? ' typing-key-pressed' : ''}`}>{key}</span>)}</div>)}<div className="typing-key-row"><span className={`typing-key typing-space${nextKey === ' ' ? ' typing-key-next' : ''}${pressed === ' ' ? ' typing-key-pressed' : ''}`}>space</span></div></div>
      </>}
      {finished && <p id={helpId} className="sr-only">Test complete. Choose Try again to start another test.</p>}
      <footer className="typing-footer">{confirmRestart ? <div className="typing-confirm" role="alert"><span>Restart this test?</span><button type="button" onClick={restart}>Restart</button><button type="button" onClick={() => { setConfirmRestart(false); inputRef.current?.focus(); }}>Keep typing</button></div> : <><button type="button" onClick={requestRestart}>Restart <kbd>Ctrl / ⌘ + Enter</kbd></button><span><kbd>Esc</kbd> close</span></>}</footer>
    </div>
  </dialog>;
}
