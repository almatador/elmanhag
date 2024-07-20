import mysql from 'mysql2/promise';

// إعداد الاتصال بقاعدة البيانات
const prisma = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database'
});
export default prisma;
