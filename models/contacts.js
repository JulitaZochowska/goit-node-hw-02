// const fs = require('fs/promises')
let contacts = [];

const listContacts = async () => {
  return contacts;
};

const getContactById = async (contactId) => {
  return contacts.find((contact) => contact.id === id);
};

const removeContact = async (contactId) => {
  contacts = contacts.filter((contact) => contact.id !== id);
};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
