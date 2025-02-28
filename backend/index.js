import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import loginRouter from "./routes/login_routes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use("/api/auth", loginRouter);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Serveur démarré sur le port ${process.env.SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connexion à la base de données échouée!", error.message);
  });
