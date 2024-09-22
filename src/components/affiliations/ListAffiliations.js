import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListAffiliations.css';

Modal.setAppElement('#root');

function ListAffiliations() {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [newAffiliation, setNewAffiliation] = useState({
    doctor: '',
    clinic: '',
    office_address: '',
    working_schedule: '',
  });

  const [updatedAffiliation, setUpdatedAffiliation] = useState(null);

  // Fetch affiliations on component mount
  useEffect(() => {
    const fetchAffiliations = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/affiliations/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAffiliations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch affiliations');
        setLoading(false);
      }
    };

    fetchAffiliations();
  }, []);

  // Modal handlers
  const openViewModal = (affiliation) => {
    setSelectedAffiliation(affiliation);
    setViewModalIsOpen(true);
  };

  const closeViewModal = () => {
    setViewModalIsOpen(false);
    setSelectedAffiliation(null);
  };

  const openUpdateModal = (affiliation) => {
    setSelectedAffiliation(affiliation);
    setUpdatedAffiliation(affiliation);  // Initialize with selected affiliation
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
    setSelectedAffiliation(null);
    setUpdatedAffiliation(null);
  };

  const openAddModal = () => {
    setAddModalIsOpen(true);
  };

  const closeAddModal = () => {
    setAddModalIsOpen(false);
    setNewAffiliation({
      doctor: '',
      clinic: '',
      office_address: '',
      working_schedule: '',
    });
  };

  // Handle adding a new affiliation
  const handleAddAffiliation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/affiliations/', newAffiliation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAffiliations([...affiliations, response.data]);
      closeAddModal();
    } catch (err) {
      console.error('Failed to add affiliation', err);
    }
  };

  // Handle updating an affiliation
  const handleUpdateAffiliation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/affiliations/${updatedAffiliation.id}/`, updatedAffiliation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAffiliations(affiliations.map((affiliation) => (affiliation.id === updatedAffiliation.id ? response.data : affiliation)));
      closeUpdateModal();
    } catch (err) {
      console.error('Failed to update affiliation', err);
    }
  };

  // Handle deleting an affiliation
  const handleDeleteAffiliation = async (id) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/affiliations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAffiliations(affiliations.filter((affiliation) => affiliation.id !== id));
    } catch (err) {
      console.error('Failed to delete affiliation', err);
    }
  };

  // Handle changes in the update form
  const handleAffiliationChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAffiliation({ ...updatedAffiliation, [name]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="affiliations-table-container">
      <h2>Available Clinic-Doctor Affiliations</h2>

      <button className="add-affiliation-button" onClick={openAddModal}>
        Add Affiliation
      </button>

      <table className="affiliations-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Clinic</th>
            <th>Office Address</th>
            <th>Working Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {affiliations.map((affiliation) => (
            <tr key={affiliation.id}>
              <td>{affiliation.doctor}</td>
              <td>{affiliation.clinic}</td>
              <td>{affiliation.office_address}</td>
              <td>{affiliation.working_schedule}</td>
              <td>
                <button className="action-button view-button" onClick={() => openViewModal(affiliation)}>
                  View
                </button>
                <button className="action-button update-button" onClick={() => openUpdateModal(affiliation)}>
                  Update
                </button>
                <button className="action-button delete-button" onClick={() => handleDeleteAffiliation(affiliation.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Affiliation Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add Affiliation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeAddModal}>
          Close
        </button>
        <h2>Add New Affiliation</h2>
        <form onSubmit={handleAddAffiliation} className="add-affiliation-form">
          <div>
            <label>Doctor</label>
            <input
              type="text"
              value={newAffiliation.doctor}
              onChange={(e) => setNewAffiliation({ ...newAffiliation, doctor: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Clinic</label>
            <input
              type="text"
              value={newAffiliation.clinic}
              onChange={(e) => setNewAffiliation({ ...newAffiliation, clinic: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Office Address</label>
            <input
              type="text"
              value={newAffiliation.office_address}
              onChange={(e) => setNewAffiliation({ ...newAffiliation, office_address: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Working Schedule</label>
            <input
              type="text"
              value={newAffiliation.working_schedule}
              onChange={(e) => setNewAffiliation({ ...newAffiliation, working_schedule: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </Modal>

      {/* View Affiliation Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Affiliation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeViewModal}>
          Close
        </button>
        {selectedAffiliation && (
          <div className="affiliation-details">
            <h2>Affiliation Details</h2>
            <p><strong>Doctor:</strong> {selectedAffiliation.doctor}</p>
            <p><strong>Clinic:</strong> {selectedAffiliation.clinic}</p>
            <p><strong>Office Address:</strong> {selectedAffiliation.office_address}</p>
            <p><strong>Working Schedule:</strong> {selectedAffiliation.working_schedule}</p>
          </div>
        )}
      </Modal>

      {/* Update Affiliation Modal */}
      <Modal
        isOpen={updateModalIsOpen}
        onRequestClose={closeUpdateModal}
        contentLabel="Update Affiliation"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button className="close-modal" onClick={closeUpdateModal}>
          Close
        </button>
        {updatedAffiliation && (
          <div className="update-affiliation-form">
            <h2>Update Affiliation</h2>
            <form onSubmit={handleUpdateAffiliation}>
              <div>
                <label>Doctor</label>
                <input
                  type="text"
                  name="doctor"
                  value={updatedAffiliation.doctor}
                  onChange={handleAffiliationChange}
                  required
                />
              </div>
              <div>
                <label>Clinic</label>
                <input
                  type="text"
                  name="clinic"
                  value={updatedAffiliation.clinic}
                  onChange={handleAffiliationChange}
                  required
                />
              </div>
              <div>
                <label>Office Address</label>
                <input
                  type="text"
                  name="office_address"
                  value={updatedAffiliation.office_address}
                  onChange={handleAffiliationChange}
                  required
                />
              </div>
              <div>
                <label>Working Schedule</label>
                <input
                  type="text"
                  name="working_schedule"
                  value={updatedAffiliation.working_schedule}
                  onChange={handleAffiliationChange}
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

export default ListAffiliations;
