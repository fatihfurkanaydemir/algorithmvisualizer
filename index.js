'use strict';

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

/***********************************************/
/*****************  Variables ******************/
/***********************************************/

const speed = 10;
let arraySize = 50;
let barValues = [];
let arrayToVisualize = [];
let states = [];
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

startBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (working) return;
  working = true;
  arraySizeSlider.setAttribute('disabled', true);

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

  barValues = [];
  for (let i = 0; i < arraySize; i++) {
    barValues.push(Math.random() * (canvas.clientHeight - 10) + 10);
  }

  arrayToVisualize = barValues.slice();
}

function ResizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  Draw();
}

function Animate() {
  states.forEach(function (state, i) {
    setTimeout(function () {
      if (working) {
        Draw(arrayToVisualize, state.index);
        if (state.type === 'set') {
          arrayToVisualize[state.index] = state.value;
        }
      }
    }, speed * i);
  });

  setTimeout(function () {
    Draw();
    states = [];
    working = false;
    arraySizeSlider.attributes.removeNamedItem('disabled');
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

/***********************************************/
/*****************  ALGORITHMS *****************/
/***********************************************/

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
    HQuickSort(array, p, q);
    HQuickSort(array, q + 1, r);
  }
}

function HPartition(array, p, r) {
  const pivot = array[p];
  let i = p - 1;
  let j = r + 1;
  do {
    j--;
  } while (array[j] > pivot);
  do {
    i++;
  } while (array[i] < pivot);
  if (i < j) {
    const tmp = array[i];

    array[i] = array[j];
    states.push({ type: 'set', index: i, value: array[j] });

    array[j] = tmp;
    states.push({ type: 'set', index: j, value: tmp });
  } else return j;
}

function LPartition(array, p, r) {
  const pivot = array[r];
  let i = p - 1;
  for (let j = p; j <= r - 1; j++) {
    if (array[j] <= pivot) {
      i++;

      const tmp = array[i];

      array[i] = array[j];
      states.push({ type: 'set', index: i, value: array[j] });

      array[j] = tmp;
      states.push({ type: 'set', index: j, value: tmp });
    }
  }

  const tmp = array[i + 1];

  array[i + 1] = array[r];
  states.push({ type: 'set', index: i + 1, value: array[r] });

  array[r] = tmp;
  states.push({ type: 'set', index: r, value: tmp });

  return i + 1;
}
