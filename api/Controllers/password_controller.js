import StatusCodes from "http-status-codes";
import Password from "../Models/PASSWORD.js";
import { BadRequestError } from "../Errors/badRecErr.js";

const getAllPasswords = async (req, res) => {
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    const results = await Password.find({ createdBy: req.user.userID }).sort({ createdAt: sortOrder });

    const decryptedPasswords = results.map(p => ({
        _id: p._id,
        title: p.title,
        password: p.decryptPass(), // decrypt each password
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
    }));

    res.status(StatusCodes.OK).json({ passwords: decryptedPasswords, count: decryptedPasswords.length });
};


const getPassword = async (req, res) => {
    const { user: { userID }, params: { id: passID } } = req;
    const password = await Password.findOne({ _id: passID, createdBy: userID });
    if (!password) throw new BadRequestError(`Password with id: ${passID} doesn't exist!`);
    // res.status(StatusCodes.OK).json(password);

    const decryptedPassword = password.decryptPass(); // returns decrypted value

    res.status(StatusCodes.OK).json({
        _id: password._id,
        title: password.title,
        password: decryptedPassword,
        createdAt: password.createdAt,
        updatedAt: password.updatedAt
    });
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
    
    const decryptedPassword = updatedPassword.decryptPass();

    res.status(StatusCodes.CREATED).json({
        _id: updatedPassword._id,
        title: updatedPassword.title,
        password: decryptedPassword,
        createdAt: updatedPassword.createdAt,
        updatedAt: updatedPassword.updatedAt
    });
};

const deletePassword = async (req, res) => {
    const { user: { userID }, params: { id: passID } } = req;
    const password = await Password.findOneAndDelete({ _id: passID, createdBy: userID });
    if (!password) throw new BadRequestError(`Failed - password with id: ${passID} doesn't exist!`);
    res.status(StatusCodes.OK).json(`Deleted password with id: ${passID}`);
};


export { getAllPasswords , getPassword , createPassword , updatePassword , deletePassword };