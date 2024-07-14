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
const admin_1 = __importDefault(require("./route/admin"));
const body_parser_1 = __importDefault(require("body-parser"));
const student_1 = __importDefault(require("./route/student"));
const country_1 = __importDefault(require("./route/country"));
const permisadmin_1 = __importDefault(require("./route/permisadmin"));
const Curriculum_1 = __importDefault(require("./route/Curriculum"));
const teacher_1 = __importDefault(require("./route/teacher"));
const lesson_1 = __importDefault(require("./route/lesson"));
const studentreit_1 = __importDefault(require("./route/studentreit"));
const video_1 = __importDefault(require("./route/video"));
const live_1 = __importDefault(require("./route/live"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/admin', admin_1.default);
app.use('/student', student_1.default);
app.use("/Country", country_1.default);
app.use("/permission", permisadmin_1.default);
app.use('/curriculum', Curriculum_1.default);
app.use('/teacher', teacher_1.default);
app.use('/video', video_1.default);
app.use('/lesson', lesson_1.default);
app.use('/studentreit', studentreit_1.default);
app.use('/live', live_1.default);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('Server Is Online');
}));
app.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body;
    res.send({
        data: name,
    });
}));
app.listen(port, () => {
    console.log(`🚀 Server ready at: http://localhost:${port}`);
});
exports.default = app;
