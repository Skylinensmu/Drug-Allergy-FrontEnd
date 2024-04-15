import { useState } from 'react';
import Axios from 'axios';

function Register() {
  const [Regdata, setRegdata] = useState({
    username: '',
    password: '',
    fname: '',
    lname: '',
    role: 'Aministrator',
    statusflag: 'A'
  });

  const [response , setresponse] = useState('')

  function handlechange(event) {
    const { name, value } = event.target;
    setRegdata(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function handlesubmit(){
    const Regresponse  = await Axios.post('http://localhost:3000/register' , Regdata)
    setresponse(Regresponse.data);
  }

  console.log(Regdata);

  return (
    <div>
      <h1>Registration Form</h1>
      <form>
        <label>Username</label>
        <input type="text" name="username" value={Regdata.username} onChange={handlechange} />
        <label>Password</label>
        <input type="password" name="password" value={Regdata.password} onChange={handlechange} />
        <label>First Name</label>
        <input type="text" name="fname" value={Regdata.fname} onChange={handlechange} />
        <label>Last Name</label>
        <input type="text" name="lname" value={Regdata.lname} onChange={handlechange} />
        <label>Role</label>
        <select name="role" value={Regdata.role} onChange={handlechange}>
          <option value="Administrator">Administrator</option>
          <option value="Registered Nurse">Registered Nurse</option>
          <option value="Assistant Nurse">Assistant Nurse</option>
          <option value="Pharmacist">Pharmacist</option>
          <option value="Assistant Pharmacist">Assistant Pharmacist</option>
          <option value="Doctor">Doctor</option>
          <option value="Dentist">Dentist</option>
          <option value="Assistant Dentist">Assistant Dentist</option>
        </select>
      </form>
      <div>
        <button onClick={handlesubmit}>Register</button>
      </div>
      <p>{response}</p>
    </div>
  );
}

export default Register;
