const contactsBase = document.getElementById('contactsMain');
const dialogContactBase = document.getElementById('dialogContact');
const editDialogContactBase = document.getElementById('dialog__editContact');
const dialogBackgroundTask = document.querySelector('.background-dialog');
const createDialogElementsTask = {
    createDialog: document.getElementById('dialog__createContact'),
    closeDialog: document.getElementById('dialog__createClose'),
    inputName: document.getElementById('dialog__createNameInput'),
    inputEmail: document.getElementById('dialog__createEmailInput'),
    inputPhone: document.getElementById('dialog__createPhoneInput'),
};


/**
 * Opening the dialog window for creating contact.
 */
function openCreateContact() {
    window.scrollTo(0, 0);
    createDialogElementsTask.createDialog.classList.remove('resp-none');
    createDialogElementsTask.createDialog.classList.add('show-edit-dialog');
    dialogBackgroundTask.classList.remove('d-none');
}

/**
 * Closing the dialog window of creating contact.
 */
function cancelCreateContact() {
    createDialogElementsTask.createDialog.classList.add('resp-none');
    createDialogElementsTask.createDialog.classList.remove('show-edit-dialog');
    dialogBackgroundTask.classList.add('d-none');
}

/**
 * Adding a new contact to the user's contact list.
 * @param {Event} e - The event object from the form submission.
 */
function addNewContact(e) {
    e.preventDefault();
    let inputName = createDialogElementsTask.inputName.value.trim();
    inputName = capitalizeFirstLetterOfEveryWord(inputName);
    dialogBackgroundTask.classList.add('d-none');
    cancelCreateContact();
    showTopDown('Contact created!');
    userObj.contacts.push({
        name: inputName,
        email: createDialogElementsTask.inputEmail.value.trim(),
        number: createDialogElementsTask.inputPhone.value.trim(),
    });
    setItem(userObj.email, JSON.stringify(userObj));
    document.getElementById('createContactForm').reset();
    renderContacts();
}

/**
 * Capitalizing the first letter of every word in the input string.
 * @param {string} input - The input string to capitalize.
 * @returns {string} The input string with first letters of each word capitalized.
 */
function capitalizeFirstLetterOfEveryWord(input) {
    return input
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}