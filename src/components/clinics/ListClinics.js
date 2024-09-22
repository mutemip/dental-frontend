import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListClinics.css';

Modal.setAppElement('#root');

function ListClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [updatedClinic, setUpdatedClinic] = useState(null); // Store updated clinic details

  const [newClinic, setNewClinic] = useState({
    name: '',
    city: '',
    state: '',
    phone_number: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const fetchClinics = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/clinics/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClinics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch clinics');
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const openViewModal = (clinic) => {
    setSelectedClinic(clinic);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedClinic(null);
  };

  const openUpdateModal = (clinic) => {
    setSelectedClinic(clinic);
    setUpdatedClinic(clinic); // Set initial values for the form
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedClinic(null);
    setUpdatedClinic(null); // Reset the updated clinic state
  };

  const openAddModal = () => {
    setAddModalIsOpen(true);
  };

  const closeAddModal = () => {
    setAddModalIsOpen(false);
    setNewClinic({
      name: '',
      city: '',
      state: '',
      phone_number: '',
      email: '',
      address: '',
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/clinics/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClinics(clinics.filter((clinic) => clinic.id !== id));
    } catch (err) {
      console.error('Failed to delete clinic', err);
    }
  };

  const handleUpdateClinic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/clinics/${updatedClinic.id}/`, updatedClinic, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update the clinic list with the updated details
      setClinics(clinics.map((clinic) => (clinic.id === updatedClinic.id ? response.data : clinic)));
      closeUpdateModal(); // Close the modal after update
    } catch (err) {
      console.error('Failed to update clinic', err);
    }
  };

  const handleAddClinic = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/clinics/', newClinic, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClinics([...clinics, response.data]); // Add the new clinic to the list
      closeAddModal();
    } catch (err) {
      console.error('Failed to add clinic', err);
    }
  };

  // Handle changes to the updated clinic form fields
  const handleClinicChange = (e) => {
    const { name, value } = e.target;
    setUpdatedClinic({ ...updatedClinic, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="clinics-table-container">
      <h2>Available Clinics</h2>

      <button className="add-clinic-button" onClick={openAddModal}>
        Add Clinic
      </button>

      <table className="clinics-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.id}>
              <td>{clinic.name}</td>
              <td>{clinic.city}</td>
              <td>{clinic.state}</td>
              <td>{clinic.phone_number}</td>
              <td>{clinic.email}</td>
              <td>
                <button className="action-button view-button" onClick={() => openViewModal(clinic)}>
                  View
                </button>
                <button className="action-button update-button" onClick={() => openUpdateModal(clinic)}>
                  Update
                </button>
                <button className="action-button delete-button" onClick={() => handleDelete(clinic.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Clinic Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Clinic"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeAddModal}>
          Close
        </button>
        <h2>Add New Clinic</h2>
        <form onSubmit={handleAddClinic} className="add-clinic-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={newClinic.name}
              onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              value={newClinic.city}
              onChange={(e) => setNewClinic({ ...newClinic, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label>State</label>
            <input
              type="text"
              value={newClinic.state}
              onChange={(e) => setNewClinic({ ...newClinic, state: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={newClinic.phone_number}
              onChange={(e) => setNewClinic({ ...newClinic, phone_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={newClinic.email}
              onChange={(e) => setNewClinic({ ...newClinic, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              value={newClinic.address}
              onChange={(e) => setNewClinic({ ...newClinic, address: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </Modal>

      {/* View Clinic Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Clinic"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeViewModal}>
          Close
        </button>
        {selectedClinic && (
          <div className="clinic-details">
            <h2>Clinic Details</h2>
            <p><strong>Name:</strong> {selectedClinic.name}</p>
            <p><strong>City:</strong> {selectedClinic.city}</p>
            <p><strong>State:</strong> {selectedClinic.state}</p>
            <p><strong>Phone Number:</strong> {selectedClinic.phone_number}</p>
            <p><strong>Email:</strong> {selectedClinic.email}</p>
            <p><strong>Address:</strong> {selectedClinic.address}</p>
          </div>
        )}
      </Modal>

      {/* Update Clinic Modal */}
      <Modal
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Clinic"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeUpdateModal}>
          Close
        </button>
        {updatedClinic && (
          <div className="update-clinic-form">
            <h2>Update Clinic</h2>
            <form onSubmit={handleUpdateClinic}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedClinic.name}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={updatedClinic.city}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <div>
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={updatedClinic.state}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={updatedClinic.phone_number}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedClinic.email}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={updatedClinic.address}
                  onChange={handleClinicChange}
                  required
                />
              </div>
              <button type="submit" className="save-button">Save</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ListClinics;
