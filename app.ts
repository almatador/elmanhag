import express from 'express';
import admin from './route/admin';
import bodyParser from 'body-parser';
import StudentRouets from './route/student';
import CountryRouter from './route/country';
import permission  from './route/permisadmin';
import curriculumRoutes from './route/Curriculum';
import TeacherRoutes from './route/teacher';
import lessonRoutes from './route/lesson'
import StudentreitRouters from './route/studentreit';
import videioRoutes from './route/video';
import liveRoutes from './route/live';
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  
app.use('/admin', admin);
app.use('/student', StudentRouets);
app.use("/Country", CountryRouter);
app.use("/permission", permission);
app.use('/curriculum', curriculumRoutes);
app.use('/teacher', TeacherRoutes) 
app.use('/video', videioRoutes);
app.use('/lesson', lessonRoutes);
app.use('/studentreit', StudentreitRouters);
app.use('/live', liveRoutes);

app.get('/', async (req, res) => {
  res.status(200).send('Server Is Online');
});

app.post('/test', async (req, res) => {
  const name = req.body;
  
  res.send({
    data: name,
  });
});

app.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

export default app;
