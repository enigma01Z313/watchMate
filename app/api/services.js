const crypto = require("crypto");
const db = require("./staticDb");

const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end("ha");

  const userIndex = db.users.findIndex(
    (item) =>
      item.username.trim() === username.trim() &&
      item.password.trim() === password.trim()
  );

  if (userIndex === -1) return res.status(403).end("ha");

  const hashSecret = "hui!12bN";
  const hashed = crypto
    .createHmac("sha256", hashSecret)
    .update(`${username}-${password}-${new Date().getTime()}`)
    .digest("hex");

  db.users[userIndex].token = hashed;

  return res.status(200).json({ token: hashed });
};

const confirmToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).end("ha");

  const theUser = db.users.find((item) => item.token === token);
  if (!theUser) return res.status(403).end("ha");

  const user = { ...theUser };
  delete user.username;
  delete user.password;
  return res.status(200).json({ user });
};

module.exports = { login, confirmToken };
