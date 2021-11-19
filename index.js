'use strict';

const speed = 10;
const arraySize = 100;
let barValues = [];
let arrayToVisualize = [];
let states = [];

for (let i = 0; i < arraySize; i++) {
  barValues.push(Math.random() * 600 + 10);
}

arrayToVisualize = barValues.slice();

const canvas = document.querySelector('#canvas');
const canvasSection = document.querySelector('.canvas-section');
const startBtn = document.querySelector('.btn-start');
const randomizeBtn = document.querySelector('.btn-randomize');

window.addEventListener('resize', ResizeCanvas);

startBtn.addEventListener('click', function (e) {
  e.preventDefault();
  //insertionSort(barValues);
  mergeSort(barValues);

  Animate();
});

randomizeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  barValues = [];
  for (let i = 0; i < arraySize; i++) {
    barValues.push(Math.random() * (canvas.clientHeight - 10) + 10);
  }

  arrayToVisualize = barValues.slice();

  Draw();
});

function ResizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  Draw();
}

ResizeCanvas();

function Animate() {
  states.forEach(function (state, i) {
    setTimeout(function () {
      Draw(arrayToVisualize, state.index);
      if (state.type === 'set') {
        arrayToVisualize[state.index] = state.value;
      }
    }, speed * i);
  });

  setTimeout(function () {
    Draw();
    states = [];
  }, speed * states.length);
}

function Draw(array = arrayToVisualize, highlighted = -1) {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const gap = 1;
    const barWidth = (canvas.width - gap * (array.length - 1)) / array.length;

    for (let i = 0; i < array.length; i++) {
      if (highlighted !== -1 && i === highlighted) ctx.fillStyle = 'green';
      else ctx.fillStyle = 'black';
      ctx.fillRect(
        i * (barWidth + gap),
        canvas.height - array[i] + 0.5,
        barWidth,
        array[i]
      );
    }
  }
}

function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      states.push({ type: 'set', index: j + 1, value: array[j] });
      j--;
    }

    array[j + 1] = key;
    states.push({ type: 'set', index: j + 1, value: key });
  }
}

function mergeSort(array, p = 0, r = array.length - 1) {
  if (p < r) {
    const q = Math.floor((p + r) / 2);
    mergeSort(array, p, q);
    mergeSort(array, q + 1, r);
    merge(array, p, q, r);
  }
}

function merge(array, p, q, r) {
  const n1 = q - p + 1;
  const n2 = r - q;

  const left = [];
  const right = [];

  for (let i = 0; i < n1; i++) {
    left.push(array[p + i]);
  }

  for (let i = 0; i < n2; i++) {
    right.push(array[q + i + 1]);
  }

  left.push(Infinity);
  right.push(Infinity);

  let k = 0,
    m = 0;

  for (let i = p; i <= r; i++) {
    if (left[k] <= right[m]) {
      array[i] = left[k];
      states.push({ type: 'set', index: i, value: left[k] });
      k++;
    } else {
      array[i] = right[m];
      states.push({ type: 'set', index: i, value: right[m] });
      m++;
    }
  }
}
