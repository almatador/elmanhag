import express from 'express';
import { PrismaClient } from '@prisma/client';


const StudentreitRouters = express.Router();
const prisma = new PrismaClient();






// POST /assignment/:assignmentId/submit
StudentreitRouters.post('/assignment/:assignmentId/submit', async (req, res) => {
    const { assignmentId } = req.params;
    const { studentId, answers } = req.body;

    if (!studentId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Student ID and answers are required, and answers should be an array.' });
    }

    try {
        const assignment = await prisma.assignment.findUnique({
            where: { id: parseInt(assignmentId) },
            include: { lesson: true },
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const correctAnswers = assignment.answersTrue.split(',');
        let score = 0;

        answers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) {
                score += 1;
            }
        });

        const totalQuestions = correctAnswers.length;
        const percentage = (score / totalQuestions) * 100;

        const studentAssignment = await prisma.studentAssignment.create({
            data: {
                student: { connect: { id: parseInt(studentId) } },
                assignment: { connect: { id: parseInt(assignmentId) } },
                score: percentage,
            },
        });

        res.json({
            message: 'Assignment submitted successfully',
            score: percentage,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});
export default StudentreitRouters;