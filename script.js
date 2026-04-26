let users = []
let editingId = null
let userToRemove = null


const addBtn = document.querySelector("#btn-addnew")
const formOverlay = document.getElementById('formOverlay')
const btnClose = document.querySelector('.btn-close')
const btnCancel = document.querySelector('.btn-cancel')
const tableBody = document.getElementById("tableBody")
const emptyState = document.getElementById('emptyState')
const tableWrap = document.getElementById('table-wrap')
const userCount = document.getElementById('userCount')
const firstNameInp= document.getElementById('firstName')
const lastNameInp = document.getElementById('lastName')
const emailInput = document.getElementById('email')
const mobileInput = document.getElementById('mobile')
const modalEyebrow = document.getElementById('modalEyebrow')
const modalTitle = document.getElementById('modalTitle')
const btnSubmit = document.getElementById('btnSubmit')
const userForm = document.getElementById('userForm')
const firstNameErr = document.getElementById('firstNameErr')
const lastNameErr = document.getElementById('lastNameErr')
const emailErr = document.getElementById('emailerr')
const mobileErr = document.getElementById('mobileErr')
const confirmOverlay = document.getElementById('confirmOverlay')
const btnConfirmCancel = document.getElementById('btnConfirmCancel')
const btnConfirmRemove = document.getElementById('btnConfirmRemove')


function generateUserId() {
  const id = Date.now().toString(36);
  return id;
}

function addUser() {
  console.log(firstNameInp.value)
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
  if(lastName==""){
    lastNameErr.textContent= "Last name is required";
    lastNameInp.classList.add("is-error")
    isValid = false
  }
  else if (/\d/.test(lastName)) {
    lastNameErr.textContent="Last name cannot contain numbers";
    lastNameInp.classList.add("is-error")
    isValid = false
  }
  if(email ==""){
    emailErr.textContent="Email is required";
    emailInput.classList.add("is-error")
    isValid = false
  }
  else if(!emailRegex.test(email)){
    emailErr.textContent="Please enter a valid email";
    emailInput.classList.add("is-error")
    isValid = false
  }
  if(mobile==""){
    mobileErr.textContent = "Mobile number is required"
    mobileInput.classList.add("is-error")
    isValid = false
  }
  else if (!mobileRegex.test(mobile)){
    mobileErr.textContent = "Enter a valid 10-digit number"
    mobileInput.classList.add("is-error")
    isValid = false
  }
  return isValid
}

function clearErrors(){
      firstNameErr.textContent=""
      lastNameErr.textContent=""
      emailErr.textContent=""
      mobileErr.textContent=""
      firstNameInp.classList.remove("is-error")
      lastNameInp.classList.remove("is-error")
      emailInput.classList.remove("is-error")
      mobileInput.classList.remove("is-error")
}
function renderUsers() {
  tableBody.innerHTML=""
  if (users.length == 0){
    emptyState.style.display="block"
    tableWrap.classList.remove("is-visible")
    userCount.textContent = "0 users"
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



function openFormModal() {
  editingId = null
  modalEyebrow.textContent = "New Record";
  modalTitle.textContent = "Add User"
  btnSubmit.textContent = "Save User"
  userForm.reset()
  formOverlay.classList.add('is-open');

}

function openConfirmModal(id) {
  userToRemove = id
  confirmOverlay.classList.add('is-open')

}

function closeFormModal(){
  editingId = null
  addBtn.focus()
  clearErrors()
  userForm.reset()
  formOverlay.classList.remove('is-open');
}

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
function closeConfirmModal() {
  confirmOverlay.classList.remove("is-open")
  userToRemove = null
}

function removeUser(){
  users = users.filter(user => user.id !== userToRemove)
  closeConfirmModal()
  renderUsers()
}

function UpdateCount() {
  userCount.textContent = `${users.length} users`
  return
}

addBtn.addEventListener("click",openFormModal)
btnClose.addEventListener("click",closeFormModal)
btnCancel.addEventListener("click",closeFormModal)
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

btnConfirmCancel.addEventListener("click", closeConfirmModal)
btnConfirmRemove.addEventListener("click",removeUser)

document.addEventListener("keydown",(e)=> {
  if(e.key !=="Escape") return
  closeFormModal()
  closeConfirmModal()
})


