const sortingAlgorithms = {
  bubbleSort: async () => await bubbleSort(),
  insertionSort: async () => await insertionSort(),
  selectionSort: async () => await selectionSort(),
  shellSort: async () => await shellSort(),
  quickSort: async () => await quickSort(),
  mergeSort: async () => await mergeSort(),
  cocktailSort: async () => await cocktailSort(),
  oddEvenSort: async () => await oddEvenSort(),
  gnomeSort: async () => await gnomeSort(),
};

// =================================================================
//VARIABLES
let bars = []; // Array to store the height values of the bars
let ms = 100; // Variable to store the delay
let MAX_HEIGHT = 250;
let len; // Length of bars array
//--------------------------------------------------------------------------
// Class
class Bar {
  constructor(i, length) {
    this.i = i;
    this.length = length;
    this.bar = (MAX_HEIGHT / length) * i + 10;
    this.barElement = document.createElement("div");
    Object.assign(this.barElement.style, {
      height: `${this.bar}px`,
      width: `${80 / length}%`,
      display: "inline-block",
    });
    this.barElement.className = "bar";
  }
  getBar() {
    return this.bar;
  }
  getBarElement() {
    return this.barElement;
  }
  updateBar() {
    this.bar = 0;
    this.barElement.style.height = 0;
    updateBarDiv();
  }
  clone() {
    const newBar = new Bar(this.i, this.length);
    return newBar;
  }
}
//--------------------------------------------------------------------------
//UPDATE BARS
function Shuffle(len) {
  for (let i = len - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    swapBars(i, k);
  }
}
function createBars() {
  len = document.getElementById("myNumberInput").value;
  // Clear the array and HTML element
  bars = [];
  const barsID = document.getElementById("bars");
  barsID.innerHTML = ""; // Clear existing bars

  // Generate bar heights
  for (let i = 0; i < len; i++) {
    let newBar = new Bar(i, len);
    bars.push(newBar);
  }
  Shuffle(len);
  updateBarDiv();
}
function updateBarDiv() {
  const barsContainer = document.getElementById("bars");
  barsContainer.innerHTML = ""; // Clear the container
  bars.forEach((bar) => barsContainer.appendChild(bar.getBarElement()));
}
// ----------------------------------------------------------------
// UTILITY FUNCTIONS
// Sleep for specified amount of time
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Highlight the bars at indices i and j
async function highlight(condition = "add", i, j) {
  if (condition == "add") {
    bars[i].getBarElement().classList.add("currentSelectedBar");
    bars[j].getBarElement().classList.add("currentSelectedBar");
  } else if (condition == "remove") {
    await sleep(ms);
    bars[i].getBarElement().classList.remove("currentSelectedBar");
    bars[j].getBarElement().classList.remove("currentSelectedBar");
  }
}
async function isGreaterThan(
  greater_number,
  smaller_number,
  remove_highlight = false
) {
  await highlight("add", greater_number, smaller_number);
  if (bars[greater_number].getBar() > bars[smaller_number].getBar()) {
    if (remove_highlight) {
      await highlight("remove", greater_number, smaller_number);
    }
    return true;
  }
  await highlight("remove", greater_number, smaller_number);
  return false;
}
async function isLessThan(
  smaller_number,
  greater_number,
  remove_highlight = false
) {
  await highlight("add", greater_number, smaller_number);
  if (bars[smaller_number].getBar() < bars[greater_number].getBar()) {
    if (remove_highlight) {
      await highlight("remove", greater_number, smaller_number);
    }
    return true;
  }
  await highlight("remove", greater_number, smaller_number);
  return false;
}

async function swapBars(i, j) {
  let tempBar = bars[i];
  bars[i] = bars[j];
  bars[j] = tempBar;
  updateBarDiv();
  await highlight("remove", i, j);
}

async function highlightPartition(left, right) {
  const barsContainer = document.getElementById("bars");
  const partitionDiv = document.createElement("div");
  partitionDiv.className = "partition-overlay";
  partitionDiv.style.left = `${left * (100 / len)}%`;
  partitionDiv.style.width = `${(right - left + 1) * (100 / len)}%`;
  barsContainer.appendChild(partitionDiv);
  await sleep(ms);
  barsContainer.removeChild(partitionDiv);
}

// --------------------------------------------------------------------------
// SORT FUNCTION

async function Sort() {
  const ButtonsToDisable = document.querySelectorAll(".disable-when-sorting");
  ButtonsToDisable.forEach((button) => {
    button.disabled = true;
  });
  const sortType = document.getElementById("sortType").value;
  ms = document.getElementById("delay").value;
  if (sortType in sortingAlgorithms) {
    await sortingAlgorithms[sortType]();
  } else {
    console.error("Unsupported sort type:", sortType);
  }
  // for (let bar of bars) {
  //   console.log(bar.getBar());
  // }
  ButtonsToDisable.forEach((button) => {
    button.disabled = false;
  });
}
// --------------------------------------------------------------------------
// SORTING ALGORITHMS

// Bubble Sort
async function bubbleSort() {
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (await isGreaterThan(j, j + 1)) {
        await swapBars(j, j + 1);
      }
    }
  }
}

//Cocktail Sort   ----> Bubble Sort Variation
async function cocktailSort(swapped = true, start = 0, end = len) {
  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end - 1; i++) {
      if (await isGreaterThan(i, i + 1)) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }
    end--;

    // If no elements were swapped in the forward pass, array is sorted
    if (!swapped) break;

    swapped = false;

    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      if (await isGreaterThan(i, i + 1)) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }
    start++;
  }
}

//Odd-Even Sort aka BrickSort   ----> Bubble Sort Variation
async function oddEvenSort(swapped = true) {
  while (swapped) {
    swapped = false;

    // Odd phase
    for (let i = 1; i <= len - 2; i += 2) {
      if (await isGreaterThan(i, i + 1)) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }

    // Even phase
    for (let i = 0; i <= len - 2; i += 2) {
      if (await isGreaterThan(i, i + 1)) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }
  }
}

//Insertion Sort
async function insertionSort(interval = 1) {
  for (let i = interval; i < len; i += interval) {
    // Temporarily store the bar and its value you're going to insert
    for (let j = i - interval; j >= 0; j -= interval) {
      if (await isGreaterThan(j, j + interval)) {
        await swapBars(j, j + interval);
      }
    }
  }
}

//Gnome Sort ----> Insertion Sort Variation
async function gnomeSort() {
  let pos = 0;
  while (pos < len) {
    if (pos == 0 || (await isGreaterThan(pos, pos - 1, true))) {
      pos++;
    } else {
      await swapBars(pos, pos - 1);
      pos--;
    }
  }
}
//Selection Sort
async function selectionSort(min = 0) {
  for (let i = 0; i < len; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (await isGreaterThan(min, j, true)) {
        min = j;
      }
    }
    await highlight("add", i, min);
    await swapBars(i, min);
  }
}
//Shell Sort
async function shellSort() {
  let gap = Math.floor(len / 2);
  while (gap > 0) {
    await insertionSort(gap);
    gap = Math.floor(gap / 2);
  }
}

async function quickSort(left = 0, right = len - 1) {
  if (left < right) {
    let pivot = await partition(left, right);
    await quickSort(left, pivot - 1);
    await quickSort(pivot + 1, right);
  }
}
async function partition(left, right) {
  const pivot = bars[right].getBar();
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (await isLessThan(j, right)) {
      i++;
      await swapBars(i, j);
    }
  }
  await swapBars(i + 1, right);
  return i + 1;
}

// MergeSort
async function mergeSort(left = 0, right = len - 1) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
  }
}

async function merge(left, mid, right) {
  let n1 = mid - left + 1;
  let n2 = right - mid;

  // Create temporary arrays
  let L = new Array(n1);
  let R = new Array(n2);

  // Copy data to temporary arrays L[] and R[]
  for (let i = 0; i < n1; i++) {
    L[i] = bars[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = bars[mid + 1 + j];
  }

  // Merge the temporary arrays back into bars[left..right]
  let i = 0,
    j = 0;
  let k = left;
  while (i < n1 && j < n2) {
    if (L[i].getBar() <= R[j].getBar()) {
      bars[k] = L[i];
      i++;
    } else {
      bars[k] = R[j];
      j++;
    }
    k++;
    updateBarDiv();
    await sleep(ms);
  }

  // Copy the remaining elements of L[], if there are any
  while (i < n1) {
    bars[k] = L[i];
    i++;
    k++;
    updateBarDiv();
    await sleep(ms);
  }

  // Copy the remaining elements of R[], if there are any
  while (j < n2) {
    bars[k] = R[j];
    j++;
    k++;
    updateBarDiv();
    await sleep(ms);
  }
}

window.onload = () => {
  const playArea = document.getElementById("playArea");
  playArea.innerHTML = "";
  playArea.appendChild(document.createElement("div")).id = "bars";

  createBars();
};
