import mongoose from "mongoose";
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const passwordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title!"],
        trim: true
    },

    password: {
        type: String,
        required: [true, "Please provide a password to add!"],
        trim: true
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: [true, "User Not Found!"]
    }

}, { timestamps: true });


function encrypt(text) {
    const key = Buffer.from(process.env.securityKey, 'hex');
    const iv = Buffer.from(process.env.initVector, 'hex');

    const cipher = crypto.createCipheriv(process.env.algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decrypt(text) {
    const key = Buffer.from(process.env.securityKey, 'hex');
    const iv = Buffer.from(process.env.initVector, 'hex');

    const decipher = crypto.createDecipheriv(process.env.algorithm, key, iv);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Encrypt on save
passwordSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = encrypt(this.password);
    }
});

// Encrypt on update
passwordSchema.pre("findOneAndUpdate", function () {
    if (this._update.password) {
        this._update.password = encrypt(this._update.password);
    }
});

// Decrypt method
passwordSchema.methods.decryptPass = function () {
    return decrypt(this.password);
};

export default mongoose.model("password", passwordSchema);