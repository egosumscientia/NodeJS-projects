import Product from "../Models/productModel.js";

const findproduct = async(productData)=>{

    const {name} = productData;

    try{
        if(name !== ""){
            let findProduct = await Product.find({name:name});
            
            if(findProduct.length>0){
                return(findProduct);
            }else{
                return {message: "The product does not exist"};
            }
            
        }else{
            return {message: "At least the product name is required"};
        }
    }catch(e){
        return {error: console.error(e)};
    }

};

const addproduct = async(productData)=>{
    
    const {name, description, picture, priceperunit, qtyavailable, store} = productData;

    try{
        if(name !== "" & description !== "" & picture !== "" & priceperunit !== 0 & qtyavailable !== 0 & store !== ""){
            const newProduct = new Product({
                name: name,
                description: description,
                picture:picture,
                priceperunit:priceperunit,
                qtyavailable:qtyavailable,
                store:store
            });
    
            const aNewProduct = await newProduct.save();
            console.log(aNewProduct);
            return(aNewProduct);
    
        }else{
            return {message:"There was en error adding the product"};
        };
    }catch(e){
        return {error: console.error(e)};
    }

};

const editproduct = async(productData)=>{
    
    const {name, description, picture, priceperunit, qtyavailable, store} = productData;

    try{
        if(name !== "" && description !== "" && picture !== "" && priceperunit !== 0 && qtyavailable !== 0 && store !== ""){
            const edUser = await Product.findOneAndUpdate({name:name},{description:description,picture:picture,priceperunit:priceperunit,qtyavailable:qtyavailable,store:store});
            return(edUser);
        }else{
            return {message:"All the fields are required to edit the product"};
        }     
    }catch(e){
        return {error: console.error(e)};
    };
    
    
};


const deleteproduct = async(productData)=>{
    
    const {name} = productData;

    try{
        if(name!==""){
            const delProd = await Product.deleteOne({name:name});
            console.log(delProd);
            return(delProd);
        }else{
            return {message:"There was an error deleting the product"}; 
        }
    }catch(e){
        return {error: console.error(e)};
    }

};

const productController = {
    findproduct,
    addproduct,
    editproduct,
    deleteproduct
}

export default productController;