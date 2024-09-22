import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddAppointment.css';  // Import the CSS file

function AddAppointment() {
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [clinic, setClinic] = useState('');
  const [procedure, setProcedure] = useState('');
  const [date, setDate] = useState('');
  const [procedures, setProcedures] = useState([]);  // Store procedure options
  const [patients, setPatients] = useState([]);  // Store patients
  const [doctors, setDoctors] = useState([]);  // Store doctors
  const [clinics, setClinics] = useState([]);  // Store clinics
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch procedure, patients, doctors, and clinics
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const proceduresResponse = await axios.get(`http://127.0.0.1:8000/api/procedures/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const patientsResponse = await axios.get(`http://127.0.0.1:8000/api/patients/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clinicsResponse = await axios.get(`http://127.0.0.1:8000/api/clinics/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProcedures(proceduresResponse.data);
        setPatients(patientsResponse.data);
        setDoctors(doctorsResponse.data);
        setClinics(clinicsResponse.data);
      } catch (err) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    const newAppointment = {
      patient,
      doctor,
      clinic,
      procedure,
      date,
    };

    try {
      await axios.post(`http://127.0.0.1:8000/api/appointments/`, newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');  
    } catch (err) {
      setError('Failed to add appointment');
    }
  };

  return (
    <div className="add-appointment-container">
      <form className="add-appointment-form" onSubmit={handleAddAppointment}>
        <h2>Add Appointment</h2>
        {error && <p>{error}</p>}
        <div>
          <label>Patient</label>
          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Doctor</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Clinic</label>
          <select
            value={clinic}
            onChange={(e) => setClinic(e.target.value)}
            required
          >
            <option value="">Select a clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Procedure</label>
          <select
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            required
          >
            <option value="">Select a procedure</option>
            {procedures.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
}

export default AddAppointment;
