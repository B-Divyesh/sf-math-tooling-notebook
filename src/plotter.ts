import { compileExpression, formatNumber, makeTable } from './math';

export interface PlotRange { xMin: number; xMax: number; yMin: number; yMax: number }

const colors = { background: '#fffaf0', grid: '#d8cdb4', axis: '#526268', curve: '#c84931', point: '#0b2230' };

export function drawPlot(canvas: HTMLCanvasElement, source: string, range: PlotRange): string | undefined {
  try {
    if (!(range.xMin < range.xMax && range.yMin < range.yMax)) throw new Error('Each minimum must be smaller than its maximum.');
    const fn = compileExpression(source);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width || 640));
    const height = Math.max(220, Math.round(rect.height || 340));
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser cannot draw the graph. Use the value table below instead.');
    context.scale(scale, scale);
    context.fillStyle = colors.background;
    context.fillRect(0, 0, width, height);
    const toX = (x: number) => ((x - range.xMin) / (range.xMax - range.xMin)) * width;
    const toY = (y: number) => height - ((y - range.yMin) / (range.yMax - range.yMin)) * height;

    context.lineWidth = 1;
    context.strokeStyle = colors.grid;
    context.fillStyle = colors.axis;
    context.font = '12px system-ui';
    context.textAlign = 'center';
    const xStep = niceStep(range.xMax - range.xMin);
    for (let x = Math.ceil(range.xMin / xStep) * xStep; x <= range.xMax; x += xStep) {
      const px = toX(x);
      context.beginPath(); context.moveTo(px, 0); context.lineTo(px, height); context.stroke();
      if (Math.abs(x) > 1e-9) context.fillText(formatNumber(x), px, Math.min(height - 5, Math.max(14, toY(0) + 16)));
    }
    const yStep = niceStep(range.yMax - range.yMin);
    context.textAlign = 'left';
    for (let y = Math.ceil(range.yMin / yStep) * yStep; y <= range.yMax; y += yStep) {
      const py = toY(y);
      context.beginPath(); context.moveTo(0, py); context.lineTo(width, py); context.stroke();
      if (Math.abs(y) > 1e-9) context.fillText(formatNumber(y), Math.min(width - 32, Math.max(5, toX(0) + 6)), py - 4);
    }
    context.strokeStyle = colors.axis;
    context.lineWidth = 2;
    if (range.yMin <= 0 && range.yMax >= 0) { context.beginPath(); context.moveTo(0, toY(0)); context.lineTo(width, toY(0)); context.stroke(); }
    if (range.xMin <= 0 && range.xMax >= 0) { context.beginPath(); context.moveTo(toX(0), 0); context.lineTo(toX(0), height); context.stroke(); }

    context.strokeStyle = colors.curve;
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.beginPath();
    let drawing = false;
    let previousY = 0;
    for (let pixel = 0; pixel <= width; pixel += 1) {
      const x = range.xMin + (pixel / width) * (range.xMax - range.xMin);
      const y = fn(x);
      const py = toY(y);
      const discontinuity = !Number.isFinite(y) || py < -height * 2 || py > height * 3 || (drawing && Math.abs(py - previousY) > height * 0.75);
      if (discontinuity) {
        drawing = false;
      } else if (!drawing) {
        context.moveTo(pixel, py);
        drawing = true;
      } else {
        context.lineTo(pixel, py);
      }
      previousY = py;
    }
    context.stroke();
    canvas.setAttribute('aria-label', `Graph of y equals ${source}, x from ${range.xMin} to ${range.xMax}, y from ${range.yMin} to ${range.yMax}. A value table follows.`);
    return undefined;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The graph could not be drawn.';
    const context = canvas.getContext('2d');
    if (context) { context.clearRect(0, 0, canvas.width, canvas.height); }
    return message;
  }
}

function niceStep(span: number): number {
  const rough = span / 8;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  return (normalized < 2 ? 1 : normalized < 5 ? 2 : 5) * magnitude;
}

export function tableMarkup(source: string, values: number[]): string {
  try {
    const rows = makeTable(source, values).map(({ x, y }) => `<tr><th scope="row">${formatNumber(x)}</th><td>${formatNumber(y)}</td></tr>`).join('');
    return `<div class="table-scroll"><table><caption>Values for y = ${source}</caption><thead><tr><th scope="col">x</th><th scope="col">y</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  } catch (error) {
    return `<p class="inline-error">${error instanceof Error ? error.message : 'Values could not be calculated.'}</p>`;
  }
}
