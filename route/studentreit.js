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
const StudentreitRouters = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// POST /assignment/:assignmentId/submit
StudentreitRouters.post('/assignment/:assignmentId/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { assignmentId } = req.params;
    const { studentId, answers } = req.body;
    if (!studentId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Student ID and answers are required, and answers should be an array.' });
    }
    try {
        const assignment = yield prisma.assignment.findUnique({
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
        const studentAssignment = yield prisma.studentAssignment.create({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
}));
exports.default = StudentreitRouters;
