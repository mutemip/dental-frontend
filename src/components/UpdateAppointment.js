import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateAppointment.css';

function UpdateAppointment() {
  const { id } = useParams();
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [clinic, setClinic] = useState('');
  const [procedure, setProcedure] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/appointments/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setPatient(data.patient);
        setDoctor(data.doctor);
        setClinic(data.clinic);
        setProcedure(data.procedure);
        setDate(data.date);
      } catch (err) {
        console.error('Failed to load appointment');
      }
    };

    fetchAppointment();
  }, [id]);

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/appointments/${id}/`,
        {
          patient,
          doctor,
          clinic,
          procedure,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update appointment');
    }
  };

  return (
    <div className="update-appointment-container">
      <h2>Update Appointment</h2>
      <form onSubmit={handleUpdateAppointment} className="update-appointment-form">
        <div>
          <label>Patient</label>
          <input type="text" value={patient} onChange={(e) => setPatient(e.target.value)} required />
        </div>
        <div>
          <label>Doctor</label>
          <input type="text" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
        </div>
        <div>
          <label>Clinic</label>
          <input type="text" value={clinic} onChange={(e) => setClinic(e.target.value)} required />
        </div>
        <div>
          <label>Procedure</label>
          <input type="text" value={procedure} onChange={(e) => setProcedure(e.target.value)} required />
        </div>
        <div>
          <label>Date</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit">Update Appointment</button>
      </form>
    </div>
  );
}

export default UpdateAppointment;
