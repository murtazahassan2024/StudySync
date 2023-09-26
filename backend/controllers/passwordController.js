import USER from "../models/userModel.js";

export async function forgotPassword(req, res) {
  try {
    const { email } = req.params;

    const securityQuestion = await USER.findOne({
      email: email,
    }).select("securityQuestion");

    res.status(200).json({
      securityQuestion,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}

export async function verifyAnswer(req, res) {
  try {
    const { _id } = req.params;
    const { securityAnswer } = req.body;

    const user = await USER.findOne({
      _id: _id,
    });

    if (securityAnswer === user.securityAnswer) {
      res.status(200).json({
        msg: "Correct Answer",
      });
    } else {
      res.status(400).json({
        msg: "Wrong Answer",
      });
    }
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        error: "Please enter a password",
      });
    }

    const user = await USER.findOne({
      id: id,
    });
    if (!user)
      return res.status(400).json({
        message: "User Not Found",
      });

    user.password = password;
    await user.save();

    return res.status(200).json({
      message: "User password updated successfully",
      user: user,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
}
