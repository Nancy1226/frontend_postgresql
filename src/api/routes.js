import axios from "axios";

export const connectDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/connect', valores)
}

export const createDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/create-database', valores)
}

export const getAllDB = async() =>{ 
    return await axios.get('http://localhost:3000/api/databases', {withCredentials: true})
}

export const selectDB = async(valores) =>{
    return await axios.post('http://localhost:3000/api/switch-database', valores)
}