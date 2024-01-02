//Only for showing some data in the project to be tested.
const DEFAULT_TASKS = [
  {
    titel: "HTML Template",
    description: "Create basic HTML template to show tasks.",
    status: "to do",
    category: "Develop ",
    categoryColor: "#ffea00",
    assigned: [],
    date: "2024-08-25",
    prio: "medium",
    subtasks: [
      { title: "Create file", property: "unchecked" },
      { title: "Add template function", property: "unchecked" },
    ],
    id: 0,
  },
  {
    titel: "Publish App",
    description: "Publish our App on the Web",
    status: "in progress",
    category: "Sales ",
    categoryColor: "#FC71FF",
    assigned: ["Laura Miller"],
    date: "2024-09-09",
    prio: "low",
    subtasks: [],
    id: 1,
  },
];

const DEFAULT_CONTACTS = [
  {
    name: "Laura Miller",
    email: "laura-miller@protonmail.com",
    number: "0178654825",
  },
  {
    name: "Peter Lustig",
    email: "peter-lustig@gmail.com",
    number: "0179554321",
  },
];

const DEFAULT_CATEGORIES = [
  {
    name: "Sales",
    color: "#FC71FF",
  },
  {
    name: "Backoffice",
    color: "#38EAFF",
  },
  {
    name: "Design",
    color: "#FFC701",
  },
];

//Globals
let users = [];
let loginForm = document.getElementById("loginForm");
let loginBox = document.querySelector(".login-box");

/**
 * Clears the content of the login box and displays the 'Forgot Password' template.
 */
function forgotMyPassword() {
  let loginBox = document.querySelector(".login-box");
  loginBox.innerHTML = "";
  loginBox.innerHTML = templateForgotPassword();
}

/**
 * Clears the content of the login box and displays the login template.
 */
function showLogin() {
  loginBox.innerHTML = "";
  loginBox.innerHTML = templateLogin();
}

/**
 * Clears the content of the login box and displays the signup template.
 */
function showSignup() {
  loginBox.innerHTML = "";
  loginBox.innerHTML = templateSignUp();
}

/**
 * Initializes the application by loading users and checking if a user is logged in.
 */
async function init() {
  loadUsers();
  checkIfUserIsLoggedIn();
}

/**
 * Loads users from storage.
 */
async function loadUsers() {
  try {
    users = await getItem("users");
  } catch (e) {
    console.info("No users found.");
  }
}

// /**
//  * Checks if the confirmed password matches the original password.
//  * @param {string} password - The original password.
//  * @param {string} confirmedPassword - The confirmed password to check against.
//  * @returns {boolean} Returns true if the passwords match, otherwise false.
//  */
// function confirmPasswordIsSame(password, confirmedPassword) {
//   if (password == confirmedPassword) {
//     return true;
//   } else {
//     return false;
//   }
// }


/**
 * Registers a new user by checking the user's input and adding them to the system.
 * @async
 * @returns {Promise<void>}
 */
async function registerUser() {
  const elements = getFormElements();
  if (checkIfUserExists(elements.email.value))
    return handleExistingUser(elements.signupBtn);

  const passwordsMatch = await handlePasswordMatch(elements);
  if (!passwordsMatch) return handlePasswordMismatch(elements.signupBtn);
  let hashedPassword = await hashPassword(elements.password.value);
  await finalizeRegistration(elements);
}

/**
 * Retrieves form elements used in the registration process.
 * @returns {Object} - Contains references to HTML elements.
 */
function getFormElements() {
  return {
    signupBtn: document.getElementById("signupBtn"),
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
  };
}

/**
 * Handles scenarios when a user already exists.
 * @returns {number} - Returns 0 to indicate early exit from the function.
 */
function handleExistingUser(signupBtn) {
  showLogin();
  showTopDown("This User exists, please log in!");
  return 0;
}

/**
 * Handling the password matching logic and user creation process.
 * 
 * @async
 * @param {Object} elements - Object containing the user input elements.
 * @returns {boolean} - True if the passwords match or the user is created, false otherwise.
 */
async function handlePasswordMatch(elements) {
  if (!passwordsMatch(elements.password.value, elements.confirmPassword.value)) {
    return false
  }
  let hashedPwd = await hashPassword(elements.password.value);
  await createUserAndStore(elements.name.value, elements.email.value, hashedPwd);
  return true;
}


/**
 * Checking if the given password and the confirmation password are matching.
 *
 * @param {*} password - The password given by the user.
 * @param {*} confirmPassword - The password of confirmation.
 * @returns {boolean} - True if the passwords match - false otherwise.
 */
function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

/**
 * Handles scenarios when the passwords do not match.
 * @param {HTMLElement} signupBtn - The button element used for signing up.
 * @returns {number} - Returns 0 to indicate early exit from the function.
 */
function handlePasswordMismatch(signupBtn) {
  showTopDown("Your passwords are not similar!");

  signupBtn.disabled = false;
  return 0;
}

/**
 * Finalizes the registration process, resets the form, and shows a success message.
 * @async
 * @param {Object} elements - The form elements.
 * @returns {Promise<void>}
 */
async function finalizeRegistration(elements) {
  ["name", "email", "password", "confirmPassword"].forEach((el) =>
    resetForm(elements[el])
  );
  elements.signupBtn.disabled = false;
  showLogin();
  showTopDown("You are registered!");
}


/**
 * Creating a new user and storing it in the database.
 *
 * @async
 * @param {*} name - The name of the user.
 * @param {*} email - The email of the user.
 * @param {*} hashedPwd - The hashed password of the user.
 * @returns {*}
 */
async function createUserAndStore(name, email, hashedPwd) {
  const user = {
    name: name,
    email: email,
    password: hashedPwd,
  };
  users.push(user);
  await setItem("users", JSON.stringify(users));
  await createUserObject(name, email, hashedPwd);
}


/**
 * Checking if a user with the given email already exists in database.
 *
 * @param {*} email - The email to check for.
 * @returns {boolean} - True if the user exists - false otherwise. 
 */
function checkIfUserExists(email) {
  return users.some((user) => user.email === email);
}

/**
 * Resetting the value of the given input field.
 *
 * @param {HTMLInputElement} input - The input field to be reset.
 */
function resetForm(input) {
  input.value = "";
}


/**
 * Retrieving user input from login form.
 *
 * @returns {Object} - Object containing email, password and checkbox-status.
 */
function getLoginFormInput() {
  const input = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    remember: document.getElementById("remember").checked,
  };
  return input;
}

/**
 * Handling the login process, after validating the credentials.
 * 
 * @async
 * @returns {Promise<void>}
 */
async function login() {
  document.getElementById("loginForm").classList.add("was-validated");
  const formInput = getLoginFormInput();
  const user = findUserByEmail(formInput.email);
  const isValidLogin = await validateLogin(user, formInput.password);
  if (!isValidLogin) {
    document
      .getElementById("passwordContainer")
      .classList.add("wrong-password");
    showTopDown("Your email or password is wrong!");
    document.querySelector(".error-message").classList.remove("d-none");
    return;
  }
  localStorage.setItem("activeUser", formInput.email);
  window.location.href = "summary.html";
}

/**
 * Retrieves login form input values.
 * @returns {Object} - Contains values of the login form fields.
 */
function getLoginFormInput() {
  return {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    remember: document.getElementById("remember").checked,
  };
}

/**
 * Finds a user in the system by email.
 * @param {string} email - The email to search for.
 * @returns {(Object|null)} - Returns the user object if found, null otherwise.
 */
function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

/**
 * Validates the login credentials against stored users.
 * @async
 * @param {Object|null} user - The user object.
 * @param {string} password - The plain text password to validate.
 * @returns {Promise<boolean>} - True if the login credentials are valid, false otherwise.
 */
async function validateLogin(user, password) {
  if (!user) return false;

  const hashPwd = await hashPassword(password);
  return user.password === hashPwd;
}


/**
 * Creating a user object with the provided information and save it to the database.
 *
 * @async
 * @param {*} username - The given username.
 * @param {*} email - The user's email address.
 * @param {*} hashedPassword - The user's hashed password. 
 */
async function createUserObject(username, email, hashedPassword) {
  const userObj = createUser(username, email, hashedPassword);
  await setItem(email, JSON.stringify(userObj));
}


/**
 * Creating a user object with default tasks, contacts and categories.
 * @date 10/19/2023 - 11:20:47 AM
 *
 * @param {*} username - The user's username.
 * @param {*} email - The user's email address.
 * @param {*} hashedPassword - The user's hashed password. 
 * @returns {Object} - The user's object with default values and provided user information.
 */
function createUser(username, email, hashedPassword) {
  return {
    name: capitalizeFirstLetterOfEveryWord(username),
    email: email,
    password: hashedPassword,
    tasks: DEFAULT_TASKS,
    contacts: DEFAULT_CONTACTS,
    categorys: DEFAULT_CATEGORIES,
  };
}

/**
 * Checks if a user object exists based on the email.
 * @async
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - True if the user object exists, false otherwise.
 */
async function checkIfUserObjectExists(email) {
  try {
    await getItem(email);
    return true;
  } catch (e) {
    console.info("User does not exist!");
    return false;
  }
}

/**
 * Saves the current user's data in local storage for quick access.
 * @param {Object} user - The user object to be saved.
 */
function saveRememberMe(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

/**
 * Checks if a user is logged in by inspecting local storage.
 * Redirects to a summary page if a user is found.
 */
function checkIfUserIsLoggedIn() {
  const user = localStorage.getItem("activeUser");
  if (user) {
    window.location.href = "summary.html";
  } else {
    return;
  }
}

/**
 * Logs in a guest user and redirects to a summary page.
 * @async
 */
async function guestLogin() {
  localStorage.setItem("activeUser", "guest@test.de");
  window.location.href = "summary.html";
}

/**
 * Handles the submission of the forgot password form.
 * Sends a password reset email if the user exists or prompts the user to sign up if not.
 * @param {Event} e - The form submit event.
 */
function sendPasswordMail(e) {
  e.preventDefault();
      
  const emailInput = document.getElementById("forgotPasswordInput");
  const userEmail = emailInput.value;

  if (checkIfUserExists(userEmail)) {
    showTopDown("We send you an email!");
  } else {
    showTopDown("Please Sign Up! You're E-Mail Address was not found.");
  }
  showLogin();
}

function updateBorderColor() {
  const container = this.parentElement;
  const borderColor = this.validity.valid ? "rgba(0, 0, 0, 0.2)" : "red";
  container.style.borderColor = borderColor;
}
