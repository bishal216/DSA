class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(sizeLimit = Infinity) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.sizeLimit = sizeLimit;
  }

  // Append a node to the end
  append(value) {
    if (this.size >= this.sizeLimit) {
      alert("Max size reached!");
      return;
    }

    const newNode = new Node(value);

    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
    updateUI();
  }

  // Insert at a specific index
  insertAt(value, index) {
    if (this.size >= this.sizeLimit) {
      alert("Max size reached!");
      return;
    }

    if (index < 0 || index > this.size) {
      alert("Invalid index!");
      return;
    }

    const newNode = new Node(value);

    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
      if (!this.tail) this.tail = newNode;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev.next;
      }
      newNode.next = prev.next;
      prev.next = newNode;
      if (!newNode.next) this.tail = newNode;
    }

    this.size++;
    updateUI();
  }

  // Remove at a specific index
  removeAt(index) {
    if (index < 0 || index >= this.size) {
      alert("Invalid index!");
      return;
    }

    if (index === 0) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        prev = prev.next;
      }
      prev.next = prev.next.next;
      if (!prev.next) this.tail = prev;
    }

    this.size--;
    updateUI();
  }

  // Remove first element
  removeFirst() {
    if (!this.head) {
      alert("List is empty!");
      return;
    }

    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size--;
    updateUI();
  }

  // Remove last element
  removeLast() {
    if (!this.head) {
      alert("List is empty!");
      return;
    }

    if (this.size === 1) {
      this.head = this.tail = null;
    } else {
      let prev = this.head;
      while (prev.next && prev.next.next) {
        prev = prev.next;
      }
      prev.next = null;
      this.tail = prev;
    }

    this.size--;
    updateUI();
  }

  // Print list
  print() {
    let current = this.head;
    let output = "";
    while (current) {
      output += `${current.value} -> `;
      current = current.next;
    }
    console.log(output + "null");
  }
}

// Global linked list instance
let linkedList;

// Create linked list with max size
function create() {
  const maxSize = document.getElementById("max-size").value;
  linkedList = new LinkedList(maxSize ? parseInt(maxSize) : Infinity);
  console.log(linkedList);
  updateUI();
}

// Append value to linked list
function append() {
  if (!linkedList) return alert("Create a list first!");
  const value = document.getElementById("value-input").value;
  if (!value) return alert("Enter a value!");
  linkedList.append(value);
}

// Insert at specific index
function insertAtIndex() {
  if (!linkedList) return alert("Create a list first!");
  const value = document.getElementById("value-input").value;
  if (!value) return alert("Enter a value!");
  const index = prompt("Enter index:");
  if (index === null) return;
  linkedList.insertAt(value, parseInt(index));
}

// Remove at specific index
function removeAtIndex() {
  if (!linkedList) return alert("Create a list first!");
  const index = prompt("Enter index to remove:");
  if (index === null) return;
  linkedList.removeAt(parseInt(index));
}

// Remove first node
function removeFirst() {
  if (!linkedList) return alert("Create a list first!");
  linkedList.removeFirst();
}

// Remove last node
function removeLast() {
  if (!linkedList) return alert("Create a list first!");
  linkedList.removeLast();
}

// Update UI visualization
// Update the UI to show the linked list visually

let nodeCounter = 0; // To generate unique IDs for each node

const createNode = (value) => {
  const node = document.createElement("div");
  node.classList.add("node");
  node.innerText = value;

  node.id = `node-${nodeCounter++}`; // Assign unique ID
  return node;
};

/**
 * Draws an arrow between two nodes with text on the arrow.
 * @param {string} startNodeId - The ID of the starting node.
 * @param {string} endNodeId - The ID of the ending node.
 * @param {string} text - The text to display on the arrow.
 */
function drawArrowWithText(startNodeId, endNodeId, text) {
  // Get the start and end node elements
  const startNode = document.getElementById(startNodeId);
  const endNode = document.getElementById(endNodeId);

  if (!startNode || !endNode) {
    console.error("Start or end node not found!");
    return;
  }

  // Create the arrow using LeaderLine
  const line = new LeaderLine(startNode, endNode, {
    color: "black",
    path: "straight",
  });

  // Create a text label for the arrow
  const label = document.createElement("div");
  label.innerText = text;
  label.style.position = "absolute";
  label.style.backgroundColor = "white";
  label.style.padding = "2px 5px";
  label.style.borderRadius = "3px";
  label.style.fontSize = "12px";
  label.style.color = "black";
  label.style.border = "1px solid black";

  // Append the label to the body (or a specific container)
  document.body.appendChild(label);

  // Position the label at the midpoint of the arrow
  const updateLabelPosition = () => {
    const startRect = startNode.getBoundingClientRect();
    const endRect = endNode.getBoundingClientRect();

    const midX = (startRect.left + endRect.left) / 2;
    const midY = (startRect.top + endRect.top) / 2;

    label.style.left = `${midX}px`;
    label.style.top = `${midY}px`;
  };

  // Update the label position initially and on window resize
  updateLabelPosition();
  window.addEventListener("resize", updateLabelPosition);

  // Store the line and label for later cleanup
  lines.push({ line, label });
}

let lines = []; // Store arrow lines to clear on each update

function updateUI() {
  const container = document.getElementById("linked-list");
  container.innerHTML = ""; // Clear previous UI

  // Remove existing arrows and labels
  lines.forEach(({ line, label }) => {
    line.remove();
    label.remove();
  });
  lines = []; // Reset the array

  if (!linkedList || !linkedList.head) {
    // Handle empty list
    return;
  }

  let current = linkedList.head;
  const nodeElements = []; // Store node elements for arrows

  while (current) {
    const nodeDiv = createNode(current.value);
    nodeElements.push(nodeDiv);
    container.appendChild(nodeDiv);
    current = current.next;
  }

  // Add NULL label at the end
  const nullDiv = document.createElement("div");
  nullDiv.classList.add("label");
  nullDiv.innerText = "NULL";
  container.appendChild(nullDiv);

  // Draw arrows with text between nodes
  for (let i = 0; i < nodeElements.length - 1; i++) {
    const startNodeId = nodeElements[i].id;
    const endNodeId = nodeElements[i + 1].id;
    drawArrowWithText(startNodeId, endNodeId, "Next");
  }
}

new LeaderLine(
  document.getElementById("sorting"),
  document.getElementById("searching"),
);
