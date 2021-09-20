import Product from "../Models/productModel.js";

const findproduct = async(userData)=>{
    const {name, description} = userData;

    if(name && description){
        let findProduct = await Product.find({name:name, description:description});
        console.log(findProduct);
        return(findProduct);
    };

};

const addproduct = async(userData)=>{
    const {name, description, picture, priceperunit, qtyavailable, store} = userData;

    if(name&description&picture&priceperunit&qtyavailable&store){
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
        return "There was en error adding...";
    };
};

const editproduct = async(userData)=>{
    const {name, description, picture, priceperunit, qtyavailable, store} = userData;

    if(name&description&picture&priceperunit&qtyavailable&store){
        const newProduct = new Product({
            name: name,
            description: description,
            picture:picture,
            priceperunit:priceperunit,
            qtyavailable:qtyavailable,
            store:store
        });

        const edProduct = await newProduct.findOneAndUpdate({name:name},{description:description,picture:picture,priceperunit:priceperunit,qtyavailable:qtyavailable,store:store});
        console.log(edProduct);
        return(edProduct);

    }else{
        return "there was an error editing...";
    };
};


const deleteproduct = async(userData)=>{
    const {name} = userData;

    if(name){
        const delProd = await Product.deleteMany({name:name});
        console.log(delProd);
        return(delProd);
    }else{
        return "there was an error deleting..."
    }

};

const productController = {
    findproduct,
    addproduct,
    editproduct,
    deleteproduct
}

export default productController;