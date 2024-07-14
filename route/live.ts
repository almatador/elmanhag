import express from "express";
import { PrismaClient } from '@prisma/client';
const liveRoutes = express.Router();
const prisma = new PrismaClient();




liveRoutes.post("/createLiveClass", async (req, res) => {
    const {
      name,
      teacherId,
      startTime,
      endTime,
      cost,
      description,
      status,
      url
    } = req.body;
    
    if (!name || !url || !teacherId || !startTime || !endTime || !cost || !description || !status) {
      return res.status(400).send('الرجاء تقديم جميع المعلومات المطلوبة للحصة المباشرة');
    }
    
    try {
      const liveClass = await prisma.liveClass.create({
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
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ ما أثناء إنشاء الحصة المباشرة');
    }
  });
  
  liveRoutes.get("/getLiveClasses", async (req, res) => {
    try {
      const liveClasses = await prisma.liveClass.findMany();
      res.status(200).send(liveClasses);
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ ما أثناء جلب الحصص المباشرة');
    }
  });
  
  liveRoutes.get("/getLiveClass/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const liveClass = await prisma.liveClass.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!liveClass) {
        return res.status(404).send('لم يتم العثور على الحصة المباشرة');
      }
      
      res.status(200).send(liveClass);
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ ما أثناء جلب الحصة المباشرة');
    }
  });
  
  liveRoutes.put("/updateLiveClass/:id", async (req, res) => {
    const { id } = req.params;
    const {
      name,
      teacherId,
      startTime,
      endTime,
      cost,
      description,
      status,
      url
    } = req.body;
  
    try {
      const liveClass = await prisma.liveClass.update({
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
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ ما أثناء تحديث الحصة المباشرة');
    }
  });
  
  liveRoutes.delete("/deleteLiveClass/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.liveClass.delete({
        where: { id: parseInt(id) }
      });
  
      res.status(200).send('تم حذف الحصة المباشرة بنجاح');
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ ما أثناء حذف الحصة المباشرة');
    }
  });
  



export default liveRoutes;