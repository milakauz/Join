let newSubtasks = [];
let editedAssigned = [];
let taskIndex;
let taskCard;

/**
 * Saves the edited task by updating the user's tasks, storing the data, and performing UI updates.
 */
function saveEditTask() {
  let updatedTask = getEditedVaraible();
  userObj["tasks"][taskIndex] = updatedTask;
  setItem(userObj.email, JSON.stringify(userObj));
  resetPrioButtons();
  closeEditModal(document.getElementById("openEditModal"));
  document.getElementById("templateEditTask").innerHTML = "";
  boardClosePopUpTask();
  boardOpenPopUpTask(taskIndex, taskCard);
  showTopDown("Task edited!");
}

/**
 * Resets the priority buttons to their default state by updating images and classes.
 */
function resetPrioButtons() {
  const priorities = ["low", "medium", "urgent"];
  const images = {};
  const buttons = {};
  priorities.forEach((priority) => {
    checkPriority(priority);
    images[priority].src = `./img/prio_${priority}_color.png`;
    buttons[priority].classList.remove(`${priority}-active`);
  });
}


/**
 * Checking if priority is urgent, medium or low. 
 * 
 * @param {*} priority
 */
function checkPriority(priority){
  if (priority == "urgent") {
    images[priority] = document.getElementById(`urgentImg`);
    buttons[priority] = document.getElementById(`urgentBtn`);
  } else if (priority == "medium") {
    images[priority] = document.getElementById(`mediumImg`);
    buttons[priority] = document.getElementById(`mediumBtn`);
  } else if (priority == "low") {
    images[priority] = document.getElementById(`lowImg`);
    buttons[priority] = document.getElementById(`lowBtn`);
  }
}

/**
 * Collects and returns the edited task data as an object with updated values.
 * 
 * @returns {Object} The edited task object with updated values.
 */
function getEditedVaraible() {
  settingTaskValues();
  getEditAssignedContacts();
}

function editTask(i) {
  window.location.href = `addtask.html?index=${i}`;
}


/**
 * Setting the values of the edited task for a new task to be generated.
 */
function settingTaskValues() {
  let currentTask = userObj["tasks"][taskIndex];
  let title = document.getElementById("editTitle");
  let description = document.getElementById("editDescription");
  let status = currentTask["status"];
  let category = currentTask["category"];
  let categoryColor = currentTask["categoryColor"];
  let date = document.getElementById("editDate");
  let prio = currentPrio;
  if (prio == undefined) {
    prio = currentTask["prio"];
  }
  const id = currentTask["id"];
  settingNewTask(title, description, status, category, categoryColor, date, prio, id)
}


/**
 * Setting the new task.
 *
 * @param {*} t
 * @param {*} de
 * @param {*} s
 * @param {*} c
 * @param {*} cC
 * @param {*} d
 * @param {*} p
 * @param {*} id
 * @returns {{ titel: t; description: de; status: ans; category: c; categoryColor: cC; assigned: {}; date: d; prio: p; subtasks: {}; id: id; }}
 */
function settingNewTask(t, de, s, c, cC, d, p, id){
  let newTask = {
    titel: t.value, 
    description: de.value,
    status: s,
    category: c,
    categoryColor: cC,
    assigned: editedAssigned,
    date: d.value,
    prio: p,
    subtasks: newSubtasks,
    id: id,
  };
  return newTask;
}

/**
 * Sets the active state and updates the image of the priority button in the edit view.
 * @param {Object} currentTask - The task object containing priority information.
 */
function setEditButtons(currentTask) {
  let currentButton = document.getElementById(
    `${"edit-" + currentTask["prio"] + "-btn"}`
  );
  let currentButtonImage = document.getElementById(
    `${"edit-" + currentTask["prio"] + "-img"}`
  );
  currentButton.classList.add(`${currentTask["prio"] + "-active"}`);
  currentButtonImage.src = `./img/prio_${currentTask["prio"]}.png`;
}

/**
 * Updates the task priority selection in the edit view based on the selected button.
 * Adjusts the active classes and image sources accordingly.
 * @param {HTMLElement} button - The priority button that was clicked.
 * @param {string} priority - The priority level associated with the button.
 */
function getEditTaskPrio(button, priority) {
  const buttons = document.querySelectorAll(".prioBtn");
  let images = {
    low: document.getElementById("edit-low-img"),
    medium: document.getElementById("edit-medium-img"),
    urgent: document.getElementById("edit-urgent-img"),
  };
  checkBtnPriority(buttons);
  button.classList.add(priority + "-active");
  images[priority].src = `./img/prio_${priority}.png`;
  currentPrio = priority;
}


/**
 * Checking the priority of buttons to set the correct colors/images.
 *
 * @param {*} buttons
 */
function checkBtnPriority(buttons) {
  buttons.forEach(function (btn) {
    if (btn.classList.contains(priority + "-active")) {
      btn.classList.remove(priority + "-active");
      currentPrio;
    } else if (btn !== button) {
      btn.classList.remove("low-active", "medium-active", "urgent-active");
      images.low.src = "./img/prio_low_color.png";
      images.medium.src = "./img/prio_medium_color.png";
      images.urgent.src = "./img/prio_urgent_color.png";
    }
  });
}

/**
 * Renders the user's contacts in the edit view by populating the HTML content.
 */
function renderUserContacts() {
  let contacts = document.getElementById("editRenderContacts");
  contacts.innerHTML = "";
  contacts.innerHTML += generateEditUserAssignedHTML();
  for (let i = 0; i < userObj.contacts.length; i++) {
    const contact = userObj.contacts[i];
    contacts.innerHTML += renderEditContactsHTML(contact, i);
  }
  contacts.innerHTML += generateAddNewEditContact();
}

/**
 * Toggles the state of an edit checkbox image between checked and unchecked.
 * @param {number} i - The index of the checkbox to be toggled.
 */
function changeEditCheckbox(i) {
  let checkboxImg = document.getElementById(`checkboxEditImg${i}`);
  if (checkboxImg.getAttribute("src") === "./img/checkbox.png") {
    checkboxImg.src = "./img/checkbox_checked.png";
  } else {
    checkboxImg.src = "./img/checkbox.png";
  }
}

/**
 * Initiates the editing of a generated subtask by replacing its content with an edit input.
 * @param {number} index - The index of the subtask to be edited.
 */
function editGeneratedSubtask(index) {
  let subtask = document.getElementById(`subtask-text${index}`);
  let btnContainer = document.getElementById(`subtaskButtonsContainer${index}`);
  let subtaskCircle = document.getElementById(`subtaskCircle${index}`);
  subtaskCircle.classList.add("display-none");
  btnContainer.style.display =
    btnContainer.style.display === "none" ? "flex" : "none";
  subtask.innerHTML = generateEditSubtaskEditInput(subtask.innerText, index);
}

/**
 * Accepts the edited subtask input and updates the subtask at the specified index.
 * Renders the updated subtask content.
 * @param {number} index - The index of the subtask to be updated.
 */
function acceptEditEditedSubtask(index) {
  let input = document.getElementById(`editedSubtask-input${index}`).value;
  (newSubtasks[index] = {
    title: input,
    property: "unchecked",
  }),
    renderEditSubtasks();
}

/**
 * Retrieves the list of edited assigned contacts based on checked checkboxes.
 * Populates the 'editedAssigned' array with the names of selected contacts.
 */
function getEditAssignedContacts() {
  editedAssigned = [];
  let checkboxImages = document.querySelectorAll(".checkboxEditImg");
  for (let i = 0; i < checkboxImages.length; i++) {
    const checkbox = checkboxImages[i];
    const source = checkbox["currentSrc"];
    if (source.includes("/img/checkbox_checked.png")) {
      let index = i - 1;
      if (index == -1) {
        editedAssigned.push(userObj["name"]);
      } else {
        editedAssigned.push(userObj["contacts"][index]["name"]);
      }
    }
  }
}

/**
 * Toggling the visibility and styling of the assigned menu and handles outside click events.
 */
function toggleEditAssignedMenu() {
  const contacts = document.getElementById("edit-contact-container");
  const contactContainer = document.getElementById("edit-assigned-container");
  const input = document.querySelector(".assigned-input input");
  contacts.classList.toggle("display-none");
  contactContainer.classList.toggle("remove-border");
  settingEvenListener(contacts, contactContainer, input);
}


/**
 * Setting evenListeners.
 *
 * @param {*} contacts
 * @param {*} contactContainer
 * @param {*} input
 */
function settingEvenListener(contacts, contactContainer, input) {
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
 * Rendering the edit subtasks by populating the HTML content with subtask data.
 */
function renderEditSubtasks() {
  let content = document.getElementById("subtask-content");
  content.innerHTML = "";
  for (let i = 0; i < newSubtasks.length; i++) {
    const subtask = newSubtasks[i]["title"];
    content.innerHTML += generateEditSubtaskHTML(i, subtask);
  }
}

/**
 * Copying subtasks from the given current task and returns a new array of subtasks.
 * 
 * @param {Object} currentTask - The current task containing subtasks.
 * @returns {Array} An array of new subtasks copied from the current task.
 */
function pushSubtasks(currentTask) {
  newSubtasks = [];
  for (let i = 0; i < currentTask["subtasks"].length; i++) {
    const subT = currentTask["subtasks"][i];
    newSubtasks.push({
      title: subT["title"],
      property: subT["property"],
    });
  }
}

/**
 * Adding a new edited subtask to the list and renders the updated subtask content.
 */
function addEditedSubtask() {
  let input = document.getElementById("generatedSubtaskInput").value;
  if (input !== "") {
    newSubtasks.push({
      title: input,
      property: "unchecked",
    });
  }
  renderEditSubtasks();
  resetEditInput();
}

/**
 * Deleting an edited subtask from the list and renders the updated subtask content. 
 * 
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteGeneratedEditSubtask(index) {
  newSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Changing the subtask section to display an edit input field and button.
 * Focuses on the generated subtask input field if available.
 */
function changeToEditInput() {
  let input = document.getElementById("subtask-edit-input");
  let button = document.getElementById("subtasks-edit-button");
  input.innerHTML = generateEditInputHTML();
  button.innerHTML = generateEditButtonHTML();
  let generatedInput = document.getElementById("generatedSubtaskInput");
  if (generatedInput) {
    generatedInput.focus();
  }
}

/**
 * Changing the subtask section to display a basic edit subtask input and button.
 */
function resetEditInput() {
  let input = document.getElementById("subtask-edit-input");
  let button = document.getElementById("subtasks-edit-button");
  input.innerHTML = generateBasicEditSubtaskInputHTML();
  button.innerHTML = generateBasicEditSubtaskButtonHTML();
}
