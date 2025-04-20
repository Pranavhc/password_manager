import mongoose from "mongoose";

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


// hashing password on save
// noteSchema.pre("save", async function () {
//     if (!this.password) return;

//     const salt = await bcrypt.genSalt(10); // random bits
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // hashing password on update
// noteSchema.pre("findOneAndUpdate", async function () {
//     if (!this._update.password) return;

//     const salt = await bcrypt.genSalt(10); // random bits
//     this._update.password = await bcrypt.hash(this._update.password, salt);
// });

// // hashing password on update
// noteSchema.pre("update", async function () {
//     if (!this._update.password) return;

//     const salt = await bcrypt.genSalt(10); // random bits
//     this._update.password = await bcrypt.hash(this._update.password, salt);
// });

// // verifying password
// noteSchema.methods.comparePassword = async function (enteredPass) {
//     if (!this.password) return;
//     const isMatch = await bcrypt.compare(enteredPass, this.password);
//     return isMatch;
// };

// // encrypting content of note on save
// noteSchema.pre("save", async function () {
//     if (!this.content) return;

//     const securityKey = Buffer.from(process.env.securityKey, 'hex');
//     const initVector = Buffer.from(process.env.initVector, 'hex');

//     const cipher = crypto.createCipheriv(process.env.algorithm, securityKey, initVector);
//     let encryptedData = cipher.update(this.content, "utf-8", "hex");
//     this.content = encryptedData + cipher.final("hex");
// });

// // encrypting content of note on update
// noteSchema.pre("findOneAndUpdate", async function () {
//     if (!this._update.content) return;

//     const securityKey = Buffer.from(process.env.securityKey, 'hex');
//     const initVector = Buffer.from(process.env.initVector, 'hex');

//     const cipher = crypto.createCipheriv(process.env.algorithm, securityKey, initVector);
//     let encryptedData = cipher.update(this._update.content, "utf-8", "hex");
//     this._update.content = encryptedData + cipher.final("hex");
// });

// // decrypting content of note
// noteSchema.methods.decryptNote = function () {
//     if (!this.content) return;

//     const securityKey = Buffer.from(process.env.securityKey, 'hex');
//     const initVector = Buffer.from(process.env.initVector, 'hex');

//     const decipher = crypto.createDecipheriv(process.env.algorithm, securityKey, initVector);
//     let decryptedData = decipher.update(this.content, "hex", "utf-8");
//     this.content = decryptedData + decipher.final("utf8");
// };

export default mongoose.model("password", passwordSchema);