const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("description-input");
const taskDateInput = document.getElementById("task-date");
let successFull;

/**
 * Adding an event listener to the task form to handle the submit event for adding a new task.
 */
function startEventListenerAddTask() {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInputs();
    if (successFull) {
      addTask();
    }
  });
}


/**
 * Adding an event listener to the task form to handle the submit event for editing a task.
 */
function startEventListenerEditTask() {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInputs();
    if (successFull) {
      saveEditedTask();
    }
  });
}


/**
 * Validating the input fields of the task form.
 */
function validateInputs() {
  const titelValue = titleInput.value.trim();
  const descriptionValue = descriptionInput.value.trim();
  const dateValue = taskDateInput.value.trim();
  const titleValidated = checkValues(titelValue, titleInput);
  const descriptionValidated = checkValues(descriptionValue, descriptionInput);
  const dateValidated = checkValues(dateValue, taskDateInput);
  allValidated(titleValidated, descriptionValidated, dateValidated);
}


/**
 * Checking if the given value is empty or not, and setting the corresponding CSS class for the input element.
 * @param {string} value - The value of the input field to be checked.
 * @param {HTMLElement} element - The input element that needs to be validated.
 * @returns {boolean} - Returning true if the value is not empty, otherwise: undefined.
 */
function checkValues(value, element) {
  if (value == "") {
    setError(element);
  } else {
    setSuccess(element);
    return true;
  }
}


/**
 * Adding error styling to the given input element.
 *
 * @param {HTMLElement} element - The input element that gets the error styling.
 */
function setError(element) {
  element.nextSibling.nextSibling.classList.remove("d-none");
  element.style.border = "1px solid red";
}


/**
 *  Adding success styling to the given input element.
 * @param {HTMLElement} element - The input element that gets the success styling
 */
function setSuccess(element) {
  element.nextSibling.nextSibling.classList.add("d-none");
  element.style.border = "1px solid #d1d1d1";
}


/**
 * Checking if all the provided validation results are true.
 * @param {*} title - The result of the title validation.
 * @param {*} description - The result of the description validation.
 * @param {*} date - The result of the date validation.
 * @returns {boolean} - True: if all validations are successful, otherwise: false
*/
function allValidated(title, description, date) {
  if (title && description && date) {
    successFull = true;
    return successFull;
  } else {
    return false;
  }
}
