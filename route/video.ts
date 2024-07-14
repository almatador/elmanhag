import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const videioRoutes = express.Router();
const prisma = new PrismaClient();

// POST /lesson/:lessonId/video/create
videioRoutes.post('/lesson/:lessonId/video/create', async (req, res) => {
    const { lessonId } = req.params;
    const { url, views, teacherId } = req.body;

    try {
        // تحقق من أن المدرس مسؤول عن الدرس
        const lesson = await prisma.lesson.findUnique({
            where: { id: parseInt(lessonId) },
            include: { teacher: true },
        });

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        if (lesson.teacherId !== parseInt(teacherId)) {
            return res.status(403).json({ message: 'Teacher not authorized to add video to this lesson' });
        }

        const newVideo = await prisma.video.create({
            data: {
                url,
                views: views || 0,
                lesson: {
                    connect: { id: parseInt(lessonId) }
                }
            },
        });
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error});
    }
});


// GET /lesson/:lessonId/videos
videioRoutes.get('/lesson/:lessonId/videos', async (req, res) => {
    const { lessonId } = req.params;

    try {
        const videos = await prisma.video.findMany({
            where: {
                lessonId: parseInt(lessonId),
            },
        });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error});
    }
});

// GET /video/:id
videioRoutes.get('/video/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const video = await prisma.video.findUnique({
            where: { id: parseInt(id) },
        });

        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error});
    }
});

// PUT /video/update/:id
videioRoutes.put('/video/update/:id', async (req, res) => {
    const { id } = req.params;
    const { url, views } = req.body;

    if (!url && !views) {
        return res.status(400).json({ message: 'At least one field (url or views) is required to update' });
    }

    try {
        const updatedVideo = await prisma.video.update({
            where: { id: parseInt(id) },
            data: {
                ...(url && { url: url }),
                ...(views && { views: views }),
            },
        });
        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

// DELETE /video/delete/:id
videioRoutes.delete('/video/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.video.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error});
    }
});

export default videioRoutes;
