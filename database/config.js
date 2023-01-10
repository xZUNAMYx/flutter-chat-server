const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.set("strictQuery", false); // Solucion a error o warning 
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos por favor hablar con el admin');
    }
}

module.exports = {
    dbConnection
}