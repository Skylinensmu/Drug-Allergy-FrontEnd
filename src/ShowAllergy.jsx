import { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import { Link } from "react-router-dom";
import  './modal.css'



function ShowAllergy() {
    

    const [data, setData] = useState([]);
    const [selectdate, setSelectDate] = useState('');
    const [showModal, setShowModal] = useState(false); 
    const [itemToDelete, setItemToDelete] = useState(null); 

    useEffect(() => {
        axios.get('http://localhost:3000/allergy')
            .then((response) => {
                setData(response.data);
            })
            .catch((err) => console.log(err.message));
    }, []);

    async function handleDelete(id) {
        setItemToDelete(id);
        setShowModal(true);
    }

    function confirmDelete() {
        axios.patch('http://localhost:3000/allergy/' + itemToDelete)
            .then(() => {
                console.log('Delete data successfully');
                window.location.reload();
            })
            .catch((err) => console.log(err.message));
        setShowModal(false); // Close modal after deletion
    }

    // Function to close modal
    function closeModal() {
        setShowModal(false);
        setItemToDelete(null); 
    }

const handleselectdate = (event) => {
    const { value } = event.target;
    setSelectDate(value);
  };

const HandleSubmitdate = async(selectdate)=>{
     
        axios.get('http://localhost:3000/allergy/'+selectdate)
            .then((response) => {
                setData(response.data);
            })
            .catch((err) => console.log(err.message));

}


return (
    <div>
        <div>
        <input type="date"name="date" value={selectdate.date} onChange={handleselectdate}/>
        <button name='submitdate' onClick={()=>HandleSubmitdate(selectdate)}>Search</button>
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
                    {item.status !== 'confirm' && <td><Link to={`/modify/${item._id}`}><button>Modify</button></Link></td>}
                    {item.status !== 'confirm' && <td><button onClick={() => handleDelete(item._id)}>Delete</button></td>}
                </tr>
             ))}
            </tbody>
        </table>
        {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this item?</p>
                        <div>
                            <button onClick={confirmDelete}>Yes</button>
                            <button onClick={closeModal}>No</button>
                        </div>
                    </div>
                </div>
            )}
    
    </div>
    )
   
} 

export default ShowAllergy;
