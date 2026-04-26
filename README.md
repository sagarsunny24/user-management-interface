# User Management Interface
A responsive user management interface built with vanilla HTML, CSS and JavaScript

# Documentation of JavaScript code

## Defining global scope variables

```js
let users = []
let editingId = null
let userToRemove = null
```
users - an array of objects - each object an user
editingId - to know which record was chosen for editing
userToRemove - to hold id of user to remove

## Element Selectors for HTML
.
.
.
.

## Function to generate unique userId per user(tied to millisecondtime)

```js
function generateUserId() {
  const id = Date.now().toString(36);
  return id;
}
```

## Function to add user into the users array - pushes, calls renderUser(), closes the form modal

```js
function addUser() {
  const user = {
    id: generateUserId(),
    firstName: firstNameInp.value.trim(),
    lastName: lastNameInp.value.trim(),
    email: emailInput.value.trim(),
    mobile: mobileInput.value.trim()
  }
  users.push(user)
  renderUsers()
  closeFormModal()
}
```

## Function that validates the user inputs, has both empty checks and regEx checks for names, email, mobile
Browser validation is turned off with `novalidate` in form tag, and I manually did validation using JS

```js
function validateForm(){
  clearErrors()
  const firstName = firstNameInp.value.trim()
  const lastName = lastNameInp.value.trim()
  const email = emailInput.value.trim()
  const mobile = mobileInput.value.trim()
  let isValid = true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  if(firstName == ""){
    firstNameErr.textContent="First name is required";
    firstNameInp.classList.add("is-error")
    isValid = false
  }
  else if ( /\d/.test(firstName)) {
    firstNameErr.textContent= "First name cannot contain numbers";
    firstNameInp.classList.add("is-error")
    isValid = false
  }
.
.
.
.
```

## Function that is used for clearing the errors after wrongful validation

```js
function clearErrors()
```

## Function that renders the table and its body - most important
It checks the users array, displays empty if it has no elements
If non-empty - it maps each object in the array to an innerHTML with data inserted into it, calls `UpdateCount()` to update the number of users in the top right corner
It also adds the user.id (unique Id) into the buttons dataset `data-id`
```js
function renderUsers() {
  tableBody.innerHTML=""
  if (users.length == 0){
    emptyState.style.display="block"
    tableWrap.classList.remove("is-visible")
    UpdateCount()
    return
  }

  emptyState.style.display = "none"
  tableWrap.classList.add('is-visible')
  userCount.textContent= users.length + " users"

  tableBody.innerHTML = users.map(user => `
    <tr>
      <td> ${user.firstName} ${user.lastName}</td>
      <td> ${user.email}</td>
      <td>${user.mobile}</td>
      <td class="td-actions">
        <button class="btn-edit" data-id="${user.id}">Edit</button>
        <button class="btn-remove" data-id="${user.id}">Remove</button>
      </td>
    </tr>`).join("");
  UpdateCount()
}
```

## Functions that open and close the modals for Form and Confirm Remove, also adds the overlay

```js
function openFormModal()
function openConfirmModal()
function closeConfirmModal()
function closeFormModal()
```
## Function when we press the Edit button for a record

First checks if there is user of specific id is present, then , populates the field with values from the user object of users array
This function is called via event delegation done to the Edit button in the table, if the edit button is pressed it does 2 things - sets the editingId = id - which is later used to check when the form is submitted - if editingId is null - it is new user, if not null it is updating record of a user

```js
function openEditModal(id){
  const user = users.find(function(u) { return u.id === id})
  if(!user) return
  editingId = id
  modalEyebrow.textContent= "Edit Record"
  modalTitle.textContent = "Edit User"
  btnSubmit.textContent = "Update User"
  firstNameInp.value = user.firstName
  lastNameInp.value = user.lastName
  emailInput.value = user.email
  mobileInput.value = user.mobile
  clearErrors()
  formOverlay.classList.add('is-open')
  firstNameInp.focus()
}
```

## Function that updates the users array 
After updating calls the `renderUsers()` to reflect the change

```js
function updateUser(){
  for(let i = 0;i <users.length; i++){
    if(users[i].id === editingId) {
      users[i].firstName = firstNameInp.value.trim()
      users[i].lastName = lastNameInp.value.trim()
      users[i].email = emailInput.value.trim()
      users[i].mobile = mobileInput.value.trim()
      break
    }
  }
  renderUsers()
  closeFormModal()
}
```

## Function that removes the user from the users array
This removes the user and again calls `renderUsers()` to reflect the change

```js
function removeUser(){
  users = users.filter(user => user.id !== userToRemove)
  closeConfirmModal()
  renderUsers()
}
```

## Function that updates the user count on the right corner

```js
function UpdateCount() {
  userCount.textContent = `${users.length} users`
  return
}
```

# EVENT LISTENERS

These listen for the buttons Add User, Close X, Cancel button, Remove button

```js
btnConfirmCancel.addEventListener("click", closeConfirmModal)
btnConfirmRemove.addEventListener("click",removeUser)
addBtn.addEventListener("click",openFormModal)
btnClose.addEventListener("click",closeFormModal)
btnCancel.addEventListener("click",closeFormModal)
```
## User Form listener
1. it prevents browser from defaulting
2. validates the form, for both editing and new users
3. if it was called after the `function openEditModal(id)` was called meanining the `Edit` button was pressed - then the `editingId` variable will have a unique ID, and calls the `updateUser()` function
4. Else calls the `addUser()` function

```js
userForm.addEventListener("submit",function(e){
  e.preventDefault()
  if (!validateForm()) return
  if(editingId) {
    updateUser()
  }
  else {
    addUser()
  }
})
```

## Table body listener
when clicking on Edit or Remove button, effectively event is delegated to the table body.
1. Collects the associated user.id previously stored in the DOM for the buttons - This id is used for knowing which record to Edit or Remove
2. Accordingly function is called

```js
tableBody.addEventListener("click", function(e) {
  const id = e.target.dataset.id;
  console.log(id)
  if(e.target.classList.contains("btn-edit")){
    openEditModal(id)
  }
  if(e.target.classList.contains("btn-remove")){
    openConfirmModal(id)
  }
})
```

## Listener for escape key which closes modals
```js
document.addEventListener("keydown",(e)=> {
  if(e.key !=="Escape") return
  closeFormModal()
  closeConfirmModal()
})
```
