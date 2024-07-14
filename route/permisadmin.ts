import express from 'express';
import { PrismaClient } from '@prisma/client';

const permission = express.Router();
const prisma = new PrismaClient();

// Create a new permission
permission.post("/createPermission", async (req, res) => {
  const { name } = req.body;
  try {
    // Check if the permission name already exists
    const existingPermission = await prisma.permission.findFirstOrThrow({
      where: { name: name }
    });

    if (existingPermission) {
      return res.status(400).json({ error: 'This permission name already exists' });
    }
    const createdPermission = await prisma.permission.create({
      data: {
        name: name,
        admin: { connect: { id: req.body.adminId } }
      }
    });


    res.status(201).json(createdPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الصلاحية' });
  }
});

// Add a new permission for a specific admin
permission.post('/permissions', async (req, res) => {
  const { adminId, name } = req.body;
  try {
    // Check if the admin exists
    const adminExists = await prisma.admin.findUnique({
      where: { id: adminId }
    });
    
    if (!adminExists) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const createdPermission = await prisma.permission.create({
      data: {
        name: name,
        adminId: adminId
      }
    });

    res.status(201).json(createdPermission);
  } catch (error) {
    console.error('Error adding permission:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة الصلاحية' });
  }
});

// Update an existing permission
permission.put('/permissions/:id', async (req, res) => {
  const permissionId = parseInt(req.params.id);
  const { name } = req.body;
  try {
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId }
    });

    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    const updatedPermission = await prisma.permission.update({
      where: { id: permissionId },
      data: { name: name }
    });

    res.status(200).json(updatedPermission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل الصلاحية' });
  }
});

// Delete an existing permission
permission.delete('/permissions/:id', async (req, res) => {
  const permissionId = parseInt(req.params.id);
  try {
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId }
    });

    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    await prisma.permission.delete({
      where: { id: permissionId }
    });

    res.status(200).json({ message: 'تم حذف الصلاحية بنجاح' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف الصلاحية' });
  }
});

export default permission;
