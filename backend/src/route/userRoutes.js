const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
  createUser,
  getAllUsers,
  updateUser,
  loginUser,
  getUserById,
  getUserProfile,
} = require("../controllers/userController");

router.post("/create-user", createUser);
router.post("/login", loginUser);
router.get("/@", getAllUsers);
router.get("/user-profile", getUserProfile);
router.get("/get-customer/:id", getUserById);
router.put("/update-customer/:id", updateUser);

module.exports = router;
