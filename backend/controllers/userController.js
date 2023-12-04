import asyncHAndler from 'express-async-handler';
import USER from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';


const registerUser = asyncHAndler(async (req, res) => {
    const { name, email, password, isAdmin, securityQuestion, securityAnswer } = req.body;

    //findOne method from mongooose to get only one document
    //this method takes an object for where clause
    const userExists = await USER.findOne({ email: email });
    console.log({ userExists });
    if (userExists) {
        res.status(400);
        throw new Error('User against this email already exits');
        // .json({
        //   error: "",
        // });
    }
    //if the key value pairs are same , write like this
    const user = {
        name,
        email,
        password,
        securityQuestion,
        securityAnswer,
    };
    
    //user creation is a Promise, so we have to wrtie it try cathc.
    //and catch the error if something goes wrong
    const createdUser = await USER.create(user);

    if (createdUser) {
        res.status(201).json({
            user: createdUser,
            msg: 'user created',
        });
    }
});

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            securityQuestion: user.securityQuestion,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({
            error: 'Invalid email or password',
        });
    }
};

const forgotPass = async (req, res) => {
    const { email } = req.body;

    const user = await USER.findOne({ email });

    if (user) {
        res.json({
            _id: user._id,
            securityQuestion: user.securityQuestion,
        });
    } else {
        res.status(401).json({
            error: 'Invalid email ',
        });
    }
};


const getUserNameById = asyncHandler(async (req, res) => {
    const {id} = req.params; // Retrieve the userId from the route parameter

    const user = await USER.findById(id);
    res.send(user.name);
});


export { registerUser, login, forgotPass, getUserNameById };
