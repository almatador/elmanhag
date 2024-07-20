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
const videioRoutes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST /lesson/:lessonId/video/create
videioRoutes.post('/lesson/:lessonId/video/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId } = req.params;
    const { url, views, teacherId } = req.body;
    try {
        // تحقق من أن المدرس مسؤول عن الدرس
        const lesson = yield prisma.lesson.findUnique({
            where: { id: parseInt(lessonId) },
            include: { teacher: true },
        });
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        if (lesson.teacherId !== parseInt(teacherId)) {
            return res.status(403).json({ message: 'Teacher not authorized to add video to this lesson' });
        }
        const newVideo = yield prisma.video.create({
            data: {
                url,
                views: views || 0,
                lesson: {
                    connect: { id: parseInt(lessonId) }
                }
            },
        });
        res.status(201).json(newVideo);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
// GET /lesson/:lessonId/videos
videioRoutes.get('/lesson/:lessonId/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lessonId } = req.params;
    try {
        const videos = yield prisma.video.findMany({
            where: {
                lessonId: parseInt(lessonId),
            },
        });
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
// GET /video/:id
videioRoutes.get('/video/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const video = yield prisma.video.findUnique({
            where: { id: parseInt(id) },
        });
        if (video) {
            res.json(video);
        }
        else {
            res.status(404).json({ message: 'Video not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
// PUT /video/update/:id
videioRoutes.put('/video/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { url, views } = req.body;
    if (!url && !views) {
        return res.status(400).json({ message: 'At least one field (url or views) is required to update' });
    }
    try {
        const updatedVideo = yield prisma.video.update({
            where: { id: parseInt(id) },
            data: Object.assign(Object.assign({}, (url && { url: url })), (views && { views: views })),
        });
        res.json(updatedVideo);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
// DELETE /video/delete/:id
videioRoutes.delete('/video/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.video.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Video deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
exports.default = videioRoutes;
