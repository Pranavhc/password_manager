import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./customErr.js";

export class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};