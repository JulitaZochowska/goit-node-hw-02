const fs = require("fs");
const { nanoid } = require("nanoid");
const path = require("path");

// tworzymy ścieżkę do pliku z danymi
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = fs.readFileSync(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = fs.readFileSync(contactsPath);
  const allContacts = JSON.parse(data);
  const selectedContact = allContacts.find(
    (contact) => contact.id === contactId
  );
  return selectedContact;
};

const removeContact = async (contactId) => {
  const data = fs.readFileSync(contactsPath);
  const allContacts = JSON.parse(data);

  const foundContact = allContacts.find((contact) => contact.id === contactId); // Znaleziony kontakt do usunięcia
  if (!foundContact) {
    // Jeżeli nie ma kontaktu, zwracam false i oczywiście przerywamy działanie funkcji
    return false;
  }

  // Filtrujemy obecną listę kontaktów BEZ znalezionego kontaktu - otrzymujemy listę tak jakby z usuniętym kontaktem
  const newContactsList = allContacts.filter(
    (contact) => contact.id !== foundContact.id
  );
  fs.writeFileSync(contactsPath, JSON.stringify(newContactsList));
  return true;
};

const addContact = async (body) => {
  const data = fs.readFileSync(contactsPath);
  const allContacts = JSON.parse(data);

  // body zawiera name, email i phone, więc wystarczy dodać do obiektu id aby utworzyć nowy kontakt
  const newContact = { id: nanoid(), ...body };
  allContacts.push(newContact);

  fs.writeFileSync(contactsPath, JSON.stringify(allContacts));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = fs.readFileSync(contactsPath);
  const allContacts = JSON.parse(data);

  const foundContactIndex = allContacts.findIndex(
    (contact) => contact.id === contactId
  ); // Znaleziony kontakt do usunięcia

  if (foundContactIndex === -1) {
    // Jeżeli nie ma kontaktu (funkcja findIndex zwraca -1), zwracam false i oczywiście przerywamy działanie funkcji
    return false;
  }

  // Na podstawie pozyskanego wcześniej indeksu w tablicy, modyfikujemy kontakt
  allContacts[foundContactIndex].name = body.name;
  allContacts[foundContactIndex].email = body.email;
  allContacts[foundContactIndex].phone = body.phone;

  fs.writeFileSync(contactsPath, JSON.stringify(allContacts));
  return allContacts[foundContactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
