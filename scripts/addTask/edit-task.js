let taskToEdit;
let editedTaskIndex;


/**
 *  * Extracting the 'index' parameter from the URL and uses it to retrieve the corresponding task from the user object.
 * 
 * @returns {Object|boolean} - The task object if the index is valid and exists in the user's tasks, otherwise false.
 * @throws {Error} - If there is an error in parsing the URL or retrieving the index.
 */
function getIndexFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    let data = params.get("index");
    if (data !== null && !isNaN(Number(data))) {
      let index = Number(data);
      editedTaskIndex = index;
      taskToEdit = userObj["tasks"][index];
      return taskToEdit;
    }
    return false;
  } catch (e) {
    return false;
  }
}


/**
 * Checks if there is a task to edit based on the URL index. 
 * If true: starting the event listener for editing a task and changing the input values to the task's values. 
 * Otherwise: starting the event listener for adding a task.
 *
 * @returns {boolean}
 */
function checkIfEditTask() {
  let taskToEdit = getIndexFromURL();
  if (taskToEdit) {
    startEventListenerEditTask();
    changeInputs(taskToEdit);
  } else {
    startEventListenerAddTask();
    return false;
  }
}


/**
 * Updating the input fields, buttons, and other elements based on the task to be edited.
 *
 * @param {*} taskToEdit - The task object with values to populate the input fields.
 */
function changeInputs(taskToEdit) {
  let inputs = getInputs();
  inputs.title.value = taskToEdit.titel;
  inputs.description.value = taskToEdit.description;
  inputs.date.value = taskToEdit.date;
  inputs.headline.innerText = "Edit Task";
  changePriority(taskToEdit);
  inputs.submitBtn.innerHTML = changeSubmitBtn();
  inputs.submitBtnResp.innerHTML = changeSubmitBtn();
  inputs.categoryContainer.remove();
  inputs.categoryLabel.remove();
  inputs.backButton.classList.remove("d-none");
  loadSubtasks();
  loadAssignedContacts();
}


/**
 * Retrieving the information of the input fields of edit task
 *
 * @returns {Object} - An object containing references of the input fields and elements.
 */
function getInputs() {
  let addTaskInputs = {
    title: document.getElementById("title-input"),
    headline: document.getElementById("addTaskHeadline"),
    description: document.getElementById("description-input"),
    date: document.getElementById("task-date"),
    submitBtnResp: document.getElementById("submit-btn-responsive"),
    submitBtn: document.getElementById("submit-btn-web"),
    taskForm: document.getElementById("task-form"),
    categoryLabel: document.getElementById("category-label"),
    categoryContainer: document.getElementById("category-container"),
    backButton: document.querySelector(".back-button"),
  };
  return addTaskInputs;
}


/**
 * Changing the priority of the task being edited.
 *
 * @param {Object} taskToEdit - The task object with the priority value to set.
 */
function changePriority(taskToEdit) {
  let priority = taskToEdit.prio;
  if (priority == "urgent") {
    getTaskPrio(document.getElementById("urgentBtn"), "urgent");
  }

  if (priority == "medium") {
    getTaskPrio(document.getElementById("mediumBtn"), "medium");
  }

  if (priority == "low") {
    getTaskPrio(document.getElementById("lowBtn"), "low");
  }
}


/**
 * Returning a HTML string for the "Edit" submit button.
 *
 * @returns {string} - The HTML string.
 */
function changeSubmitBtn() {
  return `Edit <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path d="M4.0166 12.1704L10.0166 18.1704L20.0166 6.17041" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;
}


/**
 * Saving the edited task in the user object and updating the data in local storage
 *
 * @async
 * @returns {*}
 */
async function saveEditedTask() {
  let userMail = userObj.email;
  let inputs = getInputs();
  userObj.tasks[editedTaskIndex].titel = inputs.title.value;
  userObj.tasks[editedTaskIndex].description = inputs.description.value;
  userObj.tasks[editedTaskIndex].prio = getEditedPrio();
  userObj.tasks[editedTaskIndex].date = inputs.date.value;
  saveEditedContacts();
  saveEditedSubtasks();
  await setItem(userMail, JSON.stringify(userObj));
  showTopDown("Task edited");
  redirectToBoardAfterDelay();
}


/**
 * Loading the subtasks from the task being edited into the global subtasks array. 
 * And rendering the subtasks on the page.
 */
function loadSubtasks() {
  taskToEdit.subtasks.forEach((task) => {
    subtasks.push(task.title);
  });
  renderSubtasks();
}


/**
 * Loading the assigned contacts from the task being edited into the global assigned array
 * and updating the checkbox images for the assigned contacts.
 */
function loadAssignedContacts() {
  taskToEdit.assigned.forEach((contact) => {
    assigned.push(contact);
    document.querySelectorAll(".contact-item").forEach((item) => {
      let itemText = item.innerText.trim();
      if (itemText == contact) {
        item
          .querySelector(".checkboxImg")
          .setAttribute("src", "./img/checkbox_checked.png");
      }
    });
  });
}


/**
 * Gets the edited priority from the active priority button on the page.
 *
 * @returns {string} - The edited priority (low/medium/urgent).
 */
function getEditedPrio() {
  if (document.querySelector(".low-active")) {
    return "low";
  }
  if (document.querySelector(".medium-active")) {
    return "medium";
  }
  if (document.querySelector(".urgent-active")) {
    return "urgent";
  }
}

/**
 * Saving the edited contacts by updating the assigned contacts in the task being edited.
 */
function saveEditedContacts() {
  userObj.tasks[editedTaskIndex].assigned = [];
  document.querySelectorAll(".contact-item").forEach((item) => {
    let itemText = item.innerText.trim();
    let checkboxImg = item.querySelector(".checkboxImg");
    if (checkboxImg.getAttribute("src") == "./img/checkbox_checked.png") {
      userObj.tasks[editedTaskIndex].assigned.push(itemText);
    }
  });
}


/**
 * Saving the edited subtasks by updating the subtasks in the task being edited.
 */
function saveEditedSubtasks() {
  userObj.tasks[editedTaskIndex].subtasks = [];
  document.querySelectorAll(".subtask-text").forEach((subtaskText) => {
    let editedSubtask = {
      title: subtaskText.innerText,
      property: "unchecked",
    };
    userObj.tasks[editedTaskIndex].subtasks.push(editedSubtask);
  });
}
