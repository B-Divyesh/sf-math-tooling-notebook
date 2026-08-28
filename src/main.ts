import './style.css';
import { drills, quiz, toolInfo, type Tool } from './drills';
import { drawPlot, tableMarkup, type PlotRange } from './plotter';
import { clearProgress, loadProgress, saveProgress, type Progress } from './storage';

const root = document.querySelector<HTMLDivElement>('#app')!;
const loaded = loadProgress();
let progress: Progress = loaded.progress;
let storageWarning = loaded.warning ?? '';
let currentId = drills.find((drill) => !progress.completed.includes(drill.id))?.id ?? 1;
let selectedTool: Tool | null = null;
let drillFeedback = '';
let drillCorrect = false;
let plotExpression = 'sin(x) + 0.25*x';
let plotRange: PlotRange = { xMin: -10, xMax: 10, yMin: -6, yMax: 6 };

const escapeText = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]!));

function persist(): void {
  const warning = saveProgress(progress);
  if (warning) storageWarning = warning;
}

function render(): void {
  const drill = drills[currentId - 1];
  const completedCount = progress.completed.length;
  const percent = Math.round((completedCount / drills.length) * 100);
  root.innerHTML = `
    <div class="offline-bar" id="offline-bar" role="status" hidden>You’re offline. The notebook still works; progress stays on this device.</div>
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Math Tooling Notebook home"><span class="brand-mark" aria-hidden="true">⌁</span><span>Math Tooling<br><small>Notebook</small></span></a>
      <nav aria-label="Primary navigation">
        <a href="#practice">Drills</a><a href="#plotter">Plotter</a><a href="#transfer">Transfer quiz</a>
      </nav>
    </header>
    <main id="main">
      <section class="hero" id="top" aria-labelledby="page-title">
        <div class="hero-copy">
          <p class="eyebrow"><span>Night service № 01</span> · tools before theory</p>
          <h1 id="page-title">Find your route<br>through the maths.</h1>
          <p class="hero-lead">Twenty short drills for learning when to <strong>estimate</strong>, build a <strong>table</strong>, draw a <strong>graph</strong>, or make an <strong>algebraic check</strong>.</p>
          <div class="hero-actions">
            <a class="button primary" href="#practice">${completedCount ? 'Continue your route' : 'Begin at station 01'}</a>
            <a class="button ghost" href="#how">See how it works</a>
          </div>
          <p class="local-note"><span aria-hidden="true">◆</span> No account. Your notes and progress stay in this browser.</p>
        </div>
        <figure class="poster-frame">
          <picture>
            <img src="/assets/math-railway.webp" srcset="/assets/math-railway-400.webp 400w, /assets/math-railway.webp 600w" sizes="(max-width: 700px) min(88vw, 360px), 390px" width="600" height="900" alt="Abstract art-deco railway lines become four mathematical curves above an open notebook and drafting compass." decoding="async" fetchpriority="high" />
          </picture>
          <figcaption>Four lines. One practical way into mathematical work.</figcaption>
        </figure>
      </section>

      <section class="method" id="how" aria-labelledby="how-title">
        <div><p class="eyebrow">The working loop</p><h2 id="how-title">Inspect. Estimate. Represent. Verify.</h2></div>
        <ol class="method-line">
          <li><span>1</span><strong>Read the job</strong><small>Name what you actually need.</small></li>
          <li><span>2</span><strong>Choose a tool</strong><small>Pick the lightest useful view.</small></li>
          <li><span>3</span><strong>Make a check</strong><small>Use a second view when stakes rise.</small></li>
        </ol>
      </section>

      ${storageWarning ? `<aside class="notice warning" role="alert"><strong>Local save notice</strong><p>${escapeText(storageWarning)}</p></aside>` : ''}

      <section class="practice" id="practice" aria-labelledby="practice-title">
        <div class="section-heading">
          <div><p class="eyebrow">Your route map</p><h2 id="practice-title">Twenty practice stations</h2></div>
          <div class="progress-summary" aria-label="${completedCount} of 20 drills complete">
            <span><strong>${completedCount}</strong> / 20 complete</span>
            <div class="progress-track" role="progressbar" aria-label="Drills completed" aria-valuemin="0" aria-valuemax="20" aria-valuenow="${completedCount}"><i style="width:${percent}%"></i></div>
          </div>
        </div>
        <div class="workbench">
          <nav class="route-map" aria-label="Practice stations">
            ${routeMarkup(currentId, progress.completed)}
          </nav>
          <article class="drill-panel" aria-labelledby="drill-title">
            ${drillMarkup(drill)}
          </article>
        </div>
      </section>

      <section class="plotter-section" id="plotter" aria-labelledby="plotter-title">
        <div class="section-heading inverse">
          <div><p class="eyebrow">Open workbench</p><h2 id="plotter-title">Function plotter</h2><p>Use the graph as an inspection tool, then read exact samples in the table.</p></div>
          <span class="route-badge graph">Graph line · G</span>
        </div>
        <form class="plot-controls" id="plot-form">
          <label class="expression-field">Function <span class="math-prefix">y =</span><input id="plot-expression" name="expression" value="${escapeText(plotExpression)}" autocomplete="off" spellcheck="false" aria-describedby="syntax-help plot-error" /></label>
          <div class="range-fields" aria-label="Axis range">
            ${rangeInput('xMin', 'x min', plotRange.xMin)}${rangeInput('xMax', 'x max', plotRange.xMax)}${rangeInput('yMin', 'y min', plotRange.yMin)}${rangeInput('yMax', 'y max', plotRange.yMax)}
          </div>
          <button class="button primary compact" type="submit">Plot function</button>
          <p id="syntax-help" class="field-help">Syntax: <code>x^2</code>, <code>sin(x)</code>, <code>sqrt(x)</code>, <code>abs(x)</code>. Use * for multiplication.</p>
        </form>
        <p id="plot-error" class="plot-error" role="alert"></p>
        <div class="plot-grid">
          <canvas id="main-plot" class="plot-canvas" role="img" width="720" height="400"></canvas>
          <div id="plot-table" class="plot-table"></div>
        </div>
      </section>

      <section class="transfer" id="transfer" aria-labelledby="transfer-title">
        <div class="section-heading">
          <div><p class="eyebrow">Final interchange</p><h2 id="transfer-title">Can you choose the route?</h2><p>Six situations, four tools. Aim for five correct—not for a certificate, but for a useful signal.</p></div>
          ${progress.quizSubmitted ? quizScoreMarkup() : '<span class="route-badge">6 decisions</span>'}
        </div>
        <form id="quiz-form" class="quiz-list">
          ${quiz.map((item, index) => quizQuestionMarkup(item, index)).join('')}
          <div class="quiz-actions">
            ${progress.quizSubmitted ? '<button type="button" class="button secondary" data-action="retry-quiz">Try the quiz again</button>' : '<button type="submit" class="button primary">Check my route choices</button>'}
            <p id="quiz-error" class="inline-error" role="alert"></p>
          </div>
        </form>
      </section>

      <section class="scratch-section" aria-labelledby="scratch-title">
        <div class="scratch-copy"><p class="eyebrow">Always beside you</p><h2 id="scratch-title">Scratchpad</h2><p>Record a hunch, intermediate value, or check. It saves as you type—only on this device.</p></div>
        <div class="scratch-paper">
          <label for="scratchpad">Working notes</label>
          <textarea id="scratchpad" rows="9" placeholder="Example: Estimate first: 50 × 20 ≈ 1,000…">${escapeText(progress.notes)}</textarea>
          <div class="scratch-actions"><span id="save-status" role="status">Saved locally</span><button class="text-button" type="button" data-action="export-notes">Export .txt</button><button class="text-button danger" type="button" data-action="clear-notes">Clear notes</button></div>
        </div>
      </section>

      <section class="reset-zone" aria-labelledby="reset-title"><div><h2 id="reset-title">A route you can restart</h2><p>Reset all drill, quiz, and scratchpad data stored by this site on this browser.</p></div><button class="button ghost" type="button" data-action="reset-progress">Reset local notebook</button></section>
    </main>
    <footer>
      <div><span class="brand footer-brand"><span class="brand-mark" aria-hidden="true">⌁</span><span>Math Tooling<br><small>Notebook</small></span></span><p>A free, local-first practice utility from Param Factory.</p></div>
      <div><p>Generated hero artwork is original to this product.</p><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-math-tooling-notebook">Source</a></nav></div>
    </footer>`;

  const scratchpad = document.querySelector<HTMLTextAreaElement>('#scratchpad');
  if (scratchpad) scratchpad.value = progress.notes;
  initializePlots();
  updateOnlineStatus();
}

function rangeInput(name: keyof PlotRange, label: string, value: number): string {
  return `<label>${label}<input type="number" name="${name}" value="${value}" step="any" required /></label>`;
}

function routeMarkup(active: number, completed: number[]): string {
  let lastZone = '';
  return drills.map((drill) => {
    const zone = drill.zone !== lastZone ? `<p class="zone-label">${(lastZone = drill.zone)}</p>` : '';
    const done = completed.includes(drill.id);
    return `${zone}<button type="button" class="station ${drill.id === active ? 'active' : ''} ${done ? 'done' : ''}" data-drill="${drill.id}" aria-current="${drill.id === active ? 'step' : 'false'}"><span>${String(drill.id).padStart(2, '0')}</span><i class="line-${drill.tool}" aria-hidden="true"></i><em>${escapeText(drill.title)}</em><b aria-hidden="true">${done ? '✓' : '○'}</b><small class="sr-only">${done ? 'Complete' : 'Not complete'}</small></button>`;
  }).join('');
}

function drillMarkup(drill: typeof drills[number]): string {
  const completed = progress.completed.includes(drill.id);
  const correctTool = selectedTool === drill.tool;
  return `
    <div class="drill-head"><p class="station-number">Station ${String(drill.id).padStart(2, '0')} · ${escapeText(drill.zone)}</p>${completed ? '<span class="complete-stamp">✓ Complete</span>' : ''}</div>
    <h3 id="drill-title">${escapeText(drill.title)}</h3>
    <p class="drill-prompt">${escapeText(drill.prompt)}</p>
    <fieldset class="tool-choice"><legend>Which tool should lead?</legend><p>Choose the lightest tool that answers this job directly.</p><div class="tool-grid">
      ${(Object.keys(toolInfo) as Tool[]).map((tool) => `<button type="button" data-tool="${tool}" class="tool-button ${selectedTool === tool ? 'selected' : ''}"><span aria-hidden="true">${toolInfo[tool].symbol}</span><strong>${toolInfo[tool].label}</strong><small>${toolInfo[tool].cue}</small></button>`).join('')}
    </div></fieldset>
    <div class="tool-feedback ${correctTool ? 'success' : selectedTool ? 'try-again' : ''}" role="status" aria-live="polite">${selectedTool ? (correctTool ? `<strong>Good route: ${toolInfo[drill.tool].label}.</strong> ${escapeText(drill.why)}` : `<strong>Try another route.</strong> ${escapeText(toolInfo[selectedTool].label)} can help later, but ask which view answers this particular job most directly.`) : ''}</div>
    ${correctTool ? workMarkup(drill, completed) : ''}`;
}

function workMarkup(drill: typeof drills[number], completed: boolean): string {
  let instrument = '';
  if (drill.tool === 'estimate') instrument = `<div class="estimate-ticket"><span>Quick bound</span><button type="button" class="text-button" data-action="reveal-estimate">Reveal the working</button><strong id="estimate-reveal" hidden>${escapeText(drill.estimate ?? '')}</strong></div>`;
  if (drill.tool === 'table') instrument = `<div class="instrument-table">${tableMarkup(drill.expression!, drill.xValues!)}</div>`;
  if (drill.tool === 'graph') instrument = `<div class="mini-plot-wrap"><canvas class="plot-canvas mini-plot" data-expression="${escapeText(drill.expression!)}" data-range="${drill.range!.join(',')}" width="640" height="320" role="img"></canvas>${tableMarkup(drill.expression!, sampleValues(drill.range![0], drill.range![1], 5))}</div>`;
  if (drill.tool === 'algebra') instrument = `<div class="algebra-strip"><span>Write → transform → substitute</span><code>${escapeText(drill.setup)}</code></div>`;
  return `<section class="drill-work" aria-labelledby="work-title"><p class="eyebrow">Use the ${toolInfo[drill.tool].label.toLowerCase()} line</p><h4 id="work-title">${escapeText(drill.setup)}</h4>${instrument}<form id="drill-answer" class="answer-form"><fieldset><legend>${escapeText(drill.question)}</legend>${drill.options.map((option, index) => `<label class="answer-option"><input type="radio" name="answer" value="${index}" /><span>${escapeText(option)}</span></label>`).join('')}</fieldset><button class="button primary compact" type="submit">Check this answer</button><p class="answer-feedback ${drillCorrect ? 'success' : ''}" role="status">${escapeText(drillFeedback)}</p></form>${drillCorrect || completed ? `<aside class="explanation"><strong>Verification</strong><p>${escapeText(drill.explanation)}</p></aside><button class="button secondary" type="button" data-action="next-drill">${drill.id === 20 ? 'Go to transfer quiz' : 'Next station'}</button>` : ''}</section>`;
}

function quizQuestionMarkup(item: typeof quiz[number], index: number): string {
  const chosen = progress.quizAnswers[index];
  const correct = progress.quizSubmitted && chosen === item.answer;
  return `<fieldset class="quiz-question ${progress.quizSubmitted ? (correct ? 'correct' : 'incorrect') : ''}"><legend><span>${index + 1}</span>${escapeText(item.prompt)}</legend><div class="quiz-tools">${(Object.keys(toolInfo) as Tool[]).map((tool) => `<label><input type="radio" name="quiz-${index}" value="${tool}" ${chosen === tool ? 'checked' : ''} ${progress.quizSubmitted ? 'disabled' : ''}/><span>${toolInfo[tool].symbol} ${toolInfo[tool].label}</span></label>`).join('')}</div>${progress.quizSubmitted ? `<p class="quiz-result"><strong>${correct ? '✓ Correct.' : `Not quite—use ${toolInfo[item.answer].label}.`}</strong> ${escapeText(item.why)}</p>` : ''}</fieldset>`;
}

function quizScoreMarkup(): string {
  const score = quiz.filter((item, index) => progress.quizAnswers[index] === item.answer).length;
  return `<div class="score-seal"><strong>${score}/6</strong><span>${score >= 5 ? 'Route ready' : 'Keep practising'}</span></div>`;
}

function sampleValues(min: number, max: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => Number((min + ((max - min) * index) / (count - 1)).toPrecision(4)));
}

function initializePlots(): void {
  document.querySelectorAll<HTMLCanvasElement>('.mini-plot').forEach((canvas) => {
    const [xMin, xMax, yMin, yMax] = canvas.dataset.range!.split(',').map(Number);
    drawPlot(canvas, canvas.dataset.expression!, { xMin, xMax, yMin, yMax });
  });
  updateMainPlot();
}

function updateMainPlot(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#main-plot');
  const error = document.querySelector<HTMLElement>('#plot-error');
  const table = document.querySelector<HTMLElement>('#plot-table');
  if (!canvas || !error || !table) return;
  const message = drawPlot(canvas, plotExpression, plotRange);
  error.textContent = message ?? '';
  table.innerHTML = message ? '<p>Correct the function above to generate its value table.</p>' : tableMarkup(plotExpression, sampleValues(plotRange.xMin, plotRange.xMax, 9));
}

function updateOnlineStatus(): void {
  const bar = document.querySelector<HTMLElement>('#offline-bar');
  if (bar) bar.hidden = navigator.onLine;
}

root.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-drill], [data-tool], [data-action]');
  if (!target) return;
  if (target.dataset.drill) {
    currentId = Number(target.dataset.drill); selectedTool = null; drillFeedback = ''; drillCorrect = false; render();
    document.querySelector('#drill-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (target.dataset.tool) {
    selectedTool = target.dataset.tool as Tool; drillFeedback = ''; drillCorrect = false; render();
    document.querySelector('.tool-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    handleAction(target.dataset.action!);
  }
});

root.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  if (form.id === 'drill-answer') {
    const value = new FormData(form).get('answer');
    if (value === null) { drillFeedback = 'Choose an answer before checking.'; drillCorrect = false; render(); return; }
    const drill = drills[currentId - 1];
    drillCorrect = Number(value) === drill.answer;
    drillFeedback = drillCorrect ? 'Correct—the check agrees.' : 'That does not agree yet. Inspect the working and try another answer.';
    if (drillCorrect && !progress.completed.includes(currentId)) { progress.completed.push(currentId); progress.completed.sort((a, b) => a - b); persist(); }
    render();
    document.querySelector('.answer-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else if (form.id === 'plot-form') {
    const data = new FormData(form);
    plotExpression = String(data.get('expression') ?? '');
    plotRange = { xMin: Number(data.get('xMin')), xMax: Number(data.get('xMax')), yMin: Number(data.get('yMin')), yMax: Number(data.get('yMax')) };
    updateMainPlot();
  } else if (form.id === 'quiz-form') {
    const missing = progress.quizAnswers.some((answer) => answer === null);
    if (missing) { document.querySelector<HTMLElement>('#quiz-error')!.textContent = 'Choose a tool for all six situations before checking.'; return; }
    progress.quizSubmitted = true; persist(); render();
    document.querySelector('#transfer')?.scrollIntoView({ behavior: 'smooth' });
  }
});

root.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.name.startsWith('quiz-')) {
    progress.quizAnswers[Number(input.name.slice(5))] = input.value; persist();
    const error = document.querySelector<HTMLElement>('#quiz-error'); if (error) error.textContent = '';
  }
});

let noteTimer = 0;
root.addEventListener('input', (event) => {
  const input = event.target as HTMLTextAreaElement;
  if (input.id !== 'scratchpad') return;
  progress.notes = input.value;
  const status = document.querySelector<HTMLElement>('#save-status');
  if (status) status.textContent = 'Saving…';
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => { persist(); if (status) status.textContent = storageWarning ? 'Not saved—see notice above' : 'Saved locally'; }, 250);
});

function handleAction(action: string): void {
  if (action === 'reveal-estimate') {
    const reveal = document.querySelector<HTMLElement>('#estimate-reveal'); if (reveal) reveal.hidden = false;
  } else if (action === 'next-drill') {
    if (currentId === 20) { location.hash = 'transfer'; return; }
    currentId += 1; selectedTool = null; drillFeedback = ''; drillCorrect = false; render(); document.querySelector('#drill-title')?.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'retry-quiz') {
    progress.quizAnswers = Array(6).fill(null); progress.quizSubmitted = false; persist(); render(); location.hash = 'transfer';
  } else if (action === 'clear-notes') {
    if (progress.notes && window.confirm('Clear every scratchpad note? This cannot be undone.')) { progress.notes = ''; persist(); render(); document.querySelector<HTMLTextAreaElement>('#scratchpad')?.focus(); }
  } else if (action === 'export-notes') {
    const blob = new Blob([progress.notes || 'Math Tooling Notebook\n\n(No scratchpad notes yet.)'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'math-tooling-notes.txt'; link.click(); URL.revokeObjectURL(url);
  } else if (action === 'reset-progress') {
    if (window.confirm('Reset all 20 drill stamps, quiz choices, and scratchpad notes on this browser?')) { clearProgress(); progress = { completed: [], quizAnswers: Array(6).fill(null), quizSubmitted: false, notes: '' }; currentId = 1; selectedTool = null; render(); location.hash = 'practice'; }
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('resize', () => window.requestAnimationFrame(initializePlots));

render();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
