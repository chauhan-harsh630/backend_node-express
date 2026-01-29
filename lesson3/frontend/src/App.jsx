import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [student, setStudent] = useState([]);

  useEffect(() => {
    axios
      .get("/api/student")
      .then((res) => {
        setStudent(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <h1>Student Data</h1>
      <p>Student: {student.length}</p>
      {student.map((st, index) => (
        <div key={st.id}>
          <p>
            Name: {st.name} Age: {st.age}
          </p>
        </div>
      ))}
    </>
  );
}

export default App;
