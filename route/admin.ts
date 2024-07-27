import express from 'express';
import bcrypt from "bcrypt";
import prisma from '../date/sqldata';
const admin = express.Router();

admin.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("الرجاء تقديم البريد الإلكتروني وكلمة المرور");
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (admin && bcrypt.compareSync(password, admin.password)) {
      res.status(200).send(admin);
    } else {
      res.send("الايميل او كلمة المرور خطأ").status(404)
    }
  } catch (error) {
    console.error("Login error:", error);
    res.send("حدث مشكلة في السيرفر").status(500)
  }
});

admin.post("/signup", async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;
  if (!email || !password || !name || !phoneNumber) {
    return res.status(400).send("الرجاء تقديم البريد الإلكتروني وكلمة المرور");
  }

  try {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
        username: name,
        phoneNumber: phoneNumber
      },
    });

    res.status(200).send(user);
  } catch (error) {
    console.error("Signup error:", error);
    res.send("حدث مشكلة في السيرفر").status(500)
  }
});



  admin.get("/getalladmin", async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                permissions: true
            }
        });
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).send("An error occurred while fetching admins");
    }
});

export default admin;
