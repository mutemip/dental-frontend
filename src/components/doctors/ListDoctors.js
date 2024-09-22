import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListDoctors.css';

Modal.setAppElement('#root');

function ListDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [procedures, setProcedures] = useState([]); // Store fetched procedures
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialties: '',
    email: '',
    phone_number: '',
    npi: '',
  });

  const [updatedDoctor, setUpdatedDoctor] = useState(null);

  // Fetch doctors and procedures on component mount
  useEffect(() => {
    const fetchDoctorsAndProcedures = async () => {
      const token = localStorage.getItem('access_token');
      try {
        // Fetch doctors
        const doctorsResponse = await axios.get('http://127.0.0.1:8000/api/doctors/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch procedures
        const proceduresResponse = await axios.get('http://127.0.0.1:8000/api/procedures/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDoctors(doctorsResponse.data);
        setProcedures(proceduresResponse.data); // Set fetched procedures
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchDoctorsAndProcedures();
  }, []);

  // Modal handlers
  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedDoctor(null);
  };

  const openUpdateModal = (doctor) => {
    setSelectedDoctor(doctor);
    setUpdatedDoctor(doctor);  // Initialize with selected doctor
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedDoctor(null);
    setUpdatedDoctor(null);
  };

  const openAddModal = () => {
    setAddModalIsOpen(true);
  };

  const closeAddModal = () => {
    setAddModalIsOpen(false);
    setNewDoctor({
      name: '',
      specialties: '',
      email: '',
      phone_number: '',
      npi: '',
    });
  };

  // Handle adding a new doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/doctors/', newDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors([...doctors, response.data]);
      closeAddModal();
    } catch (err) {
      console.error('Failed to add doctor', err);
    }
  };

  // Handle updating a doctor
  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/doctors/${updatedDoctor.id}/`, updatedDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctors.map((doctor) => (doctor.id === updatedDoctor.id ? response.data : doctor)));
      closeUpdateModal();
    } catch (err) {
      console.error('Failed to update doctor', err);
    }
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/doctors/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (err) {
      console.error('Failed to delete doctor', err);
    }
  };

  // Handle changes in the update form
  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctor({ ...updatedDoctor, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="doctors-table-container">
      <h2>Available Doctors</h2>

      <button className="add-doctor-button" onClick={openAddModal}>
        Add Doctor
      </button>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>NPI</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialties}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone_number}</td>
              <td>{doctor.npi}</td>
              <td>
                <button className="action-button view-button" onClick={() => openViewModal(doctor)}>
                  View
                </button>
                <button className="action-button update-button" onClick={() => openUpdateModal(doctor)}>
                  Update
                </button>
                <button className="action-button delete-button" onClick={() => handleDeleteDoctor(doctor.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Doctor"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeAddModal}>
          Close
        </button>
        <h2>Add New Doctor</h2>
        <form onSubmit={handleAddDoctor} className="add-doctor-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Specialties</label>
            <select
              value={newDoctor.specialties}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialties: e.target.value })}
              required
            >
              <option value="">Select Specialties</option>
              {procedures.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={newDoctor.email}
              onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              value={newDoctor.phone_number}
              onChange={(e) => setNewDoctor({ ...newDoctor, phone_number: e.target.value })}
              required
            />
          </div>
          <div>
            <label>NPI</label>
            <input
              type="text"
              value={newDoctor.npi}
              onChange={(e) => setNewDoctor({ ...newDoctor, npi: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </Modal>

      {/* View Doctor Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Doctor"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeViewModal}>
          Close
        </button>
        {selectedDoctor && (
          <div className="doctor-details">
            <h2>Doctor Details</h2>
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>Specialties:</strong> {selectedDoctor.specialties}</p>
            <p><strong>Email:</strong> {selectedDoctor.email}</p>
            <p><strong>Phone Number:</strong> {selectedDoctor.phone_number}</p>
            <p><strong>NPI:</strong> {selectedDoctor.npi}</p>
          </div>
        )}
      </Modal>

      {/* Update Doctor Modal */}
      <Modal
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Doctor"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeUpdateModal}>
          Close
        </button>
        {updatedDoctor && (
          <div className="update-doctor-form">
            <h2>Update Doctor</h2>
            <form onSubmit={handleUpdateDoctor}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedDoctor.name}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div>
                <label>Specialties</label>
                <select
                  name="specialties"
                  value={updatedDoctor.specialties}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Select Specialties</option>
                  {procedures.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedDoctor.email}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={updatedDoctor.phone_number}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div>
                <label>NPI</label>
                <input
                  type="text"
                  name="npi"
                  value={updatedDoctor.npi}
                  onChange={handleDoctorChange}
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

export default ListDoctors;
