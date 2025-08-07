const groups = [
  { id: 1, name: "Family" },
  { id: 2, name: "Friends" },
  { id: 3, name: "Work" },
];

let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let editingIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
  populateGroupOptions();
  displayContacts();

  document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancelEdit').addEventListener('click', cancelEdit);
  document.getElementById('searchInput').addEventListener('input', displayContacts);
});

function populateGroupOptions() {
  const groupSelect = document.getElementById('groupId');
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group.id;
    option.textContent = group.name;
    groupSelect.appendChild(option);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const contact = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    address: document.getElementById('address').value.trim(),
    groupId: parseInt(document.getElementById('groupId').value),
  };

  if (editingIndex === -1) {
    contacts.push(contact);
  } else {
    contacts[editingIndex] = contact;
    editingIndex = -1;
    document.getElementById('submitBtn').textContent = "Add Contact";
    document.getElementById('cancelEdit').style.display = "none";
  }

  localStorage.setItem('contacts', JSON.stringify(contacts));
  document.getElementById('contactForm').reset();
  displayContacts();
}

function displayContacts() {
  const tbody = document.querySelector('#contactTable tbody');
  const search = document.getElementById('searchInput').value.toLowerCase();
  tbody.innerHTML = '';

  contacts
    .filter(c =>
      c.firstName.toLowerCase().includes(search) ||
      c.lastName.toLowerCase().includes(search) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search)
    )
    .forEach((contact, index) => {
      const group = groups.find(g => g.id === contact.groupId);
      const groupName = group ? group.name : "N/A";

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${contact.firstName}</td>
        <td>${contact.lastName}</td>
        <td>${contact.phone}</td>
        <td>${contact.email}</td>
        <td>${contact.address}</td>
        <td>${groupName}</td>
        <td>
          <button onclick="editContact(${index})">Edit</button>
          <button onclick="deleteContact(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
}

function deleteContact(index) {
  if (confirm("Are you sure you want to delete this contact?")) {
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
  }
}

function editContact(index) {
  const contact = contacts[index];
  document.getElementById('firstName').value = contact.firstName;
  document.getElementById('lastName').value = contact.lastName;
  document.getElementById('phone').value = contact.phone;
  document.getElementById('email').value = contact.email;
  document.getElementById('address').value = contact.address;
  document.getElementById('groupId').value = contact.groupId;

  editingIndex = index;
  document.getElementById('submitBtn').textContent = "Update Contact";
  document.getElementById('cancelEdit').style.display = "inline-block";
}

function cancelEdit() {
  editingIndex = -1;
  document.getElementById('contactForm').reset();
  document.getElementById('submitBtn').textContent = "Add Contact";
  document.getElementById('cancelEdit').style.display = "none";
}
