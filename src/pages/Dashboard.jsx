import { useEffect, useState } from "react";
import { Formik } from 'formik';
import Swal from "sweetalert2";
import { createDB ,getAllDB, selectDB } from "../api/routes";
import Title from "../components/atoms/Title";
import GroupInputTable from "../components/molecules/GroupInputTable";

function Dashboard() {
    const [dato, setDatos] = useState([]);
    const [message, setMessage] = useState('');
    const [Change, setChange] = useState(false);

    useEffect(() => {
        async function obtener() {
            try {
                const response = await getAllDB();
                if (response.data.databases) {
                    setDatos(response.data.databases);
                    setMessage('');
                } else if (response.data.message) {
                    setMessage(response.data.message);
                    setDatos([]);
                }
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else {
                    console.log(error.message);
                }
            }
        }
        obtener();
    }, [Change]);

    const handleSubmitDatabase = async (values) => {
        try {
            const response = await createDB(values);
            if (response.status === 200) {
                Swal.fire({
                    title: "Creado exitosamente",
                    text: "¡Base de datos creada!",
                    icon: "success"
                });
            }
            console.log(response.data) 
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al intentar crear la base de datos."
            });
        }
    };

    const handleSubmitSelectDB = async (values) => {
        try {
            const response = await selectDB(values);
            console.log("IMPRIMIENDO EL RESPONSE")
            console.log(response.data)
            console.log(response.status)
            if (response.status === 200) {
                Swal.fire({
                    title: "Base de datos seleccionado",
                    text: " ",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo seleccionar la base de datos."
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al intentar seleccionar la base de datos."
            });
        }
    };

    return (
        <div className="bg-gray-100 p-8 flex justify-center items-center h-screen">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <Title msn={"Generador de base de datos"} />

                <h2 className="mb-2 text-lg font-semibold text-gray-900">Bases de datos creadas</h2>
                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                {message ? (
                    <p className="text-red-500">{message}</p>
                ) : (
                    <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
                        {dato.map((item) => (
                            <li key={item.datname}>{item.datname}</li>
                        ))}
                    </ul>
                )}
                </ul>

            <Formik
                initialValues={{ sql: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.sql) {
                        errors.sql = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmitDatabase(values);  
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label htmlFor="sql" className="block text-gray-700 mt-4">Creacion de base de datos</label>
                            <input
                                type="text"
                                name="sql"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.sql}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder=""
                            />
                            {errors.sql && touched.sql && <div className="text-red-500">{errors.sql}</div>}
                            <h4 className="mb-2 text-lg font-light text-gray-900">Sentencias aceptadas:</h4>
                            <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                                <li className="flex items-center">
                                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    CREATE DATABASE name_db;
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                    DROP DATABASE name_db;
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                                ALTER DATABASE name_db RENAME TO name_db; 
                                </li>
                            </ul>

                        </div>
                        <div className="form-group mb-6 text-left">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Crear</button>
                        </div>
                    </form>
                )}
            </Formik>

            <Formik
                initialValues={{ databaseName: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.databaseName) {
                        errors.databaseName = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmitSelectDB(values);  
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label htmlFor="databaseName" className="block text-gray-700 mt-4">Seleccion de base de datos</label>
                            <input
                                type="text"
                                name="databaseName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.databaseName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="name_db"
                            />
                            {errors.databaseName && touched.databaseName && <div className="text-red-500">{errors.databaseName}</div>}
                        </div>
                        <div className="form-group mb-6 text-left">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Seleccionar</button>
                        </div>
                    </form>
                )}
            </Formik>

                <form id="db-form-table">
                    <GroupInputTable 
                        htmlFor={"table-name"} 
                        classNameLabel={"block text-gray-700"} 
                        txt={"Nombre de la tabla"} 
                        type={"text"} id={"table-name"} 
                        name={"table-name"} 
                        value={"text"} 
                        classNameInput={"mt-2 p-2 w-full border border-gray-300 rounded-md"} 
                    /> 

                    <div id="fields-container" className="mb-4">
                        <div className="field-group flex items-center mb-2">
                            <input type="text" className="field-name flex-1 p-2 border border-gray-300 rounded-md mr-2" name="field-name" placeholder="Nombre del campo" required />
                            <select className="field-type flex-1 p-2 border border-gray-300 rounded-md mr-2" name="field-type" required>
                                <option value="VARCHAR">VARCHAR</option>
                                <option value="TEXT">TEXT</option>
                                <option value="INT">INT</option>
                                <option value="FLOAT">FLOAT</option>
                                <option value="DATE">DATE</option>
                            </select>
                            <input type="text" className="field-length flex-1 p-2 border border-gray-300 rounded-md mr-2" name="field-length" placeholder="Longitud" />
                            <select className="field-key flex-1 p-2 border border-gray-300 rounded-md" name="field-key" required>
                                <option value="PRIMARY KEY">PRIMARY KEY</option>
                                <option value="NONE">NONE</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group mb-4 text-center">
                        <button type="button" className="add-field text-blue-500 hover:underline">Agregar campo</button>
                    </div>

                    <div className="form-group text-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Crear</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Dashboard;
