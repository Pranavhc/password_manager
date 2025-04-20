import StatusCodes from "http-status-codes";
import Password from "../Models/PASSWORD.js";
import { BadRequestError } from "../Errors/badRecErr.js";

const getAllPasswords = async (req, res) => {
    const passwords = await Password.find({ createdBy: req.user.userID }).sort({ "updatedAt": -1 });
    res.status(StatusCodes.OK).json({ passwords: passwords, count: passwords.length });
};

const getPassword = async (req, res) => {
    const { user: { userID }, params: { id: passID } } = req;
    const password = await Password.findOne({ _id: passID, createdBy: userID });
    if (!password) throw new BadRequestError(`Password with id: ${passID} doesn't exist!`);
    res.status(StatusCodes.OK).json(password);
};

const createPassword = async (req, res) => {
    req.body.createdBy = req.user.userID;
    const password = await Password.create(req.body);
    res.status(StatusCodes.CREATED).json(password);
};

const updatePassword = async (req, res) => {
    const { title, password } = req.body;

    if (!title || title === "") throw new BadRequestError("Title cannot be empty!");
    if (!password || password === "") throw new BadRequestError("Password cannot be empty!");

    const updatedPassword = await Password.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user.userID },
        { title, password },
        { new: true }
    );

    if (!updatedPassword) throw new BadRequestError(`Password with id: ${req.params.id} doesn't exist!`);
    res.status(StatusCodes.CREATED).json(updatedPassword);
};

const deletePassword = async (req, res) => {
    const { user: { userID }, params: { id: passID } } = req;
    const password = await Password.findOneAndDelete({ _id: passID, createdBy: userID });
    if (!password) throw new BadRequestError(`Failed - password with id: ${passID} doesn't exist!`);
    res.status(StatusCodes.OK).json(`Deleted password with id: ${passID}`);
};


export { getAllPasswords , getPassword , createPassword , updatePassword , deletePassword };