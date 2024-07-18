import { useState } from "react";
import { Formik } from 'formik';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { connectDB } from "../api/routes";
import { useAuth } from '../../AuthContext';

function ConnectSQL() {
  const [output, setOutput] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    const connect = await connectDB(values);
    if (connect.status === 200) {
      Swal.fire({
        title: "Conectado exitosamente",
        text: "¡Conectado a la base de datos!",
        icon: "success"
      });
      login();  
      navigate("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "¡No pudo conectar a la base de datos!"
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ host: '', username: '', password: '', port: '' }}
        validate={values => {
          let errors = {};

          if (!values.host) {
            errors.host = 'Requerido';
          } else if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(values.host)) {
            errors.host = 'Dirección IP inválida';
          }

          if (!values.username) {
            errors.username = 'Requerido';
          } else if (!/^[a-zA-Z0-9]+$/.test(values.username)) {
            errors.username = 'El nombre de usuario solo puede contener letras y números sin espacios';
          }

          if (!values.password) {
            errors.password = 'Requerido';
          } else if (!/^[a-zA-Z0-9]+$/.test(values.password)) {
            errors.password = 'La contraseña solo puede contener letras y números sin espacios';
          }

          if (!values.port) {
            errors.port = 'Requerido';
          } else if (!/^\d{4}$/.test(values.port)) {
            errors.port = 'El puerto debe contener exactamente 4 dígitos numéricos';
          } else if (values.port !== '5432') {
            errors.port = 'El puerto solo puede ser para PostgreSQL (5432)';
          }
          

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
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
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
            <h1 className="mt-8">Conectar a PostgreSQL</h1>
            <div className="mb-5">
              <label htmlFor="host" className="block mb-2 text-sm font-medium text-gray-900">Host</label>
              <input
                type="text"
                name="host"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.host}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="127.0.0.1"
              />
              {errors.host && touched.host && <div className="text-red-500">{errors.host}</div>}
            </div>
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="john_doe"
              />
              {errors.username && touched.username && <div className="text-red-500">{errors.username}</div>}
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
              {errors.password && touched.password && <div className="text-red-500">{errors.password}</div>}
            </div>
            <div className="mb-5">
              <label htmlFor="port" className="block mb-2 text-sm font-medium text-gray-900">Puerto</label>
              <input
                type="text"
                name="port"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.port}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="5432"
              />
              {errors.port && touched.port && <div className="text-red-500">{errors.port}</div>}
            </div>
            <button type="submit" disabled={isSubmitting} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              Ejecutar
            </button>
          </form>
        )}
      </Formik>
      <pre>{output}</pre>
    </div>
  );
}

export default ConnectSQL;
