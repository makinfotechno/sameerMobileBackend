import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = () =>
    crypto.randomBytes(40).toString("hex");

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
