import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListPatients.css';

Modal.setAppElement('#root');

function ListPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    date_of_birth: '',
    address: '',
    phone_number: '',
    ssn_no: '',
    gender: '',
  });

  const [updatedPatient, setUpdatedPatient] = useState(null);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patients/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patients');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Modal handlers
  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedPatient(null);
  };

  const openUpdateModal = (patient) => {
    setSelectedPatient(patient);
    setUpdatedPatient(patient);  // Initialize with selected patient
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedPatient(null);
    setUpdatedPatient(null);
  };

  const openAddModal = () => {
    setAddModalIsOpen(true);
  };

  const closeAddModal = () => {
    setAddModalIsOpen(false);
    setNewPatient({
      name: '',
      date_of_birth: '',
      address: '',
      phone_number: '',
      ssn_no: '',
      gender: '',
    });
  };

  // Handle adding a new patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/patients/', newPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients([...patients, response.data]);
      closeAddModal();
    } catch (err) {
      console.error('Failed to add patient', err);
    }
  };

  // Handle updating a patient
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/patients/${updatedPatient.id}/`, updatedPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(patients.map((patient) => (patient.id === updatedPatient.id ? response.data : patient)));
      closeUpdateModal();
    } catch (err) {
      console.error('Failed to update patient', err);
    }
  };

  // Handle deleting a patient
  const handleDeletePatient = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/patients/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (err) {
      console.error('Failed to delete patient', err);
    }
  };

  // Handle changes in the update form
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPatient({ ...updatedPatient, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="patients-table-container">
      <h2>Available Patients</h2>

      <button className="add-patient-button" onClick={openAddModal}>
        Add Patient
      </button>

      <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SSN</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Gender</th>
            {/* <th>Last Visit</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.ssn_no}</td>
              <td>{patient.date_of_birth}</td>
              <td>{patient.address}</td>
              <td>{patient.phone_number}</td>
              <td>{patient.gender}</td>
              {/* <td>{patient.last_visit_date}</td> */}
              <td>
                <button className="action-button view-button" onClick={() => openViewModal(patient)}>
                  View
                </button>
                <button className="action-button update-button" onClick={() => openUpdateModal(patient)}>
                  Update
                </button>
                <button className="action-button delete-button" onClick={() => handleDeletePatient(patient.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Patient Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Patient"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeAddModal}>
          Close
        </button>
        <h2>Add New Patient</h2>
        <form onSubmit={handleAddPatient} className="add-patient-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              value={newPatient.date_of_birth}
              onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={newPatient.phone_number}
              onChange={(e) => setNewPatient({ ...newPatient, phone_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label>SSN No</label>
            <input
              type="text"
              value={newPatient.ssn_no}
              onChange={(e) => setNewPatient({ ...newPatient, ssn_no: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              value={newPatient.gender}
              onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </Modal>

      {/* View Patient Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Patient"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeViewModal}>
          Close
        </button>
        {selectedPatient && (
          <div className="patient-details">
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Date of Birth:</strong> {selectedPatient.date_of_birth}</p>
            <p><strong>Address:</strong> {selectedPatient.address}</p>
            <p><strong>Phone Number:</strong> {selectedPatient.phone_number}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
          </div>
        )}
      </Modal>

      {/* Update Patient Modal */}
      <Modal
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Patient"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeUpdateModal}>
          Close
        </button>
        {updatedPatient && (
          <div className="update-patient-form">
            <h2>Update Patient</h2>
            <form onSubmit={handleUpdatePatient}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedPatient.name}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={updatedPatient.date_of_birth}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={updatedPatient.address}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={updatedPatient.phone_number}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div>
                <label>SSN No</label>
                <input
                  type="text"
                  name="ssn_no"
                  value={updatedPatient.ssn_no}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={updatedPatient.gender}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit" className="save-button">Save</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ListPatients;
