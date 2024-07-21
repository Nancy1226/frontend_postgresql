import React, { useEffect, useState } from "react";
import { Formik } from 'formik';
import Swal from "sweetalert2";
import { createDB, getAllDB, getTable, selectDB } from "../api/routes";
import Title from "../components/atoms/Title";

function Dashboard() {
  const [dato, setDatos] = useState([]);
  const [message, setMessage] = useState('');
  const [Change, setChange] = useState(false);
  const [selectedDB, setSelectedDB] = useState(null);
  const [lexicalResults, setLexicalResults] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [databaseName, setdatabaseName] = useState([]);


  useEffect(() => {
    async function obtener() {
      try {
        const response = await getAllDB();
        if (response.data.databases) {
          setDatabases(response.data.databases);
          setMessage('');
        } else if (response.data.message) {
          setMessage(response.data.message);
          setDatabases([]);
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
    async function obtenerTable() {
      try {
        const response = await getTable();
        if (response.data.tables) {
          setdatabaseName(response.data.tables);
          setMessage('');
        } else if (response.data.message) {
          setMessage(response.data.message);
          setdatabaseName([]);
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
    obtenerTable();
  }, [Change]);
  
  // CREACION DE LA BASE DE DATOS
  const handleSubmitDatabase = async (values) => {
  console.log(values)
    try {
        const response = await createDB(values);
        console.log('Imprimiendo response')
        console.log(response.data)
        console.log(response.status)
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al intentar crear la base de datos."
        });
    }
};
  
// SELECCION DE LA BASE DE DATOS
  const handleSubmitSelectDB = async (values) => {
    try {
      const response = await selectDB(values);
      console.log("IMPRIMIENDO EL RESPONSE")
      console.log(response.data)
      console.log(response.status)
      if (response.status === 200) {
        setSelectedDB(values.databaseName); // Almacenar la base de datos seleccionada
        Swal.fire({
          title: "Base de datos seleccionada",
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

  const handleSubmitCrearTable = async (values) => {
    console.log("Se llama a handleSubmitCrearTable con los valores:", values);
    try {
      const response = await createTable(values);
      console.log("IMPRIMIENDO EL RESPONSE")
      console.log(values)
      console.log(response.status)
      if (response.status === 200) {
        Swal.fire({
          title: "Creado con exito la tabla",
          text: " ",
          icon: "success"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la tabla."
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

  const fetchLexicalResults = async () => {
    if (!selectedDB) {
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: 'YOUR_SQL_QUERY_HERE' }), // Cambia esto a una consulta SQL real
        });
        const data = await response.json();
        setLexicalResults(data.tokens);
    } catch (error) {
        console.error('Error fetching lexical results:', error);
    }
};

  useEffect(() => {
    fetchLexicalResults();
  }, [selectedDB]);
  
  const renderLexicalResultsTable = () => {
    if (lexicalResults.length === 0) {
        return <p>No lexical results to display.</p>;
    }
    return (
        <table className="min-w-full bg-white border border-gray-300">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Token</th>
                    <th className="py-2 px-4 border-b">Type</th>
                </tr>
            </thead>
            <tbody>
                {lexicalResults.map((result, index) => (
                    <tr key={index}>
                        <td className="py-2 px-4 border-b">{result.token}</td>
                        <td className="py-2 px-4 border-b">{result.type}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <Title msn={"Generador de base de datos"} />

        <h2 className="mb-2 text-lg font-semibold text-gray-900">Bases de datos creadas</h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {message ? (
            <p className="text-red-500">{message}</p>
          ) : (
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
              {databases.map((item) => (
                <li key={item.datname}>{item.datname}</li>
              ))}
            </ul>
          )}
        </ul>
                    {/* CREACION DE LA BASE DE DATOS */}
        <Formik
          initialValues={{ sql: ''}}
          validate={values => {
            const errors = {};
            if (!values.sql) {
              errors.sql = 'Required';
            } else {
              // Validación personalizada para sql
              const createRegex = /^CREATE DATABASE [a-zA-Z_]+;$/;
              const dropRegex = /^DROP DATABASE [a-zA-Z_]+;$/;
              const alterRegex = /^ALTER DATABASE [a-zA-Z_]+ RENAME TO [a-zA-Z_]+;$/;

              if (!createRegex.test(values.sql) && !dropRegex.test(values.sql) && !alterRegex.test(values.sql)) {
                errors.sql = 'La sentencia SQL no cumple con el formato requerido.';
              }
            }
            
            return errors;
          }}
          onSubmit={(values) => {
            handleSubmitDatabase(values);
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
                <label htmlFor="sql" className="block text-gray-700 mt-4">Creación de base de datos</label>
                <input
                  type="text"
                  name="sql"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.sql}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="CREATE DATABASE name_db;"
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
        {/* SELECCION DE LA BASE DE DATOS */}
        <Formik
            initialValues={{ databaseName: '' }}
            validate={values => {
                const errors = {};
                if (!values.databaseName) {
                errors.databaseName = 'Required';
                } else {
                // Validación personalizada para databaseName
                const regex = /^[a-zA-Z_]+$/;  // Solo letras y guion bajo (_) permitidos
                if (!regex.test(values.databaseName)) {
                    errors.databaseName = 'Solo se permiten letras y guion bajo (_).';
                }
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
                    <label htmlFor="databaseName" className="block text-gray-700 mt-4">Selección de base de datos</label>
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

        {/* CREAR TABLA */} 
        <Formik
            key={selectedDB}
            initialValues={{ tableName: '' , databaseName: selectedDB}}
            validate={values => {
                const errors = {};
                if (!values.tableName) {
                    errors.tableName = 'Required';
                } else {
                    // Validación personalizada para tableName
                    const regex = /^CREATE TABLE [a-zA-Z_]+\s*\(\s*(?:[a-zA-Z_]+\s+(?:SERIAL|INT|VARCHAR\(\d+\))(?:\s+(?:PRIMARY KEY|NOT NULL))?,?\s*)+\);$/;
                    if (!regex.test(values.tableName)) {
                        errors.tableName = 'La sentencia SQL no cumple con el formato requerido.';
                    }
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmitCrearTable(values);
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
                    <label htmlFor="tableName" className="block text-gray-700 mt-4">Crear tabla</label>
                    <textarea
                        id="tableName"
                        name="tableName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tableName}
                        rows={10} // Número de filas visibles
                        className="mt-2 p-2 w-full h-60 border border-gray-300 rounded-md"
                        placeholder={`CREATE TABLE usuarios (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
edad INT,
email VARCHAR(100)
);`}
                    />
                    {errors.tableName && touched.tableName && <div className="text-red-500">{errors.tableName}</div>}
                    
                    <div className="form-group mb-6 text-left">
                        <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Crear
                        </button>
                    </div>
                </form>
            )}
        </Formik>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">Tablas creadas</h2>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
          {message ? (
            <p className="text-red-500">{message}</p>
          ) : (
            <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
              {databaseName.map((item, index) => (
                <li key={index}>{item}</li> // Usa el índice como clave si los elementos son únicos
              ))}
            </ul>
          )}
        </ul>

        {/* Formulario para inserción de datos */}
        <Formik
            initialValues={{ insertData: '' }}
            validate={values => {
                const errors = {};
                if (!values.insertData) {
                errors.insertData = 'Required';
                } else {
                // Regex para validar la sentencia INSERT INTO
                const regex = /^INSERT INTO [a-zA-Z_]+\s*\([a-zA-Z_,\s]+\)\s*VALUES\s*\((?:'[^']*'|[0-9]+)(?:,\s*(?:'[^']*'|[0-9]+))*\);$/;
                
                if (!regex.test(values.insertData)) {
                    errors.insertData = 'La sentencia SQL no cumple con el formato requerido.';
                } else {
                    // Validar que la cantidad de columnas coincida con la cantidad de valores
                    const columns = values.insertData.match(/\(([^)]+)\)/)[1].split(',').map(col => col.trim());
                    const valuesList = values.insertData.match(/VALUES\s*\(([^)]+)\)/)[1].split(',').map(val => val.trim());

                    if (columns.length !== valuesList.length) {
                    errors.insertData = 'El número de columnas debe coincidir con el número de valores.';
                    }
                }
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                // Handle data insertion submission
                console.log(values);
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
                    <label htmlFor="insertData" className="block text-gray-700 mt-4">Inserción de datos a la tabla</label>
                    <textarea
                    id="insertData"
                    name="insertData"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.insertData}
                    rows={3}
                    className="mt-2 p-2 w-full h-30 border border-gray-300 rounded-md"
                    placeholder="INSERT INTO usuarios (nombre, apellido, edad, email) VALUES ('Juan', 'Pérez', 30, 'juan@example.com');"
                    />
                    {errors.insertData && touched.insertData && <div className="text-red-500">{errors.insertData}</div>}
                </div>
                <div className="form-group mb-6 text-left">
                    <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Insertar</button>
                </div>
                </form>
            )}
        </Formik>


        {/* Formulario para visualización de tabla */}
        <Formik
            initialValues={{ viewTable: '' }}
            validate={values => {
                const errors = {};
                if (!values.viewTable) {
                errors.viewTable = 'Required';
                } else {
                // Regex para validar la sentencia SELECT * FROM
                const regex = /^SELECT \* FROM [a-zA-Z_]+;$/;
                if (!regex.test(values.viewTable)) {
                    errors.viewTable = 'La sentencia SQL no cumple con el formato requerido.';
                }
                }
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                // Handle table view submission
                console.log(values);
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
                    <label htmlFor="viewTable" className="block text-gray-700 mt-4">Visualizar la tabla</label>
                    <input
                    type="text"
                    name="viewTable"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.viewTable}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="SELECT * FROM usuarios;"
                    />
                    {errors.viewTable && touched.viewTable && <div className="text-red-500">{errors.viewTable}</div>}
                </div>
                <div className="form-group mb-6 text-left">
                    <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Visualizar</button>
                </div>
                </form>
            )}
            </Formik>

            {selectedDB && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Tabla de resultados léxicos</h3>
                {renderLexicalResultsTable()}
              </div>
            )}
      </div>
    </div>
  );
}

export default Dashboard;
