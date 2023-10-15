const userDao = require("./user.dao");
const authService = require("../auth/auth.service");
const jimp = require("jimp");
const mimetypes = require("mime-types");
const path = require("path");
const appDir = path.dirname(require.main.filename);
const fs = require("fs/promises");

const signupHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const createdUser = await userDao.createUser({ email, password });

    return res.status(201).send({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (e) {
    const { message } = e;

    if (e instanceof userDao.DuplicatedEmailError) {
      return res.status(409).send({ message });
    }

    return next(e);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const userEntity = await userDao.getUser(req.body.email);
    const isUserPasswordValid = await userEntity.validatePassword(
      req.body.password
    );
    if (!userEntity || !isUserPasswordValid) {
      return res.status(401).send({ message: "Wrong credentials." });
    }

    const userPayload = {
      email: userEntity.email,
      subscription: userEntity.subscription,
    };

    const token = authService.generateAccessToken(userPayload);
    await userDao.updateUser(userEntity.email, { token });

    return res.status(200).send({
      user: userPayload,
      token,
    });
  } catch (e) {
    return next(e);
  }
};

const logoutHandler = async (req, res, next) => {
  try {
    const { _id } = req.user;
    // Nie wiem czemu musi to być po _id, skoro wszędzie update był po mailu,
    // ale takie są wymagania
    console.log(await userDao.updateUserById(_id, { token: null }));

    return res.status(204).send();
  } catch (e) {
    return next(e);
  }
};

const currentHandler = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(200).send({ user: { email, subscription } });
  } catch (e) {
    return next(e);
  }
};

const avatarsHandler = async (req, res, next) => {
  try {
    const { email } = req.user;
    // Tworzymy docelową nazwę pliku jako email_data.rozszerzenie (np. jpg)
    const filename = `${email}_${Date.now()}.${mimetypes.extension(
      req.file.mimetype
    )}`;

    // Pobieramy uchwyt do awatara z folderu tmp
    const avatarImage = await jimp.read(req.file.path);

    // Zmniejszamy avatar do 250x250 i zapisujemy
    await avatarImage.resize(250, 250).writeAsync(req.file.path);

    // Przenosimy avatar z folderu tmp do folderu public/avatars
    await fs.rename(
      req.file.path,
      path.join(appDir, "public/avatars", filename)
    );

    // Aktualizujemy wpis w bazie i zwracamy zaktualizowanego usera
    const updatedUser = await userDao.updateUser(email, {
      avatarURL: `http://localhost:3000/avatars/${filename}`,
    });

    return res.status(200).send({ avatarURL: updatedUser.avatarURL });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
  avatarsHandler,
};
