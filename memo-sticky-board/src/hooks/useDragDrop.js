import { useState, useCallback, useRef } from 'react';
import { SNAP_DISTANCE, NOTE_WIDTH, NOTE_HEIGHT } from '../types';

export function useDragDrop(notes, updateNote) {
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const snapToGrid = (value, gridSize = 20) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const snapToOtherNotes = (id, x, y) => {
    let newX = x;
    let newY = y;

    notes.forEach(note => {
      if (note.id === id) return;

      const otherLeft = note.x;
      const otherRight = note.x + NOTE_WIDTH;
      const otherTop = note.y;
      const otherBottom = note.y + NOTE_HEIGHT;

      const noteLeft = x;
      const noteRight = x + NOTE_WIDTH;
      const noteTop = y;
      const noteBottom = y + NOTE_HEIGHT;

      if (Math.abs(noteRight - otherLeft) < SNAP_DISTANCE) {
        newX = otherLeft - NOTE_WIDTH;
      }
      if (Math.abs(noteLeft - otherRight) < SNAP_DISTANCE) {
        newX = otherRight;
      }
      if (Math.abs(noteBottom - otherTop) < SNAP_DISTANCE) {
        newY = otherTop - NOTE_HEIGHT;
      }
      if (Math.abs(noteTop - otherBottom) < SNAP_DISTANCE) {
        newY = otherBottom;
      }

      if (Math.abs(noteLeft - otherLeft) < SNAP_DISTANCE) {
        newX = otherLeft;
      }
      if (Math.abs(noteTop - otherTop) < SNAP_DISTANCE) {
        newY = otherTop;
      }
    });

    return { x: newX, y: newY };
  };

  const handleMouseDown = useCallback((e, noteId) => {
    e.preventDefault();
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    setDraggingId(noteId);
    dragOffset.current = {
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    };
    startPos.current = { x: note.x, y: note.y };
  }, [notes]);

  const handleMouseMove = useCallback((e) => {
    if (!draggingId) return;

    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    newX = Math.max(0, newX);
    newY = Math.max(60, newY);

    const snapped = snapToOtherNotes(draggingId, newX, newY);
    
    updateNote(draggingId, {
      x: snapped.x,
      y: snapped.y,
    });
  }, [draggingId, updateNote, notes]);

  const handleMouseUp = useCallback(() => {
    if (draggingId) {
      const note = notes.find(n => n.id === draggingId);
      if (note) {
        const snappedX = snapToGrid(note.x);
        const snappedY = snapToGrid(note.y);
        updateNote(draggingId, {
          x: snappedX,
          y: snappedY,
        });
      }
    }
    setDraggingId(null);
  }, [draggingId, notes, updateNote]);

  return {
    draggingId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
