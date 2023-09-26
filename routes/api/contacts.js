const express = require("express");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = [await listContacts()];
  res.status(200).send({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  // Params to są te po ukośniku w URI, np. http://adres:port/nazwa/funkcji/12345 - gdzie 12345 to contactId
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact) {
    res.status(200).send({ contact });
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  // Bez Joi musielibyśmy walidować w ten, a być może nawet bardziej skomplikowany sposób
  // if (!req.body.name || !req.body.email || !req.body.field) {
  //   res.status(400).json({ message: "missing required name - field" });
  // }

  // Z Joi:
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json({ message: "missing required name - field" });
  } else {
    // req.body zawiera dane, które są przekazywane jako body requestu typu POST lub innych typów - odpowiednik parametrów po znaku zapytania (query) albo po ukośniku (params)
    // tylko pozwalają wprowadzić dużo więcej danych w różnym formacie
    const newContact = await addContact(req.body);
    res.status(201).json(newContact); // TODO: dodac wygenerowany obiekt kontaktu
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const isContactRemoved = await removeContact(req.params.contactId);
  if (isContactRemoved) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    res.status(400).json({ message: "missing fields" });
  } else {
    const contact = await updateContact(req.params.contactId, req.body);
    if (contact) {
      res.status(200).send({ contact });
    } else {
      res.status(404).send({ message: "Not found" });
    }
  }
});

module.exports = router;
