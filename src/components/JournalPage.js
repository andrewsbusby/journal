import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/journal', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEntries(res.data);
      } catch (error) {
        console.error('Error fetching entries', error);
      }
    };

    fetchEntries();
  }, []);

  const addEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/journal', { id: Date.now(), text: newEntry }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEntries([...entries, res.data]);
      setNewEntry('');
    } catch (error) {
      console.error('Error adding entry', error);
    }
  };

  const removeEntry = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/journal/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error removing entry', error);
    }
  };

  return (
    <div>
      <h2>Journal</h2>
      <div>
        <input type="text" value={newEntry} onChange={(e) => setNewEntry(e.target.value)} />
        <button onClick={addEntry}>Add Entry</button>
      </div>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            {entry.text} <button onClick={() => removeEntry(entry.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalPage;