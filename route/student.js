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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StudentRoutes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const generateSecretKey = () => {
    return require('crypto').randomBytes(64).toString('hex');
};
StudentRoutes.get('/getstudent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.findMany({
            include: { parent: true, country: true }, // استخدام parent بدلاً من parentis و country بدلاً من Country
        });
        res.status(200).send(students);
    }
    catch (error) {
        res.status(500).send(`Error on getting students ERROR: ${error}`);
    }
}));
StudentRoutes.get('/student/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // التحقق من أن المعرف هو عدد صحيح
        if (isNaN(parseInt(id))) {
            return res.status(400).send('Invalid ID');
        }
        // البحث عن الطالب باستخدام المعرف
        const student = yield prisma.student.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                parent: true, // إحضار معلومات الوالد
                city: true, // إحضار معلومات المدينة
                country: true, // إحضار معلومات البلد
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
    }
    catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('حدث مشكلة في السيرفر');
    }
}));
StudentRoutes.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const student = yield prisma.student.findUnique({
            where: { id: Number(id) },
        });
        if (!student) {
            return res.status(404).send('الطالب غير موجود');
        }
        yield prisma.student.delete({
            where: { id: Number(id) },
        });
        res.status(200).send('تم حذف الطالب بنجاح');
    }
    catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('حدث مشكلة في السيرفر');
    }
}));
const authenticateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('الرجاء تقديم البريد الإلكتروني وكلمة المرور');
    }
    try {
        const student = yield prisma.student.findFirstOrThrow({
            where: { email },
        });
        if (!student || !bcrypt_1.default.compareSync(password, student.password)) {
            return res.status(404).send('الايميل او كلمة المرور خطأ');
        }
        req.body.student = student; // إضافة الطالب إلى كائن الطلب للاستخدام في الوظائف اللاحقة
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send('حدث مشكلة في السيرفر');
    }
});
// Middleware لتوليد وتحديث الـ secretKey
const updateSecretKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newSecretKey = require('crypto').randomBytes(64).toString('hex');
    try {
        yield prisma.student.update({
            where: { id: req.body.student.id },
            data: { secretKey: newSecretKey },
        });
        const token = jsonwebtoken_1.default.sign({ id: req.body.student.id }, newSecretKey, { expiresIn: '24h' });
        req.body.token = token;
    }
    catch (error) {
        console.error('Error updating secret key:', error);
        res.status(500).send('حدثت مشكلة في السيرفر');
    }
});
// Middleware للتحقق من الطالب المسجل في الطلب
const checkAuthenticated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('تحقق غير مصرح به');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, req.body.token);
        req.body.studentId = decoded;
    }
    catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).send('تحقق غير مصرح به');
    }
});
StudentRoutes.post('/login', authenticateStudent, updateSecretKey, (req, res) => {
    res.status(200).send({ student: req.body.student, token: req.body.token });
    console.log(req.body.token);
});
// Route لتسجيل الخروج
StudentRoutes.delete('/logout/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Assuming id is passed as a route parameter
    try {
        // Find and delete the student's secret key record
        const deletedSecretKey = yield prisma.secretKey.deleteMany({
            where: { studentId: parseInt(id) },
        });
        if (!deletedSecretKey.count || deletedSecretKey.count === 0) {
            return res.status(404).send('Secret key not found for the student.');
        }
        res.status(200).send('Logged out successfully.');
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('An error occurred while logging out.');
    }
}));
// Route لإنشاء حساب جديد
StudentRoutes.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNumber, countryId, academicYear, email, parentisName, parentisPhone, password, confPassword, cityId, image, typelan } = req.body;
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
        const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
        // Check if parent already exists
        let parentis = yield prisma.parent.findFirst({
            where: {
                name: parentisName,
            },
        });
        // If not, create a new parent
        if (!parentis) {
            parentis = yield prisma.parent.create({
                data: {
                    name: parentisName,
                    phoneNumber: parentisPhone,
                },
            });
        }
        // Create new student
        const student = yield prisma.student.create({
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
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Server error occurred');
    }
}));
// Route لتحديث معلومات الطالب
StudentRoutes.put('/updateuser/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, password } = req.body;
        if (id.length !== 24) {
            return res.status(400).send('معرف غير صالح');
        }
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield prisma.student.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hashedPassword,
                },
            });
        }
        else {
            yield prisma.student.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                },
            });
        }
        res.status(200).send('تم تحديث الطالب بنجاح');
    }
    catch (error) {
        console.error(error);
        res.status(500).send(`خطأ في تحديث الطالب ERROR: ${error}`);
    }
}));
exports.default = StudentRoutes;
