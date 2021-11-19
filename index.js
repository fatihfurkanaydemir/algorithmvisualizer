'use strict';

// class Bar {
//   _x;
//   _y;
//   _width;
//   _height;

//   constructor(x, y, width, height) {
//     this._x = x;
//     this._y = y;
//     this._width = width;
//     this._height = height;
//   }
// }

const arraySize = 100;
let barValues = [];

for (let i = 0; i < arraySize; i++) {
  barValues.push(Math.random() * 600 + 10);
}

const canvas = document.querySelector('#canvas');
const canvasSection = document.querySelector('.canvas-section');
const startBtn = document.querySelector('.btn-start');
const randomizeBtn = document.querySelector('.btn-randomize');

window.addEventListener('resize', ResizeCanvas);

startBtn.addEventListener('click', function (e) {
  e.preventDefault();
  insertionSort(barValues);
});

randomizeBtn.addEventListener('click', function (e) {
  e.preventDefault();

  barValues = [];
  for (let i = 0; i < arraySize; i++) {
    barValues.push(Math.random() * canvas.clientHeight + 10);
  }

  Draw();
});

function ResizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  Draw();
}

ResizeCanvas();

function Draw(array = barValues, highlighted = -1) {
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
    setTimeout(function () {
      const key = array[i];
      let j = i - 1;

      while (j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        j--;

        Draw(array, j + 1);
      }

      array[j + 1] = key;
      if (i === array.length - 1) Draw();
    }, 50 * i);
  }
}
