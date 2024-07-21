import axios from "axios";

//Conexion base de datos
export const connectDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/connect', valores);
}

//Creacion base de datos
export const createDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/database', valores);
}

//Traer todas las bases de datos
export const getAllDB = async() =>{ 
    return await axios.get('http://localhost:3000/api/databases', {withCredentials: true});
}

//Seleccion de base de datos
export const selectDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/switch-database', valores);
}

//Creacion de tabla
export const createTable = async(valores) =>{
    return await axios.post('http://localhost:3000/api/table', valores);
}

//Traer todas las tablas creadas de la base de datos que selecciono
export const getTable = async(valores) =>{
    return await axios.get('http://localhost:3000/api/tables');
}

//Seleccion de tabla
export const selectTable = async(valores) =>{
    return await axios.post('http://localhost:3000/api/select-operation', valores);
}

//Registros en la tabla
export const insertTabla = async(valores) =>{
    return await axios.post('http://localhost:3000/api/data-operation', valores);
}
