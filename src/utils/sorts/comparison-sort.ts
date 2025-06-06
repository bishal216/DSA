// Bubble Sort Implementation
import { ArrayElement, SortingStep } from "../../types/types";
export const bubbleSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;

      // Show comparing
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        message: `Comparing ${array[j].value} and ${array[j + 1].value}`,
      });

      if (array[j].value > array[j + 1].value) {
        swapped = true;
        swaps++;

        const a = array[j];
        const b = array[j + 1];
        [array[j], array[j + 1]] = [b, a];

        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          message: `Swapped ${a.value} and ${b.value}`,
        });
      }
    }

    // Mark final sorted element after each pass
    steps.push({
      array: [...array],
      sorted: [n - i - 1],
      message: `Element ${array[n - i - 1].value} is in its final position`,
    });

    // If no swaps, array is sorted
    if (!swapped) {
      steps.push({
        array: [...array],
        sorted: Array.from({ length: n - i - 1 }, (_, idx) => idx),
        message: `No swaps in this pass, array is sorted`,
      });
      break;
    }
  }

  // Final step to mark all as sorted (in case array needed full passes)
  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Selection Sort Implementation
export const selectionSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...array],
      comparing: [i],
      message: `Searching for the minimum from index ${i} onward`,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        message: `Comparing ${array[minIdx].value} and ${array[j].value}`,
      });

      if (array[j].value < array[minIdx].value) {
        minIdx = j;
        steps.push({
          array: [...array],
          comparing: [minIdx],
          message: `New minimum found: ${array[minIdx].value} at index ${minIdx}`,
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const a = array[i];
      const b = array[minIdx];
      [array[i], array[minIdx]] = [b, a];

      steps.push({
        array: [...array],
        swapping: [i, minIdx],
        message: `Swapped ${a.value} with minimum ${b.value}`,
      });
    }

    steps.push({
      array: [...array],
      sorted: [i],
      message: `Element ${array[i].value} is in its final position`,
    });
  }

  // Final element is always sorted after last pass
  steps.push({
    array: [...array],
    sorted: [n - 1],
    message: `Element ${array[n - 1].value} is in its final position`,
  });

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Insertion Sort Implementation
export const insertionSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      array: [...array],
      comparing: [i],
      message: `Inserting ${key.value} into the sorted portion`,
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        message: `Comparing ${array[j].value} and ${key.value}`,
      });

      if (array[j].value > key.value) {
        array[j + 1] = array[j];
        swaps++;
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          message: `Moved ${array[j].value} to position ${j + 1}`,
        });
        j--;
      } else {
        break; // stop early if no swap needed
      }
    }

    array[j + 1] = key;
    steps.push({
      array: [...array],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      message: `Inserted ${key.value} at position ${j + 1}`,
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} moves`,
  });

  return steps;
};

// Cocktail Sort Implementation
export const cocktailSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        message: `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        swapped = true;
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
        });
      }
    }

    steps.push({
      array: [...array],
      sorted: [end],
      message: `Element ${array[end].value} is in its final position (end of forward pass)`,
    });

    if (!swapped) break;

    swapped = false;
    end--;

    // Backward pass
    for (let i = end; i > start; i--) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i - 1, i],
        message: `Comparing ${array[i - 1].value} and ${array[i].value}`,
      });

      if (array[i - 1].value > array[i].value) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        swaps++;
        swapped = true;
        steps.push({
          array: [...array],
          swapping: [i - 1, i],
          message: `Swapped ${array[i - 1].value} and ${array[i].value}`,
        });
      }
    }

    steps.push({
      array: [...array],
      sorted: [start],
      message: `Element ${array[start].value} is in its final position (end of backward pass)`,
    });

    start++;
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Gnome Sort Implementation
export const gnomeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  let index = 0;

  while (index < n) {
    if (index === 0) {
      index++;
      continue;
    }

    steps.push({
      array: [...array],
      comparing: [index - 1, index],
      message: `Comparing ${array[index - 1].value} and ${array[index].value}`,
    });

    comparisons++;

    if (array[index - 1].value <= array[index].value) {
      index++;
    } else {
      swaps++;
      [array[index - 1], array[index]] = [array[index], array[index - 1]];
      steps.push({
        array: [...array],
        swapping: [index - 1, index],
        message: `Swapped ${array[index - 1].value} and ${array[index].value}`,
      });
      index--;
    }
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
// Comb Sort Implementation
export const combSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  let gap = n;
  const shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    // Update the gap value for a next comb
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < n; i++) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + gap],
        message: `Comparing ${array[i].value} and ${array[i + gap].value}`,
      });

      if (array[i].value > array[i + gap].value) {
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        swaps++;
        sorted = false; // If we do any swap, array is not sorted
        steps.push({
          array: [...array],
          swapping: [i, i + gap],
          message: `Swapped ${array[i].value} and ${array[i + gap].value}`,
        });
      }
    }
  }

  // Mark all as sorted
  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Shell Sort Implementation
export const shellSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      array: [...array],
      message: `Using gap of ${gap}`,
    });

    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j;

      steps.push({
        array: [...array],
        comparing: [i - gap, i],
        message: `Inserting ${temp.value} into the sorted portion`,
      });

      j = i;

      while (j >= gap && array[j - gap].value > temp.value) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j - gap, j],
          message: `Comparing ${array[j - gap].value} and ${temp.value}`,
        });

        array[j] = array[j - gap];
        swaps++;
        steps.push({
          array: [...array],
          swapping: [j, j - gap],
          message: `Moved ${array[j].value} to position ${j}`,
        });
        j -= gap;
      }

      array[j] = temp;
      steps.push({
        array: [...array],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Inserted ${temp.value} at position ${j}`,
      });
    }
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Odd Even Sort Implementation
export const oddEvenSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;
  let sorted = false;

  while (!sorted) {
    sorted = true;

    // Odd indexed pass
    for (let i = 1; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        message: `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        sorted = false;
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
        });
      }
    }

    // Even indexed pass
    for (let i = 0; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        message: `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        sorted = false;
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
        });
      }
    }
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Stooge Sort Implementation
export const stoogeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  const stooge = (l: number, h: number) => {
    if (l >= h) return;

    comparisons++;
    steps.push({
      array: [...array],
      comparing: [l, h],
      message: `Comparing ${array[l].value} and ${array[h].value}`,
    });

    if (array[l].value > array[h].value) {
      [array[l], array[h]] = [array[h], array[l]];
      swaps++;
      steps.push({
        array: [...array],
        swapping: [l, h],
        message: `Swapped ${array[l].value} and ${array[h].value}`,
      });
    }

    if (h - l + 1 > 2) {
      const t = Math.floor((h - l + 1) / 3);
      stooge(l, h - t);
      stooge(l + t, h);
      stooge(l, h - t);
    }
  };

  stooge(0, array.length - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// Pancake Sort Implementation
export const pancakeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  const flip = (end: number) => {
    let start = 0;
    while (start < end) {
      [array[start], array[end]] = [array[end], array[start]];
      swaps++;
      steps.push({
        array: [...array],
        swapping: [start, end],
        message: `Flipped ${array[end].value} and ${array[start].value}`,
      });
      start++;
      end--;
    }
  };

  for (let size = n; size > 1; size--) {
    let maxIdx = 0;
    for (let i = 1; i < size; i++) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [maxIdx, i],
        message: `Comparing ${array[maxIdx].value} and ${array[i].value}`,
      });

      if (array[i].value > array[maxIdx].value) {
        maxIdx = i;
        steps.push({
          array: [...array],
          comparing: [maxIdx],
          message: `New max found: ${array[maxIdx].value}`,
        });
      }
    }

    if (maxIdx !== size - 1) {
      if (maxIdx !== 0) {
        steps.push({
          array: [...array],
          message: `Flipping top ${maxIdx + 1} to bring ${array[maxIdx].value} to front`,
        });
        flip(maxIdx);
      }
      steps.push({
        array: [...array],
        message: `Flipping top ${size} to move ${array[0].value} to correct position`,
      });
      flip(size - 1);
    }

    steps.push({
      array: [...array],
      sorted: [size - 1],
      message: `Element ${array[size - 1].value} is in its final position`,
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
