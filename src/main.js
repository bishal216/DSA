const barManager = new BarManager("sort-container", {
  animationDelay: 250,
  minHeightOffset: 30,
});

// Initialize with random values
barManager.initialize();

// Generate Random Values
document.getElementById("generate-random").addEventListener("click", () => {
  barManager.reSize(document.getElementById("num-bars").value);
});

// Use User Values
document.getElementById("use-values").addEventListener("click", () => {
  const values = document
    .getElementById("values-to-sort")
    .value.split(",")
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !isNaN(v)); // Filter out invalid numbers
  if (values.length > 0) {
    barManager.initialize(values);
  }
});

const sortingAlgorithms = {
  bubbleSort,
  insertionSort,
  selectionSort,
  shellSort,
  quickSort,
  mergeSort,
  cocktailSort,
  oddEvenSort,
  gnomeSort,
};

document.getElementById("sort-button").addEventListener("click", () => {
  sort();
});

const sort = async () => {
  const ButtonsToDisable = document.querySelectorAll(".disable-when-sorting");
  ButtonsToDisable.forEach((button) => {
    button.disabled = true;
  });

  // Get selected sort type (the sorting algorithm name)
  const sortType = document.getElementById("sort-type").value;

  // Check if the selected algorithm exists in the sortingAlgorithms object
  if (sortingAlgorithms[sortType]) {
    await sortingAlgorithms[sortType](); // Call the selected algorithm
  } else {
    console.error("Unsupported sort type:", sortType);
  }

  ButtonsToDisable.forEach((button) => {
    button.disabled = false;
  });
};
