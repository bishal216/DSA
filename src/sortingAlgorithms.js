// Helper functions for comparison and swapping
const compareBars = async (i, j) => await barManager.compare(i, j);
const swapBars = async (i, j) => await barManager.swap(i, j);

// Bubble Sort
const bubbleSort = async () => {
  const values = barManager.data.values;
  const length = values.length;

  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      await compareBars(j, j + 1);
      if (values[j] > values[j + 1]) {
        await swapBars(j, j + 1);
      }
    }
  }
};

const optimizedBubbleSort = async () => {
  const values = barManager.data.values;
  const length = values.length;

  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < length - 1; i++) {
      await barManager.compare(i, i + 1);
      if (values[i] > values[i + 1]) {
        await barManager.swap(i, i + 1);
        swapped = true;
      }
    }
  } while (swapped); // Repeat if swaps occurred
};

// Cocktail Sort
const cocktailSort = async () => {
  const values = barManager.data.values;
  const length = values.length;

  let swapped = true;
  let start = 0;
  let end = length - 1;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      await compareBars(i, i + 1);
      if (values[i] > values[i + 1]) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }

    if (!swapped) break;
    swapped = false;

    // Decrement the end after the forward pass
    end--;

    // Backward pass
    for (let i = end; i > start; i--) {
      await compareBars(i, i - 1);
      if (values[i] < values[i - 1]) {
        await swapBars(i, i - 1);
        swapped = true;
      }
    }

    // Increment the start after the backward pass
    start++;
  }
};

// Odd-Even Sort
const oddEvenSort = async () => {
  const values = barManager.data.values;
  const len = values.length;
  let swapped = true;

  while (swapped) {
    swapped = false;

    // Odd phase
    for (let i = 1; i <= len - 2; i += 2) {
      await compareBars(i, i + 1);
      if (values[i] > values[i + 1]) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }

    // Even phase
    for (let i = 0; i <= len - 2; i += 2) {
      await compareBars(i, i + 1);
      if (values[i] > values[i + 1]) {
        await swapBars(i, i + 1);
        swapped = true;
      }
    }
  }
};

const combSort = async () => {
  const values = barManager.data.values;
  const length = values.length;
  let gap = length;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.floor(gap / 1.3); // Reduce the gap size
    swapped = false;

    for (let i = 0; i + gap < length; i++) {
      await barManager.compare(i, i + gap);
      if (values[i] > values[i + gap]) {
        await barManager.swap(i, i + gap);
        swapped = true;
      }
    }
  }
};

const gnomeSort = async () => {
  const values = barManager.data.values;
  let index = 0;

  while (index < values.length) {
    if (index === 0 || values[index - 1] <= values[index]) {
      index++;
    } else {
      await barManager.compare(index - 1, index);
      await barManager.swap(index - 1, index);
      index--;
    }
  }
};

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
