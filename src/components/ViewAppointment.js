import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAppointment.css';

function ViewAppointment({ appointmentId }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointment details');
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className="view-appointment-card">
      <h2>Appointment Details</h2>
      <p><strong>Patient:</strong> {appointment.patient}</p>
      <p><strong>Doctor:</strong> {appointment.doctor}</p>
      <p><strong>Clinic:</strong> {appointment.clinic}</p>
      <p><strong>Procedure:</strong> {appointment.procedure}</p>
      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
      <p><strong>Date Booked:</strong> {new Date(appointment.date_booked).toLocaleString()}</p>
    </div>
  );
}

export default ViewAppointment;
