import { useEffect } from 'react';
import StickyNote from './components/StickyNote';
import Toolbar from './components/Toolbar';
import { useNotes } from './hooks/useNotes';
import { useDragDrop } from './hooks/useDragDrop';

function App() {
  const {
    notes,
    allNotes,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    bringToFront,
  } = useNotes();

  const {
    draggingId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragDrop(allNotes, updateNote);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Toolbar
        onAddNote={addNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        noteCount={notes.length}
      />
      
      <div className="relative w-full h-screen pt-16 overflow-auto">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onDragStart={handleMouseDown}
            onBringToFront={bringToFront}
            isDragging={draggingId === note.id}
          />
        ))}
        
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-4">📝</p>
              <p className="text-xl">还没有便签</p>
              <p className="text-sm mt-2">点击右上角"新增便签"开始吧！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
