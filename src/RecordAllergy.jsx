import { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from './userContext';

function AllergyRecord() {
  const { user } = useContext(UserContext);
  const recordedUser = `${user.fname} ${user.lname}`;

  const [patientAllergy, setPatientAllergy] = useState({
    ptname: '',
    ptlastname: '',
    hn: '',
    allergies: [
      { id: 1, drugDetail: '', allergySymptom: '', allergyType: 'Allergy' }
    ],
    statusflag: "A",
    status: "Raise",
    createdby: recordedUser,
    confirmby: "",
    modifyby: ""
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddSection = () => {
    const newId = patientAllergy.allergies.length + 1;
    setPatientAllergy({
      ...patientAllergy,
      allergies: [
        ...patientAllergy.allergies,
        { id: newId, drugDetail: '', allergySymptom: '', allergyType: 'Allergy' }
      ]
    });
  };

  const handleDeleteSection = (id) => {
    if (id > 1) {
      setPatientAllergy({
        ...patientAllergy,
        allergies: patientAllergy.allergies.filter(section => section.id !== id)
      });
    } else {
      alert("You cannot delete the last section.");
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newAllergies = [...patientAllergy.allergies];
    newAllergies[index][name] = value;
    setPatientAllergy({
      ...patientAllergy,
      allergies: newAllergies
    });
  };

  const handlePatientInfoChange = (event) => {
    const { name, value } = event.target;
    setPatientAllergy({
      ...patientAllergy,
      [name]: value
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !patientAllergy.ptname ||
      !patientAllergy.ptlastname ||
      !patientAllergy.hn ||
      patientAllergy.allergies.some(section => !section.drugDetail || !section.allergySymptom)
    ) {
      handleOpenModal(); // Open the modal if any of the required fields are blank
      return;
    }
    try {
      await axios.post('http://localhost:3000/allergy', patientAllergy);
      console.log('save data successfully');
      window.location.reload();
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <form>
      <div>
        <label htmlFor="ptname">First Name</label>
        <input type="text" id="ptname" name="ptname" value={patientAllergy.ptname} onChange={handlePatientInfoChange} />
        <label htmlFor="ptlastname">Last Name</label>
        <input type="text" id="ptlastname" name="ptlastname" value={patientAllergy.ptlastname} onChange={handlePatientInfoChange} />
        <label htmlFor="hn">HN</label>
        <input type="text" id="hn" name="hn" value={patientAllergy.hn} onChange={handlePatientInfoChange} />
      </div>
      {patientAllergy.allergies.map((section, index) => (
        <div key={section.id}>
          <label htmlFor={`No${section.id}`}>No {section.id}</label>
          <label htmlFor={`drug${section.id}`}>Drug Detail</label>
          <input type="text" id={`drug${section.id}`} name="drugDetail" value={section.drugDetail} onChange={(e) => handleChange(index, e)} />
          <label htmlFor={`symptom${section.id}`}>Allergy Symptom</label>
          <input type="text" id={`symptom${section.id}`} name="allergySymptom" value={section.allergySymptom} onChange={(e) => handleChange(index, e)} />
          <label htmlFor={`allergyType${section.id}`}>Allergy Type</label>
          <select id={`allergyType${section.id}`} name="allergyType" value={section.allergyType} onChange={(e) => handleChange(index, e)}>
            <option value="Allergy">Allergy</option>
            <option value="Side Effect">Side Effect</option>
            <option value="Suspect">Suspect</option>
          </select>
          {index === patientAllergy.allergies.length - 1 && <button type="button" onClick={() => handleDeleteSection(section.id)}>Delete</button>}
        </div>
      ))}
      <div>
        <button type="button" onClick={handleAddSection}>Add More Allergy record</button>
        <button type='submit' onClick={handleSubmit}>Submit</button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Please fill in all Patient Data and Allergy detail before Save.</p>
            <button className="close" onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </form>
  );
}

export default AllergyRecord;
