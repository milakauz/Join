/**
 * Generating the HTML string for a progress bar with the given percentage.
 *
 * @param {number} percentage - The percentage of progress to display.
 * @returns {string} - The HTML string for the progress bar.
 */
function htmlTemplateProgressBar(percentage) {
  return `
            <div class="progress-bar" style="width:${percentage}%" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
        `;
}

/**
 * Generating the HTML string for a progress count display.
 *
 * @param {Object} element - The object containing the checked and unchecked count.
 * @returns {string} - The HTML string for the progress count display.
 */
function htmlTemplateProgressCount(element) {
  return `
    <div class="d-flex">
      ${element["checked"]}/${element["unchecked"] + element["checked"]} 
        <span id="subtasksText"></span>
    </div>
    `;
}

/**
 * Generating the HTML string for a progress section, which includes a progress bar and a progress count.
 *
 * @param {number} percentage - The percentage of progress to display.
 * @param {string} id - The identifier for the task.
 * @param {Object} task - The task object containing details for the progress count.
 * @returns {string} - The HTML string for the progress section. Returns an empty string if percentage is -1.
 */
function htmlTemplateProgressSection(percentage, id, task) {
  if (percentage == -1) {
    return "";
  } else {
    return /*html*/ `
            <div id="subtask-progress${id}" class="progress">
                ${htmlTemplateProgressBar(percentage)}
            </div>
            <div class="d-flex progress-count">
                ${htmlTemplateProgressCount(countProperty(task))}
            </div>

        `;
  }
}

/**
 * Generating the HTML string for an empty drop area with a given text.
 *
 * @param {string} text - The text to display in the empty drop area.
 * @returns {string} - The HTML string for the empty drop area.
 */
function htmlTemplateEmptyDropArea(text) {
  return /*html*/ `
    <div class="emptyDropArea">${text}</div>
    `;
}

/**
 * Generates the HTML template for a given task element for the "to do" category.
 *
 * @function
 * @param {Object} element - The task object containing details like title, description, category, category color, etc.
 * @param {number} i - The index or identifier for the task, used to generate unique IDs for DOM elements.
 * @param {string} priority - The HTML string representing the priority icon for the task.
 * @returns {string} HTML template string for the task, which includes details like category, title, description, and assigned members.
 */
function htmlTemplateToDo(element, i, priority) {
  return `<div status="to do" currentId="${i}" titel="${element["titel"]}" id="cardTodo${i}" onclick="boardOpenPopUpTask(this.getAttribute('currentId'), this)"  draggable="true" ondragstart="startDragging(this.getAttribute('currentId'), this)" class="moveableCard bgWhite2 cursorPointer boxShadow border rounded-5 p-2 my-3 d-flex flex-column align-items-start">
            <div class="textWhite border rounded-3 px-3 m-2 task-headline" style="background-color:${element["categoryColor"]}">${element["category"]}</div>
            <div class="mt-2 mx-2 bold sub-headline">
            ${element["titel"]}
            </div>
              <div class="cardText mx-2 my-1">
                  ${element["description"]}
              </div>
                <div class="progress-section">
                    ${htmlTemplateProgressSection(checkSubtasks(element), i, element)}
                </div>
              <div class="assignedPrioContainer d-flex justify-content-between mx-2 my-1 w-100 pe-4 align-items-center">
                  <div class="assignedCardContainer d-flex textWhite" id="assignedToDo${i}"></div>
                  <div>${priority}</div>
                  <div class="blue-dot"></div>
              </div>
          </div>`;
}

/**
 * Generates the HTML template for a given task element for the "in progress" category.
 *
 * @function
 * @param {Object} element - The task object containing details like title, description, category, category color, etc.
 * @param {number} i - The index or identifier for the task, used to generate unique IDs for DOM elements.
 * @param {string} priority - The HTML string representing the priority icon for the task.
 * @returns {string} HTML template string for the task, which includes details like category, title, description, and assigned members.
 */
function htmlTemplateInProgress(element, i, priority) {
  return `
        <div status="in progress" currentId="${i}" titel="${element["titel"]}" id="cardInProgress${i}" onclick="boardOpenPopUpTask(this.getAttribute('currentId'), this)" 
        draggable="true" ondragstart="startDragging(this.getAttribute('currentId'), this)" class="moveableCard bgWhite2 cursorPointer boxShadow border rounded-5 p-2 my-3 d-flex flex-column align-items-start">
            <div class="textWhite border rounded-3 px-3 m-2 task-headline" style="background-color:${element["categoryColor"]}">
                ${element["category"]}
            </div>
            <div class="mt-2 mx-2 bold sub-headline">
                ${element["titel"]}
            </div>
            <div class="cardText mx-2 my-1">
                ${element["description"]}
            </div>
            <div class="progress-section">
                ${htmlTemplateProgressSection(checkSubtasks(element),i,element)}
            </div>
            <div class="assignedPrioContainer d-flex justify-content-between mx-2 my-1 w-100 pe-4 align-items-center">
                <div class="assignedCardContainer d-flex textWhite" id="assignedInProgress${i}"></div>
                <div>${priority}</div>
                <div class="blue-dot"></div>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML template for a given assignment element, typically representing a member assigned to a task.
 *
 * @function
 * @param {Object} element - The task object containing an "assigned" property which is an array of member names.
 * @param {number} j - The index of the member in the "assigned" array, used to fetch the specific member.
 * @returns {string} HTML template string for the assigned member, which includes the member's initials set against a background color.
 */
function htmlTemplateAssignment(element, j) {
  return `<div class="margin-4 contact-icon d-flex justify-content-center align-items-center border rounded-circle p-2" style="background-color:${MemberColors[getColorSign(element["assigned"][j])]
    }">
              ${getInitials(element["assigned"][j])}
          </div>`;
}

/**
 * Generates and returns the HTML markup for a task that's awaiting feedback.
 *
 * @function
 * @param {Object} element - The task object.
 * @param {number} i - The index or ID of the task.
 * @param {string} priority - The priority of the task.
 * @returns {string} HTML markup for the task.
 *
 * @property {string} element.titel - The title of the task.
 * @property {string} element.categoryColor - The background color for the category label.
 * @property {string} element.category - The category name of the task.
 * @property {string} element.description - A brief description of the task.
 */
function htmlTemplateAwaitingFeedback(element, i, priority) {
  return `
    <div status="awaiting feedback" currentId="${i}" id="cardAwaitingFeedback${i}" titel="${element["titel"]
    }" onclick="boardOpenPopUpTask(this.getAttribute('currentId'), this)" draggable="true" ondragstart="startDragging(this.getAttribute('currentId'), this)" class="moveableCard bgWhite2 cursorPointer boxShadow border rounded-5 p-2 my-3 d-flex flex-column align-items-start">
        <div class="textWhite border rounded-3 px-3 m-2 task-headline" style="background-color: ${element["categoryColor"]
    }">
            ${element["category"]}
        </div>
        <div class="mt-2 mx-2 bold sub-headline">
            ${element["titel"]}
        </div>
        <div class="cardText mx-2 my-1">
              ${element["description"]}
        </div>
        <div class="progress-section">
            ${htmlTemplateProgressSection(checkSubtasks(element), i, element)}
        </div>
        <div class="assignedPrioContainer d-flex justify-content-between mx-2 my-1 w-100 pe-4 align-items-center">
            <div class="assignedCardContainer d-flex textWhite" id="assignedAwaitingFeedback${i}"></div>
            <div>${priority}</div>
            <div class="blue-dot"></div>
        </div>
    </div>
    `;
}

/**
 * Generates and returns the HTML markup for a task that's marked as "done".
 *
 * @function
 * @param {Object} element - The task object.
 * @param {number} i - The index or ID of the task.
 * @param {string} priority - The priority of the task.
 * @returns {string} HTML markup for the task.
 *
 * @property {string} element.titel - The title of the task.
 * @property {string} element.categoryColor - The background color for the category label.
 * @property {string} element.category - The category name of the task.
 * @property {string} element.description - A brief description of the task.
 */
function htmlTemplateDone(element, i, priority) {
  return `<div status="done" id="cardDone${i}" currentId="${i}" titel="${element["titel"]
    }" onclick="boardOpenPopUpTask(this.getAttribute('currentId'), this)" draggable="true" ondragstart="startDragging(this.getAttribute('currentId'), this)" class="moveableCard cursorPointer bgWhite2 boxShadow border rounded-5 p-2 my-3 d-flex flex-column align-items-start">
          <div class="textWhite border rounded-3 px-3 m-2 task-headline" style="background-color:${element["categoryColor"]
    }">
              ${element["category"]}
          </div>
          <div class="mt-2 mx-2 bold sub-headline">
              ${element["titel"]}
          </div>
          <div class="cardText mx-2 my-1">
              ${element["description"]}
          </div>
          <div class="progress-section">
            ${htmlTemplateProgressSection(checkSubtasks(element), i, element)}
        </div>
          <div class="assignedPrioContainer d-flex justify-content-between mx-2 my-1 w-100 pe-4 align-items-center">
              <div class="assignedCardContainer d-flex textWhite"  id="assignedDone${i}"></div>
              <div>${priority}</div>
              <div class="blue-dot"></div>
          </div>
      </div>`;
}

/**
 * Generating and returning the HTML markup for a task detail popup on the board.
 *
 * @function
 * @param {number} i - The index or ID of the task.
 * @param {string} priority - The priority of the task.
 * @returns {string} HTML markup for the task detail popup.
 *
 * @global
 * @requires userObj: An object containing user tasks.
 */
function htmlTemplatePopUpTask(i, priority) {
  return `<div onclick="event.stopPropagation()" class="popUpBoardTask px-4 pt-4 pb-1 rounded-4 d-flex flex-column align-items-start">
          <img onclick="boardClosePopUpTask()" class="boardTaskClose cursorPointer" src="./img/closeIt.svg" alt="close">
          <div class="boardTaskEdit d-flex">
              <img class="cursorPointer heightWidth35Px" src="./img/deleteButton.svg" alt="delete" onclick="deleteTask(${i})">
              <img class="cursorPointer heightWidth35Px" src="./img/editButton.svg" alt="edit" onclick="editTask(${i})">
          </div>
          <div style="background-color: ${userObj.tasks[i]["categoryColor"]}" class="textWhite px-3 rounded-2">${userObj.tasks[i].category}</div>
          <div class="size3Em bold font-61">${userObj.tasks[i]["titel"]}</div>
          <div class="pb-2 max-size">${userObj.tasks[i]["description"]}</div>
          <div class="pb-2 d-flex">
              <div class="pe-3 bold">Due date:</div>
              <div class="bold">${userObj.tasks[i]["date"]}</div>
          </div>
          <div class="pb-2 d-flex align-items-center">
              <div class="pe-3 bold">Priority:</div>
              <div>${priority}</div>
          </div>
          <div class="w-100">
              <div class="pb-3 bold">Assigned to:</div>
              <div id="boardTasksMembers" class="d-flex flex-column"></div>
          </div>
          <div id="boardTasksSubtasks" class="w-100"></div>
      </div>`;
}

/**  
 * Generating the HTML string for the button container containing the edit subtasks buttons.
*
* @returns {string} - The HTML string for the edit subtasks button container.
*/
function generateEditSubtasksButtonHTML() {
  return `
      <div class="generated-Btn-Container">
      <button onclick="clearInput(this); changeToSubtask()" type="button"><img src="./img/cancel_icon.png"></button>
      <svg class="btn-seperator" xmlns="http://www.w3.org/2000/svg" width="2" height="31" viewBox="0 0 2 31" fill="none">
      <path d="M1 0V31" stroke="#D1D1D1"/>
      </svg>
      <button onclick="addEditedSubtask()" type="button"><img src="./img/check_black_icon.png"></button>
      </div>`;
}


/**
 * Generating the HTML string for the input field used to edit a subtask.
 *
 * @returns {string} - The HTML string for the edit subtask input field.
 */
function generateEditSubtaskInputHTML() {
  return /*html*/ `
        <div>
            <input onkeydown="handleKeyPress(event, addEditedSubtask, changeToSubtask)" id="editedSubtaskInput" placeholder="Enter a new subtask" class="ol-none b-none">
        </div>
    `;
}

/**
 * Generating the HTML string for a subtask within a task board.
 *
 * @param {string} element3 - The subtask text content.
 * @param {number} k - The index of the subtask.
 * @returns {string} - The HTML string for the subtask.
 */
function generateBordSubtaskHTML(element3, k) {
  return `
    <div class="d-flex align-items-center mb-1 ps-3">
    <div onclick="changeToCheckbox(${k})"><img checked="false" class="subtaskCheckboxImg" id="subtask-checkbox${k}" src="./img/checkbox.png"></div>
    <div class="ms-4 bold">${element3}</div>
    </div>
    `;
}

/**
 * Generating and returns the HTML markup for the member icon in a popup.
 *
 * @param {Object} element2 - The member object.
 * @global
 * @requires MemberColors: An object mapping member names to their respective colors.
 * @requires getColorSign: A function that gets the color sign for a member.
 * @requires getInitials: A function that gets the initials of a member's name.
 * @returns {string} HTML markup for the member icon.
 */
function htmlTemplatePopUpMembers(element2) {
  return `<div class="d-flex flex-row"><div class="textWhite contact-icon d-flex justify-content-center align-items-center border rounded-circle p-2 mb-3" style="background-color:${MemberColors[getColorSign(element2)]
    }">${getInitials(
      element2
    )}</div><div class="bold boardMember-margin">${element2}</div><div>
      `;
}

/**
 * Generating the HTML string for an edit contact icon.
 *
 * @param {string} contact - The contact's name.
 * @returns {string} - The HTML string for the contact icon.
 */
function htmlTemplateEditContactIcon(contact) {
  return /*html*/ `
       <span class="textWhite contact-icon d-flex justify-content-center align-items-center rounded-circle" 
       style="background-color:${MemberColors[getColorSign(contact)]}">
       ${getInitials(contact)}
       </span>
    `;
}

/**
 * Generating the HTML string for the subtask list in the edit dialog.
 *
 * @param {Object} sub - The subtask object.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} - The HTML string for the subtask list in the edit dialog.
 */
function renderSubtaskListForEditDialog(sub, taskIndex) {
  return /*html*/ `
    <li id="listItem${taskIndex}">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="font16 w-230 ov-scroll subtask-item" id="subtask${taskIndex}">
          <div class="d-flex align-items-center">
            <svg id="subtaskCircle${taskIndex}" class="subtask-circle" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="5" fill="black" />
            </svg>
            <div id="subtask-text${taskIndex}" class="ml-15">${sub["title"]}</div>
          </div>
          <div id="subtaskButtonsContainer${taskIndex}" class="subtask-buttons">
            <svg onclick="editSubtask(${taskIndex})" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <mask id="mask0_71421_3311" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"></rect>
              </mask>
              <g mask="url(#mask0_71421_3311)">
              <path class="my-path" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"></path>
              </g>
            </svg>
            <svg class="btn-seperator" xmlns="http://www.w3.org/2000/svg" width="2" height="22" viewBox="0 0 2 31" fill="none">
            <path d="M1 0V31" stroke="#D1D1D1"></path>
            </svg>
            <svg onclick="deleteSubtask(${taskIndex})" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_71421_4770" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_71421_4770)">
                  <path class="my-path" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"></path>
                </g>
            </svg>
          </div>
        </div>
    </li>`;
}

/**
 * Generating HTML string representing a list item with subtask information.
 * 
 * @param {Object} st - The subtask object containing information to be displayed.
 * @param {number} j - The unique identifier for the subtask to be used as part of HTML element ids.
 * @returns {string} - The HTML string representing a list item with subtask information.
 */
function generateTemplateSubtasks(st, j) {
  return `
    <li id="listItem${j}">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="font16 w-230 ov-scroll subtask-item" id="subtask${j}">
          <div class="d-flex align-items-center">
            <svg id="subtaskCircle${j}" class="subtask-circle" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="5" fill="black" />
            </svg>
            <div id="subtask-text${j}" class="ml-15">${st["title"]}</div>
          </div>
          <div id="subtaskButtonsContainer${j}" class="subtask-buttons">
            <svg onclick="editSubtask(${j})" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <mask id="mask0_71421_3311" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"></rect>
              </mask>
              <g mask="url(#mask0_71421_3311)">
              <path class="my-path" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"></path>
              </g>
            </svg>
            <svg class="btn-seperator" xmlns="http://www.w3.org/2000/svg" width="2" height="22" viewBox="0 0 2 31" fill="none">
            <path d="M1 0V31" stroke="#D1D1D1"></path>
            </svg>
            <svg onclick="deleteSubtask(${j})" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_71421_4770" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_71421_4770)">
                  <path class="my-path" d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"></path>
                </g>
            </svg>
          </div>
        </div>
    </li>`;
}

/**
 * Generates the HTML template for a task based on its status.
 *
 * @param {Object} task - The task object.
 * @param {number} index - The index of the task.
 * @param {string} priority - The priority of the task.
 * @param {string} status - The status of the task.
 * @returns {string} - Returns the HTML string for the task based on its status.
 */
function htmlTemplateByStatus(task, index, priority, status) {
  switch (status) {
    case "to do":
      return htmlTemplateToDo(task, index, priority);
    case "in progress":
      return htmlTemplateInProgress(task, index, priority);
    case "awaiting feedback":
      return htmlTemplateAwaitingFeedback(task, index, priority);
    case "done":
      return htmlTemplateDone(task, index, priority);
    default:
      return "";
  }
}