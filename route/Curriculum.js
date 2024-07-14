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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const Curriculum = express_1.default.Router();
const prisma = new client_1.PrismaClient();
Curriculum.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const curriculum = yield prisma.curriculum.findUnique({
            where: { id: id },
        });
        if (curriculum) {
            res.json(curriculum);
        }
        else {
            res.status(404).json({ message: 'Curriculum not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// PUT /curriculum/:id - تعديل منهج دراسي بناءً على معرّفه
Curriculum.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, image } = req.body;
    try {
        const updatedCurriculum = yield prisma.curriculum.update({
            where: { id: id },
            data: {
                name: name,
                image: image,
            },
        });
        res.json(updatedCurriculum);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// DELETE /curriculum/:id - حذف منهج دراسي بناءً على معرّفه
Curriculum.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prisma.curriculum.delete({
            where: { id: id },
        });
        res.json({ message: 'Curriculum deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
Curriculum.post('/creataSupject', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, curriculumId } = req.body;
    try {
        const subject = yield prisma.subject.create({
            data: {
                name: name,
                curriculumId: curriculumId
            }
        });
        res.status(200).json(subject); // إرسال النهج الدراسي الجديد كاستجابة
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the subject');
    }
}));
Curriculum.get('/subject/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const subject = yield prisma.subject.findUnique({
            where: { id: id },
        });
        if (subject) {
            res.json(subject);
        }
        else {
            res.status(404).json({ message: 'Subject not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
Curriculum.put('/subject/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, curriculumId } = req.body;
    try {
        const updatedSubject = yield prisma.subject.update({
            where: { id: id },
            data: {
                name: name,
                curriculumId: curriculumId
            },
        });
        res.json(updatedSubject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
Curriculum.delete('/subject/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prisma.subject.delete({
            where: { id: id },
        });
        res.json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
Curriculum.get('/:curriculumId/subjects', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const curriculumId = parseInt(req.params.curriculumId);
    try {
        const subjects = yield prisma.subject.findMany({
            where: { curriculumId: curriculumId },
            include: {
                lessons: true,
            },
        });
        res.json(subjects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = Curriculum;
