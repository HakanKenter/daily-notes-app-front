import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [existingNote, setExistingNote] = useState('');

    const fetchNoteForDate = async (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        try {
            const response = await axios.get(`http://localhost:5000/api/notes/${formattedDate}`);
            setExistingNote(response.data?.content || '');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNoteForDate(selectedDate);
    }, [selectedDate]);

    const handleSaveNote = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        try {
            await axios.post('http://localhost:5000/api/notes', { date: formattedDate, content: note });
            fetchNoteForDate(selectedDate);
            setNote('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteNote = async () => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        try {
            await axios.delete(`http://localhost:5000/api/notes/${formattedDate}`);
            setExistingNote('');
            setNote('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleCalendarChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Notes Journal</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h5>Sélectionnez une date :</h5>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                    />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="note-card card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-primary">Note pour {selectedDate.toISOString().split('T')[0]}</h5>
                            {existingNote ? (
                                <>
                                    <p className="card-text fs-5">{existingNote}</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-warning me-2" onClick={() => setNote(existingNote)}>Modifier</button>
                                        <button className="btn btn-danger" onClick={handleDeleteNote}>Supprimer</button>
                                    </div>
                                </>
                            ) : (
                                <p className="card-text">Aucune note pour cette date.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-8">
                    <textarea
                        className="form-control mb-3"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Écrire une nouvelle note..."
                    />
                    <button className="btn btn-primary" onClick={handleSaveNote}>Sauvegarder la note</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <h5>Sélectionnez un jour dans le calendrier :</h5>
                    <Calendar
                        onChange={handleCalendarChange}
                        value={selectedDate}
                        className="border rounded shadow-sm p-3"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
