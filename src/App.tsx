import "./App.css";

import { Formik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

import { gql, useMutation, useQuery } from "@apollo/client";

import reactLogo from "./assets/react.svg";

type FormValues = {
  resort: string;
};

const GET_RESORTS = gql`
  query resorts {
    resorts {
      name
    }
  }
`;

const ADD_RESORT = gql`
  mutation AddResort($name: String!) {
    addResort(name: $name) {
      name
    }
  }
`;

function App() {
  const { data, refetch } = useQuery(GET_RESORTS);

  const resorts = data?.resorts.map((r: any) => r.name) || [];

  const [addResort] = useMutation(ADD_RESORT);

  const schema = Yup.object().shape({
    resort: Yup.string()
      .required("required")
      .max(70, "length")
      .trim()
      .notOneOf(resorts, "already exists"),
  });

  const initialValues = {
    resort: "",
  };

  const onSubmit = ({ resort }: FormValues) => {
    addResort({ variables: { name: resort } });
    refetch();
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>Ski resorts</h2>
      <ul>
        {resorts.map((r2: any) => (
          <li key={r2}>{r2}</li>
        ))}
      </ul>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isValid }) => {
          return (
            <>
              <input
                type="text"
                name="resort"
                onChange={handleChange}
                value={values.resort}
                onBlur={handleBlur}
              />
              <button type="submit" onClick={handleSubmit} disabled={!isValid}>
                Add ski resort
              </button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

export default App;
