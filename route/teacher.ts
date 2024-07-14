import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const TeacherRoutes = express.Router();
const prisma = new PrismaClient();

interface TeacherCreateRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confPassword: string;
}

interface CurriculumCreateRequest {
  name: string;
  image: string;
  subjects: SubjectCreateRequest[];
  teacherId: string;
}

interface SubjectCreateRequest {
  name: string;
  lessons: LessonCreateRequest[];
}

interface LessonCreateRequest {
  title: string;
  videos: VideoCreateRequest[];
  assignments: AssignmentCreateRequest[];
}

interface VideoCreateRequest {
  url: string;
  views: number;
}

interface AssignmentCreateRequest {
  question: string;
  answersTrue: string;
}

TeacherRoutes.post("/loginTeacher", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور');
  }

  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        email: email,
      },
    });

    if (teacher && bcrypt.compareSync(password, teacher.password)) {
      res.status(200).send(teacher);
    } else {
      res.status(404).send('الايميل او كلمة المرور خطأ');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('حدث مشكلة في السيرفر');
  }
});

TeacherRoutes.post("/createTeacher", async (req: Request, res: Response) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    confPassword,
  } = req.body as TeacherCreateRequest;

  if (!email || !name || !password || !confPassword || !phoneNumber) {
    return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور وجميع المعلومات المطلوبة');
  }

  if (password !== confPassword) {
    return res.status(400).send('كلمتا المرور غير متطابقتين');
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedConfPassword = await bcrypt.hash(confPassword, saltRounds);

    const teacher = await prisma.teacher.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        confPassword: hashedConfPassword,
        phoneNumber: parseInt(phoneNumber),  // Assuming phoneNumber is stored as an integer
      },
    });

    res.status(200).send(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).send('حدث خطأ ما أثناء إنشاء المعلم');
  }
});

TeacherRoutes.delete("/deleteTeacher/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('الرجاء تقديم معرف المعلم');
  }

  try {
    const deleteTeacher = await prisma.teacher.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).send(deleteTeacher);
  } catch (error) {
    console.error(`Error on deleting teacher: ${error}`);
    res.status(500).send('حدث خطأ ما أثناء حذف المعلم');
  }
});

export default TeacherRoutes;
