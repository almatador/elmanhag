import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const CountryRouter = Router();
const prisma = new PrismaClient();

// إنشاء بلد جديد
CountryRouter.post('/createcountries', async (req, res) => {
  const { countryName } = req.body;
  try {
    const country = await prisma.country.create({
      data: {
        countryName: countryName
      }
    });
    res.status(201).json(country);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء البلد' });
  }
});

// قراءة جميع البلدان
CountryRouter.get('/countries', async (req, res) => {
  try {
    const countries = await prisma.country.findMany();
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان' });
  }
});

CountryRouter.get('/getcountriesandcities', async (req, res) => {
  try {
    const countriesAndCities = await prisma.country.findMany({
      include: {
        cities: true, // Assuming you have a relation defined in Prisma schema
      },
    });
    res.status(200).json(countriesAndCities);
  } catch (error) {
    console.error('Error fetching countries and cities:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان والمدن' });
  }
});

// قراءة بلد واحد حسب المعرف
CountryRouter.get('/countries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const country = await prisma.country.findUnique({
      where: { id: parseInt(id) }
    });
    if (country) {
      res.status(200).json(country);
    } else {
      res.status(404).json({ error: 'البلد غير موجود' });
    }
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلد' });
  }
});

// تحديث بلد حسب المعرف
CountryRouter.put('/countriesupdeta/:id', async (req, res) => {
  const { id } = req.body;
  const { countryName } = req.body;
  try {
    const country = await prisma.country.update({
      where: { id: parseInt(id) },
      data: { 
        countryName:  countryName 
      }
    });
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث البلد' });
  }
});

// حذف بلد حسب المعرف
CountryRouter.delete('/deletecountries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const country = await prisma.country.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء حذف البلد' });
  }
});

CountryRouter.get('/countries', async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      include: { cities: true }
    });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع البلدان' });
  }
});

// إنشاء مدينة جديدة وربطها ببلد
CountryRouter.post('/countries/:countryId/createcities', async (req, res) => {
  const { countryId } = req.params;
  const { cityName } = req.body;
  try {
    const city = await prisma.city.create({
      data: {
        cityName: cityName,
        countryId: parseInt(countryId)
      }
    });
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء المدينة' });
  }
});

// قراءة جميع المدن في بلد معين
CountryRouter.get('/countries/:countryId/cities', async (req, res) => {
  const { countryId } = req.params;
  try {
    const cities = await prisma.city.findMany({
      where: { countryId: parseInt(countryId) }
    });
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ أثناء استرجاع المدن' });
  }
});


export default CountryRouter;
