import {Router} from 'express';
const companyRoutes = Router();
import Company from '../models/CompanyModel.js';

companyRoutes.get('/', async (req, res) => {
    try {
      const data = await Company.find().sort({founded_month: -1}).limit(10);
      res.json(data);
    }
    catch(e){
      res.json(e)
    }
});

companyRoutes.get('/filterNumEmployees', async (req, res) => {
    try {
        const incomingData = req.query;
        const data = await Company.find({number_of_employees:parseInt(incomingData.numEmployees)}).limit(10);
        res.json(data);
    }
    catch(e){
      res.json(e)
    }
});

export default companyRoutes;