import { useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "./userContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [Regdata, setRegdata] = useState({
    username: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [error, setError] = useState(""); // State to hold error message

  function handleChange(event) {
    let { name, value } = event.target;

    setRegdata((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  }

  function handleSubmit() {
    Axios.post("http://localhost:3000/login", Regdata)
      .then((response) => {
        const { username, fname, lname, role, Token } = response.data;
        const userData = {
          username: username,
          fname: fname,
          lname: lname,
          role: role,
          Token: Token,
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        if (Token) {
          if (
            role === "Registered Nurse" ||
            role === "Assistant Nurse" ||
            role === "Doctor" ||
            role === "Dentist" ||
            role === "Assistant Dentist"
          ) {
            navigate("/nursingworklist");
          } else if (
            role === "Pharmacist" ||
            role === "Assistant Pharmacist"
          ) {
            navigate("/pharmacyworklist");
          } else if (role === "Administrator") {
            navigate("/adminconsole");
          }
        } else {
          // If login fails, display error message and show modal
          setError("Username or Password incorrect. Please try again.");
          setShowModal(true);
        }
      })
      .catch((err) => console.log(err.message));
  }

  const closeModal = () => {
    setShowModal(false);
    setError(""); // Reset error message
  };

  return (
    <div>
      <h1>Login Form</h1>
      <form>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={Regdata.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={Regdata.password}
          onChange={handleChange}
        />
      </form>
      <button onClick={handleSubmit}>Login</button>

      {/* Modal for displaying error message */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{error}</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
