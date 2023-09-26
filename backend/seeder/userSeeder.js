import connectDB from "../config/dbConnection.js";
import users from "../data/users.js";
import USER from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

connectDB();

const seedData = async () => {
  try {
    //This line will delete any exisitng admins
    await USER.deleteMany({ isAdmin: true });
    //insert new admin
    await USER.insertMany(users);

    console.log("Admin created");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedData();
