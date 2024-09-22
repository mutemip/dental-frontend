import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Modal from 'react-modal';
import AddAppointment from './AddAppointment';
import ViewAppointment from './ViewAppointment';
import UpdateAppointment from './UpdateAppointment'; 
import ListClinics from './clinics/ListClinics';
import ListDoctors from './doctors/ListDoctors'; 
import ListPatients from './patients/ListPatients';
import ListAffiliations from './affiliations/ListAffiliations';


Modal.setAppElement('#root');

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);  
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false); 
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);  
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);  
  const navigate = useNavigate();

  // Functions to open/close modals
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openViewModal = (id) => {
    setSelectedAppointmentId(id);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedAppointmentId(null);
  };

  const openUpdateModal = (id) => {
    setSelectedAppointmentId(id);  // Set the appointment ID for updating
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedAppointmentId(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/appointments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (err) {
      console.error(`Failed to delete appointment ID: ${id}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Bright Smile Dental Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
          Logout
      </button>
      <ListClinics />
      <br />
      <br/>
      <ListDoctors />
      <br />
      <br />
      <ListAffiliations />
      <br />
      <br/>
      <ListPatients />
      <br />
      <br/>
      <div className="dashboard-header">
        <h2>Your Appointments</h2>
        
      </div>
      <button className="add-button" onClick={openModal}>
        Add Appointment
      </button>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Appointment Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeModal}>
          Close
        </button>
        <AddAppointment />
      </Modal>

      {/* View Appointment Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Appointment Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeViewModal}>
          Close
        </button>
        {selectedAppointmentId && <ViewAppointment appointmentId={selectedAppointmentId} />}
      </Modal>

      {/* Update Appointment Modal */}
      <Modal
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Appointment Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeUpdateModal}>
          Close
        </button>
        {selectedAppointmentId && <UpdateAppointment appointmentId={selectedAppointmentId} />}
      </Modal>

      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Clinic</th>
            <th>Procedure</th>
            <th>Date</th>
            <th>Date Booked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient}</td>
              <td>{appointment.doctor}</td>
              <td>{appointment.clinic}</td>
              <td>{appointment.procedure}</td>
              <td>{new Date(appointment.date).toLocaleString()}</td>
              <td>{new Date(appointment.date_booked).toLocaleString()}</td>
              <td>
                <button
                  className="action-button view-button"
                  onClick={() => openViewModal(appointment.id)}
                >
                  View
                </button>
                <button
                  className="action-button update-button"
                  onClick={() => openUpdateModal(appointment.id)}
                >
                  Update
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
