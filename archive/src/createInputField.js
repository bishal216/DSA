const createInputField = (placeholder = "Enter text", type = "text") => {
  // Create the input element
  const input = document.createElement("input");

  // Set attributes for the input element
  input.type = type;
  input.placeholder = placeholder;

  // Optionally, you can add other attributes or classes
  input.classList.add("input-field"); // Adding a class for styling
  input.id = "dynamic-input"; // Optional ID

  // Append the input field to the body or a specific container
  document.body.appendChild(input); // You can change this to append to a different parent element
};

const createDropdown = (options = [], placeholder = "Select an option") => {
  // Create the select element
  const select = document.createElement("select");

  // Optionally, add a placeholder as the first option
  const defaultOption = document.createElement("option");
  defaultOption.textContent = placeholder;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  // Loop through the options array and create <option> elements
  options.forEach((optionText) => {
    const option = document.createElement("option");
    option.textContent = optionText; // Set the option's text
    select.appendChild(option); // Append each option to the select element
  });

  // Optionally, add classes or ID to the select element
  select.classList.add("dropdown"); // For styling, if needed
  select.id = "dynamic-dropdown"; // Optional ID

  // Append the select (dropdown) to the body or a specific container
  document.body.appendChild(select); // You can change this to append to a specific parent element
};
