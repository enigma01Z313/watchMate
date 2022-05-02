const express = require("express");
const router = express.Router();
const { login, confirmToken } = require("./services");

router.post("/auth", login);
router.post("/auth/confirmToken", confirmToken);

module.exports = router;
