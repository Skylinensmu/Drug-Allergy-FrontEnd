import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate ,Link } from "react-router-dom";
import UserContext from './userContext';

function ModifyAllergy() {
  const { user } = useContext(UserContext);
  const modifyUser = `${user.fname} ${user.lname}`;

  const [patientAllergy, setPatientAllergy] = useState({
    ptname: "",
    ptlastname: "",
    hn: "",
    allergies: [
      { id: "", drugDetail: "", allergySymptom: "", allergyType: "" }
    ],
    statusflag: "",
    status: "",
    createdby: "",
    confirmby: "",
    modifyby: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const id = useParams();

  useEffect(() => {
    axios.get('http://localhost:3000/modify/' + id.id)
      .then((response) => {
        setPatientAllergy(response.data);
      })
      .catch((err) => console.log(err.message));
  }, [id.id]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newAllergies = patientAllergy.allergies.map((allergy, idx) =>
      idx === index ? { ...allergy, [name]: value } : allergy
    );
    setPatientAllergy({
      ...patientAllergy,
      allergies: newAllergies,
      modifyby: modifyUser
    });
  };

  const handleDeleteSection = (id) => {
    if (patientAllergy.allergies.length > 1) {
      setPatientAllergy({
        ...patientAllergy,
        allergies: patientAllergy.allergies.filter(section => section.id !== id)
      });
    } else {
      alert("You cannot delete the last section.");
    }
  };

  const handleAddSection = () => {
    const newId = patientAllergy.allergies.length + 1;
    setPatientAllergy({
      ...patientAllergy,
      allergies: [...patientAllergy.allergies, { id: newId, drugDetail: '', allergySymptom: '', allergyType: 'Allergy' }]
    });
  };

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if any required fields are blank
    if (
      !patientAllergy.ptname ||
      !patientAllergy.ptlastname ||
      !patientAllergy.hn ||
      patientAllergy.allergies.some(section => !section.drugDetail || !section.allergySymptom)
    ) {
      setModalOpen(true);
      return;
    }

    axios.patch('http://localhost:3000/modify/' + id.id, patientAllergy)
      .then((response) => {
        console.log(response.data)
        navigate('/Nursingworklist');
      })
      .catch((err) => console.log(err.message))
  }

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="ptname">First Name</label>
        <input type="text" id="ptname" name="ptname" value={patientAllergy.ptname} onChange={(e) => setPatientAllergy({ ...patientAllergy, ptname: e.target.value })} />
        <label htmlFor="ptlastname">Last Name</label>
        <input type="text" id="ptlastname" name="ptlastname" value={patientAllergy.ptlastname} onChange={(e) => setPatientAllergy({ ...patientAllergy, ptlastname: e.target.value })} />
        <label htmlFor="hn">HN</label>
        <input type="text" id="hn" name="hn" value={patientAllergy.hn} onChange={(e) => setPatientAllergy({ ...patientAllergy, hn: e.target.value })} />
      </div>
      {patientAllergy.allergies.map((section, index) => (
        <div key={index}>
          <label htmlFor={`drug${index}`}>Drug Detail {index + 1}</label>
          <input type="text" id={`drug${index}`} name="drugDetail" value={section.drugDetail} onChange={(e) => handleChange(index, e)} />
          <label htmlFor={`symptom${index}`}>Allergy Symptom</label>
          <input type="text" id={`symptom${index}`} name="allergySymptom" value={section.allergySymptom} onChange={(e) => handleChange(index, e)} />
          <label htmlFor={`allergyType${index}`}>Allergy Type</label>
          <select id={`allergyType${index}`} name="allergyType" value={section.allergyType} onChange={(e) => handleChange(index, e)}>
            <option value="Allergy">Allergy</option>
            <option value="Side Effect">Side Effect</option>
            <option value="Suspect">Suspect</option>
          </select>
          <button type="button" onClick={() => handleDeleteSection(section.id)}>Delete</button>
        </div>
      ))}
      <div>
        <button type="button" onClick={handleAddSection}>Add More Allergy record</button>
        <button type="submit">Submit</button>
        <Link to ="/nursingworklist"><button type="button">cancel</button></Link>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>Please fill in all required fields.</p>
          </div>
        </div>
      )}
    </form>
  );
}

export default ModifyAllergy;
