import { useEffect, useState, useContext } from "react";
import axios from "axios";
import moment from 'moment';
import UserContext from './userContext';

function ShowAllergyToPharmacy() {
    
    const { user } = useContext(UserContext);
    const confirmUser = `${user.fname} ${user.lname}`;

    const [data, setData] = useState([]);
    const [selectdate, setSelectDate] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAllergyId, setConfirmAllergyId] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/allergy')
            .then((response) => {
                setData(response.data);
            })
            .catch((err) => console.log(err.message));
    }, []);

    async function handleConfirm(id) {
        await axios.patch('http://localhost:3000/confirmallergy/' + id, { confirmby: confirmUser })
            .then(() => {
                console.log('Confirm Allergy successfully');
                closeConfirmModal();
                window.location.reload();
            })
            .catch((err) => console.log(err.message));
    }

    const handleselectdate = (event) => {
        const { value } = event.target;
        setSelectDate(value);
    };

    const HandleSubmitdate = async (selectdate) => {
        axios.get('http://localhost:3000/allergy/' + selectdate)
            .then((response) => {
                setData(response.data);
            })
            .catch((err) => console.log(err.message));
    };

    const openConfirmModal = (id) => {
        setConfirmAllergyId(id);
        setConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setConfirmAllergyId('');
        setConfirmModalOpen(false);
    };

    return (
        <div>
            <div>
                <input type="date" name="date" value={selectdate.date} onChange={handleselectdate} />
                <button name='submitdate' onClick={() => HandleSubmitdate(selectdate)}>Search</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>HN</th>
                        <th>Allergy</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Modified By</th>
                        <th>Confirmed By</th>
                        <th>Create date/time</th>
                        <th>Last Update</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.ptname}</td>
                            <td>{item.ptlastname}</td>
                            <td>{item.hn}</td>
                            <td>
                                {item.allergies.map((allergy, index) => (
                                    <p key={index}>No:{allergy.id}  Allergy Detail:{allergy.drugDetail}    Allergy Symptom:{allergy.allergySymptom}    Allergy Type:{allergy.allergyType}</p>
                                ))}
                            </td>
                            <td>{item.status}</td>
                            <td>{item.createdby}</td>
                            <td>{item.modifyby}</td>
                            <td>{item.confirmby}</td>
                            <td>{moment(item.createdAt).local('th').format('DD-MM-YYYY HH:mm')}</td>
                            <td>{moment(item.updatedAt).local('th').format('DD-MM-YYYY HH:mm')}</td>
                            {item.status !== 'confirm' && (
                                <td>
                                    <button onClick={() => openConfirmModal(item._id)}>Confirm Allergy</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirm Modal */}
            {confirmModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeConfirmModal}>&times;</span>
                        <p>Are you sure you want to confirm this allergy?</p>
                        <div>
                            <button onClick={() => handleConfirm(confirmAllergyId)}>Confirm</button>
                            <button onClick={closeConfirmModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowAllergyToPharmacy;
