'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/***********************************************/
/*****************  Elements *******************/
/***********************************************/

const canvas = document.querySelector('#canvas');
const canvasSection = document.querySelector('.canvas-section');
const startBtn = document.querySelector('.btn-start');
const randomizeBtn = document.querySelector('.btn-randomize');
const algorithmSelector = document.querySelector('#algorithm');
const arraySizeSlider = document.querySelector('#arraysize');
const arraySizeValue = document.querySelector('#arraysize-value');
const animationDelaySlider = document.querySelector('#animationdelay');
const animationDelayValue = document.querySelector('#animationdelay-value');

/***********************************************/
/*****************  Variables ******************/
/***********************************************/

let speed = 10;
let arraySize = 50;
let barValues = [];
let arrayToVisualize = [];
let steps = [];
let working = false;

RandomizeArray();
ResizeCanvas();

/***********************************************/
/*****************  Event Listeners ************/
/***********************************************/

window.addEventListener('resize', ResizeCanvas);

arraySizeSlider.addEventListener('input', function (e) {
  if (working) return;
  arraySize = +e.target.value;
  arraySizeValue.textContent = e.target.value;

  RandomizeArray();
  ResizeCanvas();
});

animationDelaySlider.addEventListener('input', function (e) {
  if (working) return;

  speed = +e.target.value;
  animationDelayValue.textContent = e.target.value;
});

startBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (working) return;
  working = true;
  arraySizeSlider.setAttribute('disabled', true);
  animationDelaySlider.setAttribute('disabled', true);

  switch (algorithmSelector.value) {
    case 'insertionsort':
      insertionSort(barValues);
      break;
    case 'mergesort':
      mergeSort(barValues);
      break;
    case 'hquicksort':
      HQuickSort(barValues);
      break;
    case 'lquicksort':
      LQuickSort(barValues);
      break;
    case 'countingsort':
      barValues = CountingSort(barValues);
      break;
  }

  Animate();
});

randomizeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  RandomizeArray();

  ResizeCanvas();
});

/***********************************************/
/*****************  Functions ******************/
/***********************************************/

function RandomizeArray() {
  if (working) return;

  barValues = Array.from({ length: arraySize }, () =>
    Math.ceil(Math.random() * (canvas.clientHeight - 10) + 10)
  );

  arrayToVisualize = barValues.slice();
}

function ResizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  Draw();
}

function Animate() {
  steps.forEach(function (step, i) {
    setTimeout(function () {
      if (working) {
        Draw(arrayToVisualize, step.index);
        if (step.type === 'set') {
          arrayToVisualize[step.index] = step.value;
        }
      }
    }, speed * i);
  });

  setTimeout(function () {
    Draw();
    steps = [];
    working = false;
    arraySizeSlider.attributes.removeNamedItem('disabled');
    animationDelaySlider.attributes.removeNamedItem('disabled');
  }, speed * steps.length);
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

/***********************************************/
/*****************  ALGORITHMS *****************/
/***********************************************/

function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      steps.push({ type: 'set', index: j + 1, value: array[j] });
      j--;
    }

    array[j + 1] = key;
    steps.push({ type: 'set', index: j + 1, value: key });
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
      steps.push({ type: 'set', index: i, value: left[k] });
      k++;
    } else {
      array[i] = right[m];
      steps.push({ type: 'set', index: i, value: right[m] });
      m++;
    }
  }
}

function HQuickSort(array, p = 0, r = array.length - 1) {
  if (p < r) {
    const q = HPartition(array, p, r);
    HQuickSort(array, p, q);
    HQuickSort(array, q + 1, r);
  }
}

function LQuickSort(array, p = 0, r = array.length - 1) {
  if (p < r) {
    const q = LPartition(array, p, r);
    LQuickSort(array, p, q - 1);
    LQuickSort(array, q + 1, r);
  }
}

function HPartition(array, p, r) {
  const pivot = array[p];
  let i = p - 1;
  let j = r + 1;

  while (true) {
    do {
      j--;
    } while (array[j] > pivot);
    do {
      i++;
    } while (array[i] < pivot);
    if (i < j) {
      const tmp = array[i];

      array[i] = array[j];
      steps.push({ type: 'set', index: i, value: array[j] });

      array[j] = tmp;
      steps.push({ type: 'set', index: j, value: tmp });
    } else return j;
  }
}

function LPartition(array, p, r) {
  const pivot = array[r];
  let i = p - 1;
  for (let j = p; j < r; j++) {
    if (array[j] <= pivot) {
      i++;

      const tmp = array[i];

      array[i] = array[j];
      steps.push({ type: 'set', index: i, value: array[j] });

      array[j] = tmp;
      steps.push({ type: 'set', index: j, value: tmp });
    }
  }

  i++;
  const tmp = array[i];

  array[i] = array[r];
  steps.push({ type: 'set', index: i, value: array[r] });

  array[r] = tmp;
  steps.push({ type: 'set', index: r, value: tmp });

  return i;
}

function CountingSort(array, k = Math.ceil(canvas.clientHeight)) {
  const counts = Array.from({ length: k + 1 }, () => 0);
  const aux = Array.from({ length: array.length }, () => -1);

  for (let i = 0; i < array.length; i++) {
    counts[array[i]]++;
  }

  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    aux[counts[array[i]] - 1] = array[i];
    steps.push({ type: 'set', index: counts[array[i]] - 1, value: array[i] });

    counts[array[i]]--;
  }

  return aux;
}
