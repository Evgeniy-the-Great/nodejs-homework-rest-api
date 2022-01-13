const express = require("express");
const { User } = require("../../model");
const { authentificate } = require("../../middlewares");

const router = express.Router();

router.get("/logout", authentificate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authentificate, async (req, res, next) => {
  const { name, email } = req.user;
  res.json({
    user: {
      email,
      name,
    },
  });
});

module.exports = router;
