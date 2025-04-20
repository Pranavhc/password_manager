import express from "express";
import { getAllPasswords, getPassword, createPassword, updatePassword, deletePassword } from "../Controllers/password_controller.js";

const router = express.Router();

router.route("/").post(createPassword).get(getAllPasswords);
router.route("/:id").get(getPassword).patch(updatePassword).delete(deletePassword);

export default router;