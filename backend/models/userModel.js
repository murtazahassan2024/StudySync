import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        securityQuestion: {
            type: String,
            required: true,
        },
        securityAnswer: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//attaching a matchPassword method to the user schema to match passwords, which returns a boolean
//this method is called from userRoutes LOGIN API

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isMatch = await bcryptjs.compare(enteredPassword, this.password);
    return isMatch;
};

//For Hashing a passowrd before it is saved to the DB, that returns a HASH.
//this method is called from userRoutes SIGNUP API

userSchema.pre('save', async function (next) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

const USER = mongoose.model('Users', userSchema);

export default USER;