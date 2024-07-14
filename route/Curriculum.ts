import { Assignment, Lesson, PrismaClient, Video } from '@prisma/client'
import { create } from 'domain';
import express from 'express';
import { url } from 'inspector';
import { title } from 'process';

const Curriculum =express.Router()
const prisma = new PrismaClient()
Curriculum.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: id },
    })
    if (curriculum) {
      res.json(curriculum);
    } else {
      res.status(404).json({ message: 'Curriculum not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /curriculum/:id - تعديل منهج دراسي بناءً على معرّفه
Curriculum.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, image } = req.body;

  try {
    const updatedCurriculum = await prisma.curriculum.update({
      where: { id: id },
      data: {
        name: name,
        image: image,
      },
    });

    res.json(updatedCurriculum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /curriculum/:id - حذف منهج دراسي بناءً على معرّفه
Curriculum.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.curriculum.delete({
      where: { id: id },
    });

    res.json({ message: 'Curriculum deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
Curriculum.post('/creataSupject', async (req, res) => {
  const { name, curriculumId } = req.body;

  try {
    const subject = await prisma.subject.create({
      data: {
        name: name,
        curriculumId: curriculumId
      }
    });

    res.status(200).json(subject); // إرسال النهج الدراسي الجديد كاستجابة
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the subject');
  }
});
Curriculum.get('/subject/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const subject = await prisma.subject.findUnique({
      where: { id: id },
    });

    if (subject) {
      res.json(subject);
    } else {
      res.status(404).json({ message: 'Subject not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
Curriculum.put('/subject/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, curriculumId } = req.body;

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id: id },
      data: {
        name: name,
        curriculumId: curriculumId
      },
    });

    res.json(updatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
Curriculum.delete('/subject/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.subject.delete({
      where: { id: id },
    });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

Curriculum.get('/:curriculumId/subjects', async (req, res) => {
  const curriculumId = parseInt(req.params.curriculumId);

  try {
    const subjects = await prisma.subject.findMany({
      where: { curriculumId: curriculumId },
      include: {
        lessons: true,
      },
    });

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default Curriculum;