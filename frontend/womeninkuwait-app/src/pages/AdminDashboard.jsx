import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingEvent, setViewingEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        bannerImage: '',
        date: '',
        time: '',
        entryFees: '',
        description: '',
        location: '',
        activityIncludes: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { logout } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/events`);
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/admin/login');
            }
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        const formDataToUpload = new FormData();
        formDataToUpload.append('bannerImage', file);

        // Don't set Content-Type manually - let axios set it with boundary
        const response = await axios.post(`${API_URL}/api/admin/upload`, formDataToUpload);

        return response.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalFormData = { ...formData };

            // Upload file if selected
            if (selectedFile) {
                const imageUrl = await uploadImage(selectedFile);
                finalFormData.bannerImage = imageUrl;
            }

            // Ensure all fields are included, even if empty
            finalFormData = {
                title: finalFormData.title,
                description: finalFormData.description,
                bannerImage: finalFormData.bannerImage || null,
                date: finalFormData.date || null,
                time: finalFormData.time || null,
                entryFees: finalFormData.entryFees || null,
                location: finalFormData.location || null,
                activityIncludes: finalFormData.activityIncludes || null
            };

            if (editingEvent) {
                await axios.put(`${API_URL}/api/admin/events/${editingEvent._id}`, finalFormData);
            } else {
                await axios.post(`${API_URL}/api/admin/events`, finalFormData);
            }
            setShowModal(false);
            setEditingEvent(null);
            resetForm();
            setSelectedFile(null);
            setImagePreview(null);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            console.error('Form data being sent:', finalFormData);
            alert('Error saving event. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title || '',
            bannerImage: event.bannerImage || '',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            time: event.time || '',
            entryFees: event.entryFees || '',
            description: event.description || '',
            location: event.location || '',
            activityIncludes: event.activityIncludes || ''
        });
        setSelectedFile(null);
        // Handle both relative paths and full URLs
        if (event.bannerImage) {
            const isFullUrl = event.bannerImage.startsWith('http://') || event.bannerImage.startsWith('https://');
            setImagePreview(isFullUrl ? event.bannerImage : `${API_URL}${event.bannerImage}`);
        } else {
            setImagePreview(null);
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`${API_URL}/api/admin/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Error deleting event. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            bannerImage: '',
            date: '',
            time: '',
            entryFees: '',
            description: '',
            location: '',
            activityIncludes: ''
        });
        setSelectedFile(null);
        setImagePreview(null);
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        resetForm();
        setShowModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleView = (event) => {
        setViewingEvent(event);
        setShowViewModal(true);
    };

    if (loading) {
        return <div className="admin-dashboard-loading">Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Event Management Dashboard</h1>
                <div className="admin-header-actions">
                    <button onClick={openCreateModal} className="btn btn-primary">
                        + Add New Event
                    </button>
                    <button onClick={() => { logout(); navigate('/admin/login'); }} className="btn btn-secondary">
                        Logout
                    </button>
                </div>
            </div>

            <div className="events-table-container">
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Entry Fees</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-events">No events found</td>
                            </tr>
                        ) : (
                            events.map((event) => (
                                <tr key={event._id}>
                                    <td>{event.title}</td>
                                    <td>{formatDate(event.date) || 'N/A'}</td>
                                    <td>{event.time || 'N/A'}</td>
                                    <td>{event.location || 'N/A'}</td>
                                    <td>{event.entryFees || 'Free'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleView(event)}
                                            className="btn btn-sm btn-view"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="btn btn-sm btn-edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="btn btn-sm btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="event-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Banner Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                {imagePreview && (
                                    <div className="image-preview-container">
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    </div>
                                )}
                                <div className="form-group" style={{ marginTop: '10px' }}>
                                    <label>Or enter image URL</label>
                                    <input
                                        type="text"
                                        value={formData.bannerImage}
                                        onChange={(e) => {
                                            setFormData({ ...formData, bannerImage: e.target.value });
                                            if (e.target.value) {
                                                // Handle both full URLs and relative paths
                                                const imageUrl = e.target.value.startsWith('http://') || 
                                                               e.target.value.startsWith('https://')
                                                               ? e.target.value
                                                               : e.target.value.startsWith('/')
                                                               ? `${API_URL}${e.target.value}`
                                                               : e.target.value;
                                                setImagePreview(imageUrl);
                                            } else {
                                                setImagePreview(null);
                                            }
                                        }}
                                        placeholder="https://example.com/image.jpg or /uploads/image.jpg"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="4"
                                    placeholder="Enter event description"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Entry Fees</label>
                                    <input
                                        type="text"
                                        value={formData.entryFees}
                                        onChange={(e) => setFormData({ ...formData, entryFees: e.target.value })}
                                        placeholder="e.g., Free, 10 KWD, 50 KWD"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Kuwait City, Venue Name"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Activity Includes</label>
                                <input
                                    type="text"
                                    value={formData.activityIncludes}
                                    onChange={(e) => setFormData({ ...formData, activityIncludes: e.target.value })}
                                    placeholder="e.g., Networking, Workshop, Q&A Session"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    {uploading ? 'Uploading...' : editingEvent ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewModal && viewingEvent && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Event Details</h2>
                            <button className="modal-close" onClick={() => setShowViewModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className="view-content">
                            {viewingEvent.bannerImage && (
                                <div className="view-image-container">
                                    <img 
                                        src={
                                            viewingEvent.bannerImage.startsWith('http://') || 
                                            viewingEvent.bannerImage.startsWith('https://')
                                                ? viewingEvent.bannerImage
                                                : `${API_URL}${viewingEvent.bannerImage}`
                                        } 
                                        alt={viewingEvent.title}
                                        className="view-image"
                                    />
                                </div>
                            )}
                            <div className="view-details">
                                <div className="view-field">
                                    <label>Title</label>
                                    <div className="view-value">{viewingEvent.title}</div>
                                </div>
                                <div className="view-field">
                                    <label>Description</label>
                                    <div className="view-value">{viewingEvent.description}</div>
                                </div>
                                <div className="view-row">
                                    <div className="view-field">
                                        <label>Date</label>
                                        <div className="view-value">{formatDate(viewingEvent.date) || 'Not specified'}</div>
                                    </div>
                                    <div className="view-field">
                                        <label>Time</label>
                                        <div className="view-value">{viewingEvent.time || 'Not specified'}</div>
                                    </div>
                                </div>
                                {viewingEvent.location && (
                                    <div className="view-field">
                                        <label>Location</label>
                                        <div className="view-value">{viewingEvent.location}</div>
                                    </div>
                                )}
                                {viewingEvent.activityIncludes && (
                                    <div className="view-field">
                                        <label>Activity Includes</label>
                                        <div className="view-value">{viewingEvent.activityIncludes}</div>
                                    </div>
                                )}
                                {viewingEvent.entryFees && (
                                    <div className="view-field">
                                        <label>Entry Fees</label>
                                        <div className="view-value">{viewingEvent.entryFees}</div>
                                    </div>
                                )}
                                {viewingEvent.createdAt && (
                                    <div className="view-field">
                                        <label>Created At</label>
                                        <div className="view-value">
                                            {new Date(viewingEvent.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                )}
                                {viewingEvent.updatedAt && (
                                    <div className="view-field">
                                        <label>Last Updated</label>
                                        <div className="view-value">
                                            {new Date(viewingEvent.updatedAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="view-actions">
                                <button 
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEdit(viewingEvent);
                                    }} 
                                    className="btn btn-primary"
                                >
                                    Edit Event
                                </button>
                                <button 
                                    onClick={() => setShowViewModal(false)} 
                                    className="btn btn-secondary"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

