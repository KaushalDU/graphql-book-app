const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserModel = require("../../models/userModel");
const BlackListModel = require("../../models/blackListModel");


module.exports = {
    createUser: async (args) => {
        const { email, password, role } = args.userInput;
        try {
            if (!email || !password) {
                throw new Error("Both Email and password required.");
            }

            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists.");
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const newUser = new UserModel({email, role, password: hashPassword});
            const response = await newUser.save();

            return { ...response._doc, password: null };
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("User does not exist")
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Incorrect Password');
            }
            const token = jwt.sign({ userId: user.id, email: user.email, role:user.role }, "secretValue", { expiresIn: "1hr" });
            return { userId: user.id, token, tokenExpiration: 1 }

        } catch (error) {
            throw error
        }
    },
    logout:async(_,req)=>{
        const token = req.headers.authorization?.split(" ")[1];
        try {
            const newToken = new BlackListModel({token});
            await newToken.save();
            return "Logout Successfully"
        } catch (error) {
            throw error
        }
    }
};