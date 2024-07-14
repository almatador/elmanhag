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
const permission = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Create a new permission
permission.post("/createPermission", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        // Check if the permission name already exists
        const existingPermission = yield prisma.permission.findFirstOrThrow({
            where: { name: name }
        });
        if (existingPermission) {
            return res.status(400).json({ error: 'This permission name already exists' });
        }
        const createdPermission = yield prisma.permission.create({
            data: {
                name: name,
                admin: { connect: { id: req.body.adminId } }
            }
        });
        res.status(201).json(createdPermission);
    }
    catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الصلاحية' });
    }
}));
// Add a new permission for a specific admin
permission.post('/permissions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, name } = req.body;
    try {
        // Check if the admin exists
        const adminExists = yield prisma.admin.findUnique({
            where: { id: adminId }
        });
        if (!adminExists) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        const createdPermission = yield prisma.permission.create({
            data: {
                name: name,
                adminId: adminId
            }
        });
        res.status(201).json(createdPermission);
    }
    catch (error) {
        console.error('Error adding permission:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إضافة الصلاحية' });
    }
}));
// Update an existing permission
permission.put('/permissions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionId = parseInt(req.params.id);
    const { name } = req.body;
    try {
        const existingPermission = yield prisma.permission.findUnique({
            where: { id: permissionId }
        });
        if (!existingPermission) {
            return res.status(404).json({ error: 'Permission not found' });
        }
        const updatedPermission = yield prisma.permission.update({
            where: { id: permissionId },
            data: { name: name }
        });
        res.status(200).json(updatedPermission);
    }
    catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تعديل الصلاحية' });
    }
}));
// Delete an existing permission
permission.delete('/permissions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionId = parseInt(req.params.id);
    try {
        const existingPermission = yield prisma.permission.findUnique({
            where: { id: permissionId }
        });
        if (!existingPermission) {
            return res.status(404).json({ error: 'Permission not found' });
        }
        yield prisma.permission.delete({
            where: { id: permissionId }
        });
        res.status(200).json({ message: 'تم حذف الصلاحية بنجاح' });
    }
    catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف الصلاحية' });
    }
}));
exports.default = permission;
