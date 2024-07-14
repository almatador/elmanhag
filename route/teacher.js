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
const TeacherRoutes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
TeacherRoutes.post("/loginTeacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور');
    }
    try {
        const teacher = yield prisma.teacher.findUnique({
            where: {
                email: email,
            },
        });
        if (teacher && bcrypt_1.default.compareSync(password, teacher.password)) {
            res.status(200).send(teacher);
        }
        else {
            res.status(404).send('الايميل او كلمة المرور خطأ');
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send('حدث مشكلة في السيرفر');
    }
}));
TeacherRoutes.post("/createTeacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password, confPassword, } = req.body;
    if (!email || !name || !password || !confPassword || !phoneNumber) {
        return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور وجميع المعلومات المطلوبة');
    }
    if (password !== confPassword) {
        return res.status(400).send('كلمتا المرور غير متطابقتين');
    }
    try {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const hashedConfPassword = yield bcrypt_1.default.hash(confPassword, saltRounds);
        const teacher = yield prisma.teacher.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                confPassword: hashedConfPassword,
                phoneNumber: parseInt(phoneNumber), // Assuming phoneNumber is stored as an integer
            },
        });
        res.status(200).send(teacher);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء إنشاء المعلم');
    }
}));
TeacherRoutes.delete("/deleteTeacher/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('الرجاء تقديم معرف المعلم');
    }
    try {
        const deleteTeacher = yield prisma.teacher.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).send(deleteTeacher);
    }
    catch (error) {
        console.error(`Error on deleting teacher: ${error}`);
        res.status(500).send('حدث خطأ ما أثناء حذف المعلم');
    }
}));
exports.default = TeacherRoutes;
