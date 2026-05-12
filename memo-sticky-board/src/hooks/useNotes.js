import { useState, useEffect } from 'react';
import { NOTE_COLORS } from '../types';

const STORAGE_KEY = 'memo-sticky-board-notes';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Failed to parse notes from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const maxZ = Math.max(...notes.map(n => n.zIndex), 0);
    const newNote = {
      id: Date.now().toString(),
      content: '',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      zIndex: maxZ + 1,
    };
    setNotes([...notes, newNote]);
    return newNote.id;
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const bringToFront = (id) => {
    const maxZ = Math.max(...notes.map(n => n.zIndex), 0);
    setNotes(notes.map(note =>
      note.id === id ? { ...note, zIndex: maxZ + 1 } : note
    ));
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    notes: filteredNotes,
    allNotes: notes,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    bringToFront,
  };
}
