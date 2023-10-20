/**
 * Displaying the board button by removing the "display-none" class.
 */
function showBoardButton() {
  const boardBtn = document.getElementById("board-btn-container");
  boardBtn.classList.remove("display-none");
}

/**
 * Toggling the display and border styles of the category menu, 
 * and adding event listeners for handling clicks outside of the menu and stopping event propagation.
 */
function toggleCategoryMenu() {
  const category = document.getElementById("renderCategorys");
  const categoryContainer = document.getElementById("category-container");
  const input = document.querySelector(".category-input input");
  toggleDisplayAndBorder(category, categoryContainer);
 
  if (input) {
    return
  }

  document.addEventListener('click', handleDocumentClick);
  category.addEventListener('click', stopPropagation);
}


/**
 * Handling click events on the document.
 * If the clicked element is outside the category container, it adds a new categpry menu, 
 * and removing its border.
 *
 * @param {*} event
 */
function handleDocumentClick(event) {
  const categoryContainer = document.getElementById("category-container");
  const category = document.getElementById("renderCategorys");
  
  if (!categoryContainer.contains(event.target)) {
    addNewCategory();
    category.classList.add("display-none");
    categoryContainer.classList.remove("remove-border");
  }
}


/**
 * Stopping the propagation of the given event.
 *
 * @param {*} event - The event object whose propagation will be stopped.
 */
function stopPropagation(event) {
  event.stopPropagation();
}


/**
 * Toggling the display and border styles of the category and its containner.
 *
 * @param {*} category - The category element whose display and border styles will be toggled.
 * @param {*} categoryContainer - The container of the category element whose border style will be toggled.
 */
function toggleDisplayAndBorder(category, categoryContainer) {
  category.classList.toggle("display-none");
  category.classList.toggle("category-custom-border");
  categoryContainer.classList.toggle("remove-border");
}

/**
 * Selecting a category and updates the category input field.
 * Updating the selected category in the input field, hides the category menu, and removes the border from the category container.
 *
 * @param {number} i - Index of the selected category in the category list.
 */
function useCategory(i) {
  let selection = document.querySelector(".category-input");
  let category = document.getElementById("renderCategorys");
  let categoryContainer = document.getElementById("category-container");
  selection.innerHTML = generateSelectedCategoryHTML(userObj.categorys, i);
  currentCategory = selection.innerText;
  category.classList.add("display-none");
  categoryContainer.classList.remove("remove-border");
}

/**
 * Toggling the display of the assigned contacts menu.
 * Managing the visibility of the assigned contacts menu and handles click events to hide the menu when clicking outside.
 */
function toggleAssigndMenu() {
  const contacts = document.getElementById("contact-container");
  const contactContainer = document.getElementById("assigned-container");
  const input = document.querySelector(".assigned-input input");
  contacts.classList.toggle("display-none");
  contactContainer.classList.toggle("remove-border");
  if (!input) {
    document.addEventListener("click", (event) => {
      if (!contactContainer.contains(event.target)) {
        contacts.classList.add("display-none");
        contactContainer.classList.remove("remove-border");
      }
    });
    contacts.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}

/**
 * Hiding the assigned-to dropdown and removes its border.
 */
function hideAssignedToDropdown() {
  let assignedContainer = document.getElementById("contact-container");
  let assignedInput = document.getElementById("assigned-container");
  assignedContainer.classList.add("display-none");
  assignedInput.classList.remove("remove-border");
}

/**
 * Clearing all input fields and resets priority, subtasks, and category.
 * Clearing the values of input fields, resets priority selection, subtasks, and category selection.
 * Also updates the category input and button elements, and triggers rendering of categories and subtasks.
 */
function clearAll() {
  clearCategory();
  clearPriorityButtons();
  clearInputFields();
  currentPrio = undefined;
  subtasks = [];
  currentCategory = undefined;
  renderCategorys();
  renderSubtasks();
}

/**
 * Clearing the selected category input and button content.
 * Reseting the content of the category input and button elements to their basic state.
 */
function clearCategory() {
  const categoryInput = document.getElementById("category-input");
  const categoryButton = document.getElementById("category-button");
  if (categoryInput && categoryButton) {
    categoryInput.innerHTML = generateBasicCategoryInputHTML();
    categoryButton.innerHTML = generateBasicCategoryButtonHTML();
  }
}

/**
 * Clearing the active state of priority buttons and resets priority images.
 * Removing the active class from priority buttons and updates the image sources for priority images.
 */
function clearPriorityButtons() {
  const priorityButtons = ["urgentBtn", "mediumBtn", "lowBtn"];
  priorityButtons.forEach((button) => {
    document
      .getElementById(button)
      .classList.remove(`${button.slice(0, -3)}-active`);
    document
      .getElementById(button)
      .classList.remove(`${button.replace("Btn", "")}-active`);
  });
  const priorityImages = ["lowImg", "mediumImg", "urgentImg"];
  priorityImages.forEach((image) => {
    document.getElementById(image).src = `./img/prio_${image
      .replace("Img", "")
      .toLowerCase()}_color.png`;
  });
}

/**
 * Clearing the values of specified input fields.
 * Setting the values of designated input fields to an empty string.
 */
function clearInputFields() {
  const inputFields = ["title-input", "description-input", "task-date"];
  inputFields.forEach((field) => (document.getElementById(field).value = ""));
}

/**
 * Switching a container and button to input elements.
 * Clearing and replaces the content of a container and button based on their IDs.
 *
 * @param {string} containerId - The ID of the container element to switch to an input.
 * @param {string} buttonId - The ID of the button element associated with the container.
 */
function changeToInput(containerId, buttonId) {
  let cId = document.getElementById(containerId);
  let bId = document.getElementById(buttonId);
  cId.innerHTML = "";
  bId.innerHTML = "";
  if (cId.id.includes("category-input")) {
    cId.innerHTML += generateCategoryInputHTML();
    bId.innerHTML += generateCategoryButtonHTML();
  } else if (cId.id.includes("assigned-input")) {
    cId.innerHTML += generateAssignedInputHTML();
    bId.innerHTML += generateAssigendButtonHTML();
    let generatedInput = document.getElementById("generatedInput");
    if (generatedInput) {
      generatedInput.focus();
    }
  } else {
    bId.innerHTML += generateSubtaskButtonHTML();
    cId.innerHTML += generateSubtaskInputHTML();
    let generatedInput = document.getElementById("generatedSubtaskInput");
    if (generatedInput) {
      generatedInput.focus();
    }
  }
}

/**
 * Clearing the value of an input element.
 * Clearing the value of the input element associated with the given button element.
 *
 * @param {HTMLElement} element - The button element triggering the input clearing.
 */
function clearInput(element) {
  let input = element.parentNode.parentNode.parentNode.querySelector("input");
  input.value = "";
}

/**
 * Toggling the state of a subtask checkbox image between checked and unchecked.
 * Changing the image source and attribute of the checkbox based on its current state.
 *
 * @param {number} i - The index of the subtask checkbox image.
 */
function changeSubtaskCheckbox(i) {
  let checkboxImg = document.getElementById(`subtask-checkbox${i}`);
  if (checkboxImg.getAttribute("src") === "./img/checkbox.png") {
    checkboxImg.src = "./img/checkbox_checked.png";
    checkboxImg.setAttribute("checked", "true");
  } else {
    checkboxImg.src = "./img/checkbox.png";
    changeCheckbox.setAttribute("checked", "false");
  }
}

/**
 * Toggling the state of a checkbox image between checked and unchecked.
 * Changing the image source of the checkbox based on its current state.
 *
 * @param {number} i - The index of the checkbox image.
 */
function changeCheckbox(i) {
  let checkboxImg = document.getElementById(`checkboxImg${i}`);
  if (checkboxImg.getAttribute("src") === "./img/checkbox.png") {
    checkboxImg.src = "./img/checkbox_checked.png";
  } else {
    checkboxImg.src = "./img/checkbox.png";
  }
}
