import express from 'express';
import { PrismaClient } from '@prisma/client';



const lessonRoutes = express.Router();
const prisma = new PrismaClient();
lessonRoutes.post('/lesson/create', async (req, res) => {
    const { title, subjectId, teacherId, } = req.body;

    try {
        const newLesson = await prisma.lesson.create({
            data: {
                title: title,
                subjectId: subjectId,
                teacherId: teacherId,
            },
        });
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /lesson/update/:id
lessonRoutes.put('/lesson/update/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, subjectId, teacherId } = req.body;

    try {
        const updatedLesson = await prisma.lesson.update({
            where: { id: id },
            data: {
                title: title,
                subjectId: subjectId,
                teacherId: teacherId,
            },
        });
        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /lesson/delete/:id
lessonRoutes.delete('/lesson/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.lesson.delete({
            where: { id: id },
        });
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default lessonRoutes;
