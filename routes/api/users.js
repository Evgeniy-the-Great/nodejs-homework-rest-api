const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../../model");
const { authentificate, upload } = require("../../middlewares");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

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

router.patch("/avatars", authentificate, upload.single('avatar'), async (req, res) => {
  const { path: tempUpload, filename } = req.file;
  const [extension] = filename.split(".").reverse();
  const newFleName = `${req.user._id}.${extension}`;
  const fileUpload = path.join(avatarsDir, newFleName);
  await fs.rename(tempUpload, fileUpload);
  const avatarURL = path.join("avatars", newFleName);
  await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
  res.json({ avatarURL });
})
module.exports = router;
