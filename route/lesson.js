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
const client_1 = require("@prisma/client");
const lessonRoutes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
lessonRoutes.post('/lesson/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, subjectId, teacherId, } = req.body;
    try {
        const newLesson = yield prisma.lesson.create({
            data: {
                title: title,
                subjectId: subjectId,
                teacherId: teacherId,
            },
        });
        res.status(201).json(newLesson);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// PUT /lesson/update/:id
lessonRoutes.put('/lesson/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { title, subjectId, teacherId } = req.body;
    try {
        const updatedLesson = yield prisma.lesson.update({
            where: { id: id },
            data: {
                title: title,
                subjectId: subjectId,
                teacherId: teacherId,
            },
        });
        res.json(updatedLesson);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// DELETE /lesson/delete/:id
lessonRoutes.delete('/lesson/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prisma.lesson.delete({
            where: { id: id },
        });
        res.json({ message: 'Lesson deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = lessonRoutes;
