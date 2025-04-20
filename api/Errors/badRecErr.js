import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./customErr.js";

export class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
};