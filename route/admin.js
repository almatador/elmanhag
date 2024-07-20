"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const admin = express_1.default.Router();
const prisma = new client_1.PrismaClient();
admin.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("الرجاء تقديم البريد الإلكتروني وكلمة المرور");
    }
    try {
        const admin = yield prisma.admin.findUnique({
            where: {
                email: email,
            },
        });
        if (admin && bcrypt_1.default.compareSync(password, admin.password)) {
            res.status(200).send(admin);
        }
        else {
            res.send("الايميل او كلمة المرور خطأ").status(404);
        }
    }
    catch (error) {
        console.error("Login error:", error);
        res.send("حدث مشكلة في السيرفر").status(500);
    }
}));
admin.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, phoneNumber } = req.body;
    if (!email || !password || !name || !phoneNumber) {
        return res.status(400).send("الرجاء تقديم البريد الإلكتروني وكلمة المرور");
    }
    try {
        const saltRounds = 10;
        const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
        const user = yield prisma.admin.create({
            data: {
                email: email,
                password: hashedPassword,
                username: name,
                phoneNumber: phoneNumber
            },
        });
        res.status(200).send(user);
    }
    catch (error) {
        console.error("Signup error:", error);
        res.send("حدث مشكلة في السيرفر").status(500);
    }
}));
admin.get("/getalladmin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield prisma.admin.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                permissions: true
            }
        });
        res.status(200).json(admins);
    }
    catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).send("An error occurred while fetching admins");
    }
}));
exports.default = admin;
