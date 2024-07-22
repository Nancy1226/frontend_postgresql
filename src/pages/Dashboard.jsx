import React, { useEffect, useState } from "react";
import { Formik } from 'formik';
import Swal from "sweetalert2";
import axios from "axios";
import { createDB, getAllDB, getTable, selectDB, createTable, insertTabla, selectTable, analizePython } from "../api/routes";
import Title from "../components/atoms/Title";

function Dashboard() {
  const [selectedDB, setSelectedDB] = useState("postgres"); // Inicializamos con la base de datos predefinida
  const [lexicalResults, setLexicalResults] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState('');
  const [shouldFetchTables, setShouldFetchTables] = useState(false);
  const [shouldFetchDatabases, setShouldFetchDatabases] = useState(false);
  const [selectTables, setSelectTables] = useState([]);

  useEffect(() => {
    if (selectedDB && setShouldFetchDatabases) {
    fetchDatabases();
    setShouldFetchDatabases(false);
    }
  }, [selectedDB, shouldFetchDatabases ]);

  useEffect(() => {
    if (selectedDB && shouldFetchTables) {
      fetchTables();
      setShouldFetchTables(false); // Resetea el flag después de fetchear
    }
  }, [selectedDB, shouldFetchTables]);

  const fetchDatabases = async () => {
    try {
      const response = await getAllDB();
      if (response.data.databases) {
        setDatabases(response.data.databases);
        setMessage('');
      } else if (response.data.message) {
        setMessage(response.data.message);
        setDatabases([]);
      }
      console.log("imprimiendo el response ",response.data)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo realizar la operacion!"
      });
      console.error('Error fetching databases:', error);
      setMessage('Error al obtener las bases de datos');
    }
  };

  const fetchTables = async () => {
    try {
      const response = await getTable(selectedDB);
      if (response.data.tables) {
        setTables(response.data.tables);
      } else if (response.data.message) {
        setTables([]);
      }
      console.log("imprimiendo el response ",response.data )
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar ejecutar la sentencia!."
    });
      console.error('Error fetching tables:', error);
      setMessage('Error al obtener las tablas');
    }
  };

  // CREACION DE LA BASE DE DATOS
  const handleSubmitDatabase = async (values, {setSubmitting}) => {
    try {
        const response = await createDB(values);
        if(response.status == 200){
          Swal.fire({
            title: "¡Operacion ejecutado exitosamente!",
            text: "¡Se ha ejecutado exitosamente la sentencia!",
            icon: "success"
          });
          setShouldFetchDatabases(true); // Indica que se deben obtener las tablas después de crear una nueva
        }
        console.log('imprimiendo response ', response.data)
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al intentar ejecutar la sentencia!."
        });
    }finally {
      setSubmitting(false); // Restablece isSubmitting a false
    }
};

  
// SELECCION DE LA BASE DE DATOS
  const handleSubmitSelectDB = async (values) => {
    console.log(values);
    try {
      const response = await selectDB(values);
      if (response.data.message.includes('éxito')) {
        setSelectedDB(values.databaseName);
        console.log('Base de datos seleccionada:', values.databaseName);
        Swal.fire({
          title: "¡Seleccionado exitosamente!",
          text: "¡Se ha seleccionado exitosamente la base de datos!",
          icon: "success"
        });
        setShouldFetchTables(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar seleccionar la base de datos."
      });
      console.error(error);
    }
  };

  const handleSubmitCrearTable = async (values) => {
    console.log(values)
    try {
      const response = await createTable(values);
      if (response.status == 200) {
        Swal.fire({
          title: "¡Operacion ejecutado exitosamente!",
          text: "¡Se ha ejecutado exitosamente la sentencia!",
          icon: "success"
        });
        setShouldFetchTables(true); // Indica que se deben obtener las tablas después de crear una nueva
      } else {
        setMessage(response.data.message || 'Error al ejecutar la operación');
      }
      console.log('imprimiendo response ', response.data)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar ejecutar la sentencia!."
    });
      console.error('Error creating table:', error);
      setMessage('Error al ejecutar la sentencia');
    }
  };
  
  const handleSubmitInserccionTable = async (values, {setSubmitting}) => {
    try {
      const response = await insertTabla(values);
      if (response.status == 200) {
        Swal.fire({
          title: "¡Operacion ejecutado exitosamente!",
          text: "¡Se ha ejecutado exitosamente la sentencia!",
          icon: "success"
        });
      }else{
        setMessage(response.data.message || 'Error al ejecutar la operación');
      }
      console.log('imprimiendo response ', response.data)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar ejecutar la sentencia!."
    });
      console.error('Error inserction the table:', error);
      setMessage('Error al crear la operacion o inserccion');
    }finally {
      setSubmitting(false); // Restablece isSubmitting a false
    }
  };

  const handleSubmitSelectTable = async (values, {setSubmitting}) => {
    try {
      const response = await selectTable(values); // Asegúrate de que esta función esté correctamente definida
      if (response.status === 200) {
        Swal.fire({
          title: "¡Operación ejecutada exitosamente!",
          text: "¡Se ha ejecutado exitosamente la sentencia!",
          icon: "success"
        });
        setSelectTables(response.data);
        setMessage('');
      } else {
        setMessage(response.data.message || 'No hay ningún registro');
      }
      console.log('imprimiendo response', response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar ejecutar la sentencia!."
    });
      console.error('Error al seleccionar la tabla:', error);
      setMessage('Error al crear la operación o inserción');
    }finally {
      setSubmitting(false); // Restablece isSubmitting a false
    }
  };

  const performLexicalAnalysis = async (sql) => {
    try {
      const response = await analizePython(sql);
      return response.data.tokens;
    } catch (error) {
      console.error('Error performing lexical analysis:', error);
      return [];
    }
  };
  
  const renderLexicalResultsTable = () => {
    if (lexicalResults.length === 0) {
      return <p>No hay resultados léxicos para mostrar.</p>;
    }
    return (
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Token</th>
            <th className="py-2 px-4 border-b">Tipo</th>
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
    <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <Title msn={"Generador de base de datos"} className="mb-6 text-2xl font-bold text-gray-800" />

        <section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Base de Datos</h3>
          <Formik
            initialValues={{ sql: '' }}
            validate={values => {
              const errors = {};
              if (!values.sql) {
                errors.sql = 'Requerido';
              } else {
                const createRegex = /^CREATE DATABASE [a-zA-Z_]+;$/;
                const dropRegex = /^DROP DATABASE [a-zA-Z_]+;$/;
                const alterRegex = /^ALTER DATABASE [a-zA-Z_]+ RENAME TO [a-zA-Z_]+;$/;

                if (!createRegex.test(values.sql) && !dropRegex.test(values.sql) && !alterRegex.test(values.sql)) {
                  errors.sql = 'La sentencia SQL no cumple con el formato requerido.';
                }
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              console.log(values)
              const lexicalResults = await performLexicalAnalysis(values.sql);
              setLexicalResults(lexicalResults);
              handleSubmitDatabase(values, { setSubmitting });
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sql" className="block text-gray-700">Sentencia SQL</label>
                  <input
                    type="text"
                    name="sql"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sql}
                    className="mt-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="CREATE DATABASE name_db;"
                  />
                  {errors.sql && touched.sql && <div className="text-red-500">{errors.sql}</div>}
                  <h4 className="mb-2 mt-2 text-lg font-light text-gray-900">Sentencias aceptadas:</h4>
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
                <div className="text-left">
                  <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Ejecutar</button>
                </div>
              </form>
            )}
          </Formik>
        </section>

      <section className="mb-8">
         <h2 className="mb-4 text-xl font-semibold text-gray-900">Bases de datos creadas</h2>
        {message ? (
          <p className="text-red-500">{message}</p>
        ) : (
          <ul className="max-w-md space-y-1 text-gray-700 list-disc list-inside">
            {databases.map((item) => (
               <li key={item.datname} className="pl-2">{item.datname}</li>
            ))}
           </ul>
        )}
       </section>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Seleccionar Base de Datos</h3>
          <Formik
            initialValues={{ databaseName: '' }}
            validate={values => {
              const errors = {};
              if (!values.databaseName) {
                errors.databaseName = 'Requerido';
              } else {
                const regex = /^[a-zA-Z_]+$/;
                if (!regex.test(values.databaseName)) {
                  errors.databaseName = 'Solo se permiten letras y guion bajo (_).';
                }
              }
              return errors;
            }}
            onSubmit={async (values) => {
              const lexicalResults = await performLexicalAnalysis(values.databaseName);
              setLexicalResults(lexicalResults);
                handleSubmitSelectDB(values);
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="databaseName" className="block text-gray-700">Nombre de la Base de Datos</label>
                  <input
                    type="text"
                    name="databaseName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.databaseName}
                    className="mt-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name_db"
                  />
                  {errors.databaseName && touched.databaseName && <div className="text-red-500">{errors.databaseName}</div>}
                </div>
                <div className="text-left">
                  <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Seleccionar</button>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Tabla</h3>
          <Formik
            initialValues={{ sql: '', databaseName: selectedDB }}
            enableReinitialize={true}
            validate={values => {
              const errors = {};
              if (!values.sql) {
                errors.sql = 'Requerido';
              } else {
                const createTableRegex = /^CREATE TABLE [a-zA-Z_]+\s*\(\s*(?:[a-zA-Z_]+\s+(?:SERIAL|INT|VARCHAR\(\d+\)|TIMESTAMP(?: DEFAULT CURRENT_TIMESTAMP)?)(?:\s+(?:PRIMARY KEY|NOT NULL))?,?\s*)+\);$/;
                const dropTableRegex = /^DROP TABLE [a-zA-Z_]+;$/;
                const alterDatabaseRegex = /^ALTER TABLE [a-zA-Z_]+ RENAME TO [a-zA-Z_]+;$/;

                if (!createTableRegex.test(values.sql) && !dropTableRegex.test(values.sql) && !alterDatabaseRegex.test(values.sql)) {
                  errors.sql = 'La sentencia SQL no cumple con el formato requerido.';
                }
              }
              return errors;
            }}
            onSubmit={async (values, ) => {
              const lexicalResults = await performLexicalAnalysis(values.sql);
              setLexicalResults(lexicalResults);
              await handleSubmitCrearTable(values);
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sql" className="block text-gray-700">Sentencia SQL</label>
                  <textarea
                    id="sql"
                    name="sql"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sql}
                    rows={5}
                    className="mt-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="CREATE TABLE users (user_id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
                  />
                  {errors.sql && touched.sql && <div className="text-red-500">{errors.sql}</div>}
                  <h4 className="mb-2 text-lg font-light text-gray-900">Sentencias aceptadas:</h4>
                <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                  <li className="flex items-center text-xs">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    CREATE TABLE name_db (user_id SERIAL PRIMARY KEY, username VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    DROP TABLE name_db;
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    ALTER TABLE name_db RENAME TO name_db; 
                  </li>
                </ul>
                </div>
                <div className="text-left">
                  <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Crear</button>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Tablas creadas</h2>
         <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside">
           {tables && tables.length > 0 ? (
             tables.map((table, index) => (
               <li key={index}>{table}</li>
            ))
          ) : (
            <p>No hay tablas disponibles</p>
          )}
         </ul>
        </section>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Insertar Datos en la Tabla</h3>
          <Formik
            key={selectedDB}
            initialValues={{ sql: '', databaseName: selectedDB }}
            validate={values => {
              const errors = {};
              if (!values.sql) {
                errors.sql = 'Requerido';
              } else {
                  const insertRegex = /^INSERT INTO [a-zA-Z_]+\s*\([a-zA-Z_,\s]+\)\s*VALUES\s*\((?:'[^']*'|[0-9]+)(?:,\s*(?:'[^']*'|[0-9]+))*\);$/;
                  const deleteRegex = /^DELETE FROM [a-zA-Z_]+\s+WHERE\s+[^;]+;$/;
                  const updateRegex = /^UPDATE [a-zA-Z_]+\s+SET\s+[^;]+\s+WHERE\s+[^;]+;$/;
          
                  if (insertRegex.test(values.sql)) {
                      // Validación adicional para INSERT INTO
                      const columns = values.sql.match(/\(([^)]+)\)/)[1].split(',').map(col => col.trim());
                      const valuesList = values.sql.match(/VALUES\s*\(([^)]+)\)/)[1].split(',').map(val => val.trim());
          
                      if (columns.length !== valuesList.length) {
                          errors.sql = 'El número de columnas debe coincidir con el número de valores.';
                      }
                  } else if (deleteRegex.test(values.sql)) {
                      // La sentencia DELETE es válida
                  } else if (updateRegex.test(values.sql)) {
                      // La sentencia UPDATE es válida
                  } else {
                      errors.sql = 'La sentencia SQL no cumple con el formato requerido.';
                  }
              }
              return errors;
            }}
            onSubmit={async(values, { setSubmitting }) => {
              const lexicalResults = await performLexicalAnalysis(values.sql);
              setLexicalResults(lexicalResults);
              handleSubmitInserccionTable(values, { setSubmitting });
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sql" className="block text-gray-700">Sentencia SQL</label>
                  <textarea
                    id="sql"
                    name="sql"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sql}
                    rows={3}
                    className="mt-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="INSERT INTO users (user_id, username, email, created_at) VALUES (2,'john_doe', 'john.doe@example.com', '2024-12-12');"
                  />
                  {errors.sql && touched.sql && <div className="text-red-500">{errors.sql}</div>}
                  <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    INSERT INTO users (user_id, username, email, created_at) VALUES (2,'john_doe', 'john.doe@example.com', '2024-12-12');
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    UPDATE users SET email = 'john.doe_updated@example.com' WHERE user_id = 1;
                  </li>
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    DELETE FROM users WHERE user_id = 1;
                  </li>
                </ul>               
                </div>
                <div className="text-left">
                  <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Insertar</button>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Visualizar Tabla</h3>
          <Formik
            initialValues={{ sql: '' }}
            validate={values => {
              const errors = {};
              if (!values.sql) {
                errors.sql = 'Requerido';
              } else {
                const regex = /^SELECT \* FROM public.[a-zA-Z_]+;$/;
                if (!regex.test(values.sql)) {
                  errors.sql = 'La sentencia SQL no cumple con el formato requerido.';
                }
              }
              return errors;
            }}
            onSubmit={async(values, { setSubmitting }) => {
              const lexicalResults = await performLexicalAnalysis(values.sql);
              setLexicalResults(lexicalResults);
              handleSubmitSelectTable(values, { setSubmitting });
              console.log(values);
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sql" className="block text-gray-700">Sentencia SQL</label>
                  <input
                    type="text"
                    name="sql"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.sql}
                    className="mt-1 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="SELECT * FROM public.usuarios;"
                  />
                  {errors.sql && touched.sql && <div className="text-red-500">{errors.sql}</div>}
                  <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                    SELECT * FROM public.usuarios;
                  </li>
                  
                </ul>
                </div>
                <div className="text-left">
                  <button type="submit" disabled={isSubmitting || !selectedDB} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Seleccionar</button>
                </div>
              </form>
            )}
          </Formik>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Resultados de la Tabla Seleccionada</h2>
          {message ? (
            <p className="text-red-500">{message}</p>
          ) : (
            selectTables.length > 0 ? (
              <ul className="space-y-1 text-gray-700 list-disc list-inside pl-2">
                {selectTables.map((item, index) => (
                  <li key={index}>
                    {Object.keys(item).map((key) => (
                      <div key={key}><strong>{key}:</strong> {item[key]}</div>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No se ha seleccionado una tabla</p>
            )
          )}
        </section>

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