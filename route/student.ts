import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const StudentRoutes = express.Router();
const prisma = new PrismaClient();


const generateSecretKey = () => {
  return require('crypto').randomBytes(64).toString('hex');
};


StudentRoutes.get('/getstudent', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { parent: true, country: true }, // استخدام parent بدلاً من parentis و country بدلاً من Country
    });
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(`Error on getting students ERROR: ${error}`);
  }
});
StudentRoutes.get('/student/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // التحقق من أن المعرف هو عدد صحيح
    if (isNaN(parseInt(id))) {
      return res.status(400).send('Invalid ID');
    }

    // البحث عن الطالب باستخدام المعرف
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        parent: true,    // إحضار معلومات الوالد
        city: true,      // إحضار معلومات المدينة
        country: true,   // إحضار معلومات البلد
        categories: true // إحضار معلومات الفئات
      }
    });

    if (!student) {
      return res.status(404).send('Student not found');
    }

    // تضمين البيانات الجديدة في الاستجابة
    res.status(200).json({
      name: student.name,
      email: student.email,
      parentName: student.parent.name,
      parentPhone: student.parent.phoneNumber,
      phone: student.phoneNumber,
      countryId: student.countryId,
      cityId: student.cityId,
      categoryId: student.categories.map(category => category.id), // Assuming categories is an array
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send('حدث مشكلة في السيرفر');
  }
});


StudentRoutes.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      return res.status(404).send('الطالب غير موجود');
    }

    await prisma.student.delete({
      where: { id: Number(id) },
    });

    res.status(200).send('تم حذف الطالب بنجاح');
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('حدث مشكلة في السيرفر');
  }
});
const authenticateStudent = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور');
  }

  try {
    const student = await prisma.student.findFirstOrThrow({
      where: { email },
    });

    if (!student || !bcrypt.compareSync(password, student.password)) {
      return res.status(404).send('الايميل او كلمة المرور خطأ');
    }

    req.body.student = student; // إضافة الطالب إلى كائن الطلب للاستخدام في الوظائف اللاحقة
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('حدث مشكلة في السيرفر');
  }
};

// Middleware لتوليد وتحديث الـ secretKey
const updateSecretKey = async (req: Request, res: Response) => {
  const newSecretKey = require('crypto').randomBytes(64).toString('hex');
  try {
    await prisma.student.update({
      where: { id: req.body.student.id },
      data: { secretKey: newSecretKey },
    });

    const token = jwt.sign({ id: req.body.student.id }, newSecretKey, { expiresIn: '24h' });
    req.body.token = token;
    
  } catch (error) {
    console.error('Error updating secret key:', error);
    res.status(500).send('حدثت مشكلة في السيرفر');
  }
};


// Middleware للتحقق من الطالب المسجل في الطلب
const checkAuthenticated = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('تحقق غير مصرح به');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, req.body.token);
    req.body.studentId = decoded;
    
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).send('تحقق غير مصرح به');
  }
};
StudentRoutes.post('/login', authenticateStudent, updateSecretKey, (req: Request, res: Response) => {
  res.status(200).send({ student: req.body.student, token: req.body.token });
  console.log(req.body.token)
});


// Route لتسجيل الخروج
StudentRoutes.delete('/logout/:id', async (req: Request, res: Response) => {
  const { id } = req.params; // Assuming id is passed as a route parameter

  try {
    // Find and delete the student's secret key record
    const deletedSecretKey = await prisma.secretKey.deleteMany({
      where: { studentId: parseInt(id) },
    });

    if (!deletedSecretKey.count || deletedSecretKey.count === 0) {
      return res.status(404).send('Secret key not found for the student.');
    }

    res.status(200).send('Logged out successfully.');
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send('An error occurred while logging out.');
  }
});

// Route لإنشاء حساب جديد
StudentRoutes.post('/signin', async (req: Request, res: Response) => {
  const {
    name,
    phoneNumber,
    countryId,
    academicYear,
    email,
    parentisName,
    parentisPhone,
    password,
    confPassword,
    cityId,
    image ,
    typelan
  } = req.body;

  // Check for required fields
  if (!email || !password || !confPassword || !name || !phoneNumber || !parentisName || !parentisPhone) {
    return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور وجميع المعلومات المطلوبة');
  }

  // Check for matching passwords
  if (password !== confPassword) {
    return res.status(400).send('كلمتا المرور غير متطابقتين');
  }

  try {
    // Hash passwords
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Check if parent already exists
    let parentis = await prisma.parent.findFirst({
      where: {
        name: parentisName,
      },
    });

    // If not, create a new parent
    if (!parentis) {
      parentis = await prisma.parent.create({
        data: {
          name: parentisName,
          phoneNumber: parentisPhone,
        },
      });
    }

    // Create new student
    const student = await prisma.student.create({
      data: {
        name: name,
        phoneNumber: phoneNumber,
        countryId: countryId,
        academicYear: academicYear,
        email: email,
        parentId: parentis.id,
        password: hashedPassword,
        confPassword: hashedPassword, // Store hashed password
        cityId: cityId, // Assuming there's a CityId field, set it accordingly
        image: image,
        typelan: typelan,
        secretKey: {
          create: [
            { token: generateSecretKey() } // Generate and include secret key
          ]
        }
      },
      include: {
        secretKey: true // Include secret keys in the response if needed
      }
    });

    res.status(200).json(student);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Server error occurred');
  }
});

// Route لتحديث معلومات الطالب
StudentRoutes.put('/updateuser/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, password } = req.body;

    if (id.length !== 24) {
      return res.status(400).send('معرف غير صالح');
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.student.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: name,
          email: email,
          phoneNumber: parseInt(phoneNumber),
          password: hashedPassword,
        },
      });
    } else {
      await prisma.student.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: name,
          email: email,
          phoneNumber: parseInt(phoneNumber),
        },
      });
    }

    res.status(200).send('تم تحديث الطالب بنجاح');
  } catch (error) {
    console.error(error);
    res.status(500).send(`خطأ في تحديث الطالب ERROR: ${error}`);
  }
});

export default StudentRoutes;
