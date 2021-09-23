import express from "express";
import productController from '../Controllers/productController.js';
const productRoutes = express.Router();

//CRUD (Admin user only)
//Find
productRoutes.get('/findproduct', (req,res) => {
    res.json('GET request to the findproduct page');
});
productRoutes.post('/findproduct', async(req,res)=>{
    let findProd = await productController.findproduct(req.body);
    res.json(findProd);
});

//Add
productRoutes.get('/addproduct', (req,res) => {
    res.json('GET request to the addproduct page');
});
productRoutes.post('/addproduct', async(req,res)=>{
    let addProd = await productController.addproduct(req.body);
    res.json(addProd);
});

//Edit
productRoutes.get('/editproduct', (req,res) => {
    res.json('GET request to the editproduct page');
});
productRoutes.post('/editproduct', async(req,res)=>{
    let editProd = await productController.editproduct(req.body);
    res.json(editProd);
});

//Delete
productRoutes.get('/deleteproduct', (req,res) => {
    res.json('GET request to the deleteproduct page');
});
productRoutes.post('/deleteproduct', async(req,res)=>{
    let deleteProd = await productController.deleteproduct(req.body);
    res.json(deleteProd);
});

export default productRoutes;