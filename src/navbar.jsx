import { useState, useContext } from 'react';
import UserContext from './userContext';
import './modal.css'

function Navbar() {
    const { user, setUser } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);

    const welcome = `Welcome ${user.fname} ${user.lname} Role: ${user.role}`;

    const handleLogout = () => {
        setShowModal(true);
    };

    const confirmLogout = () => {
        setUser({});
        localStorage.removeItem('userData');
        setShowModal(false);
    };

    const cancelLogout = () => {
        setShowModal(false);
    };

    return (
        <div>
            <p>{welcome}</p>
            <button onClick={handleLogout}>Logout</button>

            {/* Logout Confirmation Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Are you sure you want to logout?</p>
                        <div>
                            <button onClick={confirmLogout}>Yes</button>
                            <button onClick={cancelLogout}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
