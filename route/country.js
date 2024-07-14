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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const CountryRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// إنشاء بلد جديد
CountryRouter.post('/createcountries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryName } = req.body;
    try {
        const country = yield prisma.country.create({
            data: {
                countryName: countryName
            }
        });
        res.status(201).json(country);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء البلد' });
    }
}));
// قراءة جميع البلدان
CountryRouter.get('/countries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield prisma.country.findMany();
        res.status(200).json(countries);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان' });
    }
}));
CountryRouter.get('/getcountriesandcities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countriesAndCities = yield prisma.country.findMany({
            include: {
                cities: true, // Assuming you have a relation defined in Prisma schema
            },
        });
        res.status(200).json(countriesAndCities);
    }
    catch (error) {
        console.error('Error fetching countries and cities:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان والمدن' });
    }
}));
// قراءة بلد واحد حسب المعرف
CountryRouter.get('/countries/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const country = yield prisma.country.findUnique({
            where: { id: parseInt(id) }
        });
        if (country) {
            res.status(200).json(country);
        }
        else {
            res.status(404).json({ error: 'البلد غير موجود' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلد' });
    }
}));
// تحديث بلد حسب المعرف
CountryRouter.put('/countriesupdeta/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const { countryName } = req.body;
    try {
        const country = yield prisma.country.update({
            where: { id: parseInt(id) },
            data: {
                countryName: countryName
            }
        });
        res.status(200).json(country);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث البلد' });
    }
}));
// حذف بلد حسب المعرف
CountryRouter.delete('/deletecountries/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const country = yield prisma.country.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json(country);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء حذف البلد' });
    }
}));
CountryRouter.get('/countries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countries = yield prisma.country.findMany({
            include: { cities: true }
        });
        res.status(200).json(countries);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان' });
    }
}));
// إنشاء مدينة جديدة وربطها ببلد
CountryRouter.post('/countries/:countryId/createcities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryId } = req.params;
    const { cityName } = req.body;
    try {
        const city = yield prisma.city.create({
            data: {
                cityName: cityName,
                countryId: parseInt(countryId)
            }
        });
        res.status(201).json(city);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء إنشاء المدينة' });
    }
}));
// قراءة جميع المدن في بلد معين
CountryRouter.get('/countries/:countryId/cities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { countryId } = req.params;
    try {
        const cities = yield prisma.city.findMany({
            where: { countryId: parseInt(countryId) }
        });
        res.status(200).json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء استرجاع المدن' });
    }
}));
exports.default = CountryRouter;
