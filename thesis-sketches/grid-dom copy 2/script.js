import { Grids } from '@ixfx/geometry.js';
const feedback = document.getElementById(`feedback`);

const settings = Object.freeze({
  grid: { rows: 10, cols: 10, size: 10 },
  intervalMs: { min: 1, max: 800 }
});

let state = Object.freeze({
  lastClicked: { x: 0, y: 0 },
  pressure: 0,
  animationId: /** @type {ReturnType<typeof setTimeout> | null} */ (null)
});

const getCellFromElement = (element) => ({
  x: Number.parseInt(element.getAttribute(`data-x`) ?? `-1`),
  y: Number.parseInt(element.getAttribute(`data-y`) ?? `-1`)
});

const clearVisited = () => {
  document.querySelectorAll(`.cell.visited, .cell.current`).forEach(el => {
    el.classList.remove(`visited`, `current`);
  });
};

const startBreadth = (cell) => {
  if (state.animationId !== null) clearTimeout(state.animationId);
  clearVisited();

  const { grid, intervalMs } = settings;
  const breadthVisitor = Grids.Visit.create(`breadth`);
  const cellSequence = [ ...breadthVisitor(grid, { start: cell }) ];
  let index = 0;

  const step = () => {
    if (index >= cellSequence.length) {
      saveState({ animationId: null });
      return;
    }

    document.querySelectorAll(`.cell.current`).forEach(el => el.classList.remove(`current`));

    const current = cellSequence[index];
    const el = document.querySelector(`[data-x="${current.x}"][data-y="${current.y}"]`);
    if (el) el.classList.add(`visited`, `current`);
    index++;

    // Map pressure (0–1) to interval: no pressure = slow, full pressure = fast
    const { pressure } = state;
    const delay = intervalMs.max - pressure * (intervalMs.max - intervalMs.min);

    const animationId = setTimeout(step, delay);
    saveState({ animationId });
  };

  step();
};

const onCellClick = (event) => {
  const cell = getCellFromElement(event.target);
  if (cell.x === -1 || cell.y === -1) return;
  saveState({ lastClicked: cell });
  startBreadth(cell);
  use();
};

const use = () => {
  const { lastClicked } = state;
  const feedbackElement = document.querySelector(`#feedback`);
  if (feedbackElement) {
    feedbackElement.innerHTML = `Breadth-first from: ${lastClicked.x}, ${lastClicked.y}, pressure: ${state.pressure}`;
  }
};

function setup() {
  const { grid } = settings;
  const gridElement = document.querySelector(`#grid`);
  if (gridElement === null) return;

  for (const row of Grids.As.rows(grid)) {
    const cellsHtml = row.map(cell => `<div data-x="${cell.x}" data-y="${cell.y}" class="cell"></div>`
    );
    gridElement.insertAdjacentHTML(`beforeend`, `<div class="row">${cellsHtml.join(` `)}</div>`);
  }

  // gridElement.addEventListener(`click`, onCellClick);

  gridElement.addEventListener(`pointerdown`, (event) => {
    const pe = /** @type {PointerEvent} */ (event);
    if (pe.pointerType === `pen`) {
      saveState({ pressure: pe.pressure });
    }
    const cell = getCellFromElement(pe.target);
    if (cell.x === -1 || cell.y === -1) return;
    saveState({ lastClicked: cell });
    startBreadth(cell);
    use();
  });

  window.addEventListener(`pointermove`, (event) => {
    updateDebug(event);
    const pe = /** @type {PointerEvent} */ (event);
    if (pe.pointerType === `pen`) {
      saveState({ pressure: pe.pressure });
    }
  });
}

function updateDebug(e) {
  const type = e.pointerType;
  const x = Math.round(e.offsetX);
  const y = Math.round(e.offsetY);
  const pressure = e.pressure.toFixed(3);
  const tiltX = Math.round(e.tiltX);
  const tiltY = Math.round(e.tiltY);
  // @ts-ignore
  feedback.textContent =
    `type: ${type}   |   x: ${x}   y: ${y}   |   pressure: ${pressure}   |   tilt: ${tiltX} / ${tiltY} deg`;
}

setup();

function saveState(s) {
  state = Object.freeze({ ...state, ...s });
}