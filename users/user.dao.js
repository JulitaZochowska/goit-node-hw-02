const User = require("./user.model");
const { v4: uuid } = require("uuid");

class DuplicatedEmailError extends Error {
  constructor() {
    super("Email in use");
  }
}

class UnknownDatabaseError extends Error {
  constructor() {
    super("Oops, something went wrong at database layer.");
  }
}

const createUser = async (userData) => {
  try {
    return await User.create({ ...userData, verificationToken: uuid() });
  } catch (e) {
    console.error(e);

    if (e.code === 11000) {
      const [[key, value]] = Object.entries(e.keyValue);
      throw new DuplicatedEmailError(key, value);
    }

    throw new UnknownDatabaseError();
  }
};

const getUser = async (filter) => {
  try {
    return await User.findOne(filter);
  } catch (e) {
    console.error(e);
    throw new UnknownDatabaseError();
  }
};

const updateUser = async (email, userData) => {
  try {
    return await User.findOneAndUpdate({ email }, userData, {
      // Aby zwrócić usera PO aktualizacji, należy użyć flagi "new"
      new: true,
    });
  } catch (e) {
    console.error(e);
    throw new UnknownDatabaseError();
  }
};

const updateUserById = async (_id, userData) => {
  try {
    return await User.findOneAndUpdate({ _id }, userData, {
      // Aby zwrócić usera PO aktualizacji, należy użyć flagi "new"
      new: true,
    });
  } catch (e) {
    console.error(e);
    throw new UnknownDatabaseError();
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  DuplicatedEmailError,
  UnknownDatabaseError,
  updateUserById,
};
