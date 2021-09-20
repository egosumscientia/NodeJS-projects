import express from "express";
import productController from '../Controllers/productController.js';
const productRoutes = express.Router();

//CRUD (Admin user only)
//Find
productRoutes.post('/findproduct', async(req,res)=>{
    let findProd = await productController.findproduct(req.body);
    res.json(findProd);
});

//Add
productRoutes.post('/addproduct', async(req,res)=>{
    let addProd = await productController.addproduct(req.body);
    res.json(addProd);
});

//Edit
productRoutes.post('/editproduct', async(req,res)=>{
    let editProd = await productController.editproduct(req.body);
    res.json(editProd);
});

//Delete
productRoutes.post('/deleteproduct', async(req,res)=>{
    let deleteProd = await productController.deleteproduct(req.body);
    res.json(deleteProd);
});

export default productRoutes;