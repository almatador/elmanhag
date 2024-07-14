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
const liveRoutes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
liveRoutes.post("/createLiveClass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, teacherId, startTime, endTime, cost, description, status, url } = req.body;
    if (!name || !url || !teacherId || !startTime || !endTime || !cost || !description || !status) {
        return res.status(400).send('الرجاء تقديم جميع المعلومات المطلوبة للحصة المباشرة');
    }
    try {
        const liveClass = yield prisma.liveClass.create({
            data: {
                name,
                teacher: {
                    connect: { id: parseInt(teacherId) }
                },
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                cost: parseFloat(cost),
                description,
                status,
                url
            }
        });
        res.status(200).send(liveClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء إنشاء الحصة المباشرة');
    }
}));
liveRoutes.get("/getLiveClasses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liveClasses = yield prisma.liveClass.findMany();
        res.status(200).send(liveClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء جلب الحصص المباشرة');
    }
}));
liveRoutes.get("/getLiveClass/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const liveClass = yield prisma.liveClass.findUnique({
            where: { id: parseInt(id) }
        });
        if (!liveClass) {
            return res.status(404).send('لم يتم العثور على الحصة المباشرة');
        }
        res.status(200).send(liveClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء جلب الحصة المباشرة');
    }
}));
liveRoutes.put("/updateLiveClass/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, teacherId, startTime, endTime, cost, description, status, url } = req.body;
    try {
        const liveClass = yield prisma.liveClass.update({
            where: { id: parseInt(id) },
            data: {
                name,
                teacherId: parseInt(teacherId),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                cost: parseFloat(cost),
                description,
                status,
                url
            }
        });
        res.status(200).send(liveClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء تحديث الحصة المباشرة');
    }
}));
liveRoutes.delete("/deleteLiveClass/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.liveClass.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).send('تم حذف الحصة المباشرة بنجاح');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('حدث خطأ ما أثناء حذف الحصة المباشرة');
    }
}));
exports.default = liveRoutes;
