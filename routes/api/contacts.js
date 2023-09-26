const express = require("express");
const { listContacts } = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = listContacts();
  res.status(200).send({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contacts = getContactById();
  res.status(200).send({ contact });
  res.status(404).send({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
