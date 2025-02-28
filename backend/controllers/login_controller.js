import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user_model.js";

export async function signUp(req, res) {
  const { fname, lname, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.st(500).json({ message: "Quelque chose s'est mal passé" });
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.st(500).json({ message: "Quelque chose s'est mal passé" });
  }
}
