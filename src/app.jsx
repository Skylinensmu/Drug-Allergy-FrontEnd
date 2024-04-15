import { useState , useEffect } from 'react';
import { BrowserRouter , Routes, Route ,Navigate} from 'react-router-dom';
import Login from './login';
import NursingWorklist from './NursingWorklist';
import PharmacyWorklist from './PharmacyWorklist';
import UserContext from './userContext';
import Register from './register';
import ModifyAllergy from './modifyallergy';




function App() {

    const [user, setUser] = useState(() => {
      const storedUserData = localStorage.getItem('userData');
      return storedUserData ? JSON.parse(storedUserData) : {};
    });
  
    useEffect(() => {
      localStorage.setItem('userData', JSON.stringify(user));
    }, [user]);



  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/modify/:id" element={<ModifyAllergy/>} />
          <Route path="/nursingworklist" element={
            user.role === 'Registered Nurse'||
            user.role === "Assistant Nurse" ||
            user.role === "Doctor" ||
            user.role === "Dentist" ||
            user.role === "Assistant Dentist" ? <NursingWorklist /> : <Navigate to="/login" />} />
          <Route path="/pharmacyworklist" element={
            user.role === "Pharmacist" ||
            user.role === "Assistant Pharmacist"? <PharmacyWorklist /> : <Navigate to="/login" />}/>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
