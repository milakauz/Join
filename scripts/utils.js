/**
 * Displays a top-down message on the screen with a fade-in and fade-out effect.
 *
 * @param {string} message - The message to be displayed in the popup.
 */
function showTopDown(message) {
  const popup = document.createElement("div");
  popup.id = "topdownMessages";
  document.body.appendChild(popup);
  Object.assign(popup.style, {
    padding: "10px",
    backgroundColor: "#2a3647",
    color: "white",
    width: "30%",
    borderRadius: "10px",
    textAlign: "center",
    position: "absolute",
    left: "35%",
    top: "100px",
    opacity: "0",
    zindex: "2000",
  });

  popup.innerHTML = message;

  let startTime;

  function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;

    if (elapsed < 1000) {
      popup.style.opacity = (elapsed / 1000) * 1;
    } else if (elapsed < 4000) {
      popup.style.opacity = 1;
    } else {
      popup.style.opacity = 1 - (elapsed - 4000) / 1000;
      if (elapsed > 5000) {
        popup.remove();
        return;
      }
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/**
 * Rendeing the top logo with the initials of the user's name.
 *
 * @param {Object} userObj - The user object containing the user's details.
 * @returns {string} - Returns the initials of the user's name.
 */
function renderTopLogo(userObj) {
  setTimeout(() => {
    let initials = capitalizeFirstLetterOfEveryWord(getInitials(userObj.name));
    document.getElementById("logo-text-initials").innerText = initials;
    return initials;
  }, 10);
}

/**
 * Capitalizing the first letter of every word in the given string.
 *
 * @param {string} input - The string to be transformed.
 * @returns {string} - Returns the transformed string with capitalized first letters.
 */
function capitalizeFirstLetterOfEveryWord(input) {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Hashing a given password using SHA-256.
 * 
 * @async
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} - The hashed password as a hexadecimal string.
 */
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashedPassword;
}

/**
 * Extracting the first character from the last word of a given name.
 * 
 * @param {string} name - The name from which to extract the sign.
 * @returns {string} The extracted sign character.
 */
function getColorSign(name) {
  const colorSign = name.split(" ").pop().charAt(0).toUpperCase();
  return colorSign;
}

/**
 * Redirecting the browser to a given URL and clears the status from local storage.
 * 
 * @param {string} url - The URL to which to redirect.
 */
function redirect(url) {
  spliceStatusLocalStorage();
  window.location.href = url;
}

/**
 * Event listener for the window's 'load' event.
 * If the page was reloaded, the status is removed from local storage using the
 * modern PerformanceNavigationTiming interface.
 */
window.addEventListener("load", function () {
  let navigationEntries = performance.getEntriesByType("navigation");
  if (navigationEntries.length > 0 && navigationEntries[0].type === "reload") {
    spliceStatusLocalStorage();
  }
});

/** @type {Object} colors*/
let MemberColors = {
  A: "rgba(104, 166, 148, 1)", // Light Pinkconst
  B: "rgba(166, 145, 104, 1)", // Gold
  C: "rgba(104, 120, 166, 1)", // Blue
  D: "rgba(222, 111, 13, 1)", // Light Brown
  E: "rgba(140, 166, 104, 1)", // Olive Green
  F: "rgba(140, 104, 166, 1)", // Purple
  G: "rgba(130, 166, 104, 1)", // Green
  H: "rgba(166, 113, 104, 1)", // Salmon
  I: "rgba(166, 158, 104, 1)", // Pale Yellow
  J: "rgba(148, 104, 166, 1)", // Lavender
  K: "rgba(104, 166, 132, 1)", // Mint Green
  L: "rgba(166, 105, 123, 1)", // Reddish Pink
  M: "rgba(166, 133, 104, 1)", // Peach
  N: "rgba(104, 135, 166, 1)", // Dark Blue
  O: "rgba(166, 123, 104, 1)", // Burnt Orange
  P: "rgba(104, 161, 166, 1)", // Light Blue
  Q: "rgba(166, 104, 154, 1)", // Magenta
  R: "rgba(255, 166, 104, 1)", // Orange
  S: "rgba(115, 115, 166, 1)", // Dark Purple
  T: "rgba(104, 166, 166, 1)", // Türkis
  U: "rgba(166, 166, 104, 1)", // Yellow
  V: "rgba(104, 113, 166, 1)", // Dark Blue
  W: "rgba(104, 160, 166, 1)", // Aqua
  X: "rgba(166, 115, 115, 1)", // Dark Salmon
  Y: "rgba(166, 140, 104, 1)", // Light Brown
  Z: "rgba(166, 115, 115, 1)", // Dark Salmon
  Ä:  "rgba(139, 69, 19, 1)", // Saddle Brown
  Ö: " rgba(255, 140, 0, 1)", // Dark Orange
  Ü: " rgba(34, 139, 34, 1)" // Forest Green
};

/**
 * Handles key press events and invokes provided functions based on the key pressed.
 *
 * @param {Event} event - The key press event object.
 * @param {Function} f1 - The function to be invoked when the 'Enter' key is pressed.
 * @param {Function} f2 - The function to be invoked when the 'Escape' key is pressed.
 */
function handleKeyPress(event, f1, f2) {
  if (event.key === "Enter") {
    f1();
    event.preventDefault();
  } else if (event.key === "Escape") {
    f2();
    event.target.value = "";
  }
}

/**
 * Renders tasks based on the search term and their status.
 *
 * @param {string} search - The search term to filter tasks by.
 * @param {string} status - The status of the tasks to be rendered.
 * @param {string} containerId - The ID of the container where the tasks should be rendered.
 * @param {string} assignmentIdPrefix - The prefix of the ID for the assignment container.
 */
function renderSearchTasksByStatus(search, status, containerId, assignmentIdPrefix) {
  const filteredTasks = userObj.tasks.filter((t) => t["status"] === status);
  document.getElementById(containerId).innerHTML = "";
  for (let i = 0; i < filteredTasks.length; i++) {
    let title = filteredTasks[i].titel;
    let description = filteredTasks[i].description;
    if (
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    ) {
      const element = filteredTasks[i];
      document.getElementById(containerId).innerHTML += htmlTemplateByStatus(
        element,
        i,
        getPriority(element),
        status
      );
      let idAssigned = document.getElementById(`${assignmentIdPrefix}${i}`);
      idAssigned.innerHTML = element["assigned"]
        .map((_, j) => htmlTemplateAssignment(element, j))
        .join("");
    }
  }
}

/**
 * Initiates the task search based on the input from the "boardInput" element and renders
 * the search results.
 */
function searchTask() {
  let search = document.getElementById("boardInput").value;
  search = search.toLowerCase();
  renderSearchTasksByStatus(search, "to do", "todo", "assignedToDo");
  renderSearchTasksByStatus(
    search,
    "in progress",
    "inProgress",
    "assignedInProgress"
  );
  renderSearchTasksByStatus(
    search,
    "awaiting feedback",
    "awaitingFeedback",
    "assignedAwaitingFeedback"
  );
  renderSearchTasksByStatus(search, "done", "done", "assignedDone");
  checkIfDropAreaEmpty();
}

/**
 * Changes the visual representation of a subtask to a checkbox and updates the userObj.
 *
 * @async
 * @param {number} k - The index of the subtask.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function changeToCheckbox(k) {
  const checkbox = document.getElementById(`subtask-checkbox${k}`);
  const index = userObj.tasks.findIndex(
    (task) => task.status === currentStatus && task.titel === currentTitel
  );
  if (checkbox.getAttribute("src") === "./img/checkbox.png") {
    checkbox.src = "./img/checkbox_checked.png";
    toggleSubtaskProperty(checkbox, "checked", index);
  } else if (checkbox.getAttribute("src") === "./img/checkbox_checked.png") {
    checkbox.src = "./img/checkbox.png";
    toggleSubtaskProperty(checkbox, "unchecked", index);
  }
  await setItem(userObj.email, JSON.stringify(userObj));
}