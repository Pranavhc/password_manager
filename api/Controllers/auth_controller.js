import User from "../Models/USER.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../Errors/badRecErr.js";
import { UnauthorizedError } from "../Errors/unauthorizedErr.js";

const register = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new BadRequestError("Please provide both email and password!");
    }

    let userExists = await User.findOne({ email });
    if (userExists) throw new BadRequestError("User Already Exists, try logging in!");

    const user = await User.create({ email, password });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError("Invalid Credentials, User Not Found!");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new UnauthorizedError("Invalid Credentials");

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user, token });
};


const getlogin = async (req, res) => {
    const user = await User.findById(req.user.userID);
    res.json({ user, token: req.token });
};


export { register, login, getlogin };