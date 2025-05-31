import { SearchArrayItem } from "/src/arrays.js";
const searchingAlgorithms = {
  linearSearch: (value) => searchLinearSearch(value),
  binarySearch: (value) => searchBinarySearch(value),
};

// ======= GLOBAL VARIABLES ========
let searchArray = [];
const searchArrayLength = 25;
const searchArea = document.getElementById("search-play-area");

// ========== ARRAY ITEM CLASS ==========

// ========== HELPER METHODS ==========
function searchCreateArray() {
  searchArray = Array.from({ length: searchArrayLength }, () => {
    const value = Math.floor(Math.random() * 100);
    return new SearchArrayItem(null, value);
  });
}

function searchDisplayArray() {
  const row = document.createElement("div");
  row.className = "horizontal-flex";
  searchArea.appendChild(row);

  searchArray.forEach((item) => {
    item.container = row;
    item.displayDiv();
  });
}

function searchReset() {
  searchArray = [];
  searchArea.innerHTML = "";
  searchCreateArray();
  searchDisplayArray();
}

function searchToggleButtons(disable) {
  const buttons = document.querySelectorAll(".disable-when-searching");
  buttons.forEach((button) => {
    button.disabled = disable;
  });
}

async function searchDelay(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function searchHighlight(i, condition, delay = 100) {
  if (searchArray[i] && searchArray[i].div) {
    if (condition) {
      searchArray[i].div.classList.add("match");
    } else {
      searchArray[i].div.classList.add("no-match");
    }
    await searchDelay(delay);
    // searchArray[i].div.classList.remove("match", "no-match");
  } else {
    console.error(`Element at index ${i} is undefined or has no div property`);
  }
}

// ========== SEARCH FUNCTIONS ==========
async function search() {
  const valueToSearch = parseInt(document.getElementById("search-value").value);
  searchToggleButtons(true);

  const searchType = document.getElementById("search-type").value;
  if (searchType in searchingAlgorithms) {
    await searchingAlgorithms[searchType](valueToSearch);
  } else {
    console.error("Unsupported search type:", searchType);
  }

  searchToggleButtons(false);
}

async function searchLinearSearch(value) {
  for (let i = 0; i < searchArrayLength; i++) {
    const condition = searchArray[i].value === value;
    await searchHighlight(i, condition);
    if (condition) {
      return i;
    }
  }
  console.log(-1);
  return -1;
}

async function searchBinarySearch(value) {
  let left = 0;
  let right = searchArrayLength - 1;
  searchArray.sort((a, b) => a.value - b.value);
  searchDisplayArray();
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    await searchHighlight(mid, searchArray[mid].value === value, 500);

    if (searchArray[mid].value === value) {
      console.log(mid);
      return mid;
    } else if (searchArray[mid].value < value) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  console.log(-1);
  return -1;
}

// Initialize the array and display it on page load
export { searchReset };
