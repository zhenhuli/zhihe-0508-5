import { useState, useRef, useEffect } from 'react';
import { NOTE_COLORS, NOTE_WIDTH, NOTE_HEIGHT } from '../types';

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  onDragStart,
  onBringToFront,
  isDragging,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleContentChange = (e) => {
    onUpdate(note.id, { content: e.target.value });
  };

  const handleColorChange = (color) => {
    onUpdate(note.id, { color });
    setShowColorPicker(false);
  };

  return (
    <div
      className={`sticky-note absolute rounded-lg shadow-lg p-4 flex flex-col ${isDragging ? 'dragging' : ''}`}
      style={{
        left: note.x,
        top: note.y,
        width: NOTE_WIDTH,
        height: NOTE_HEIGHT,
        backgroundColor: note.color,
        zIndex: note.zIndex,
      }}
      onMouseDown={(e) => {
        onBringToFront(note.id);
        if (!isEditing) {
          onDragStart(e, note.id);
        }
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="relative">
          <button
            className="w-6 h-6 rounded-full border-2 border-gray-600 hover:scale-110 transition-transform"
            style={{ backgroundColor: note.color }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div className="absolute top-8 left-0 bg-white rounded-lg shadow-xl p-2 flex flex-wrap gap-1 z-50">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          )}
        </div>
        <button
          className="text-gray-600 hover:text-red-500 transition-colors"
          onClick={() => onDelete(note.id)}
        >
          ✕
        </button>
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={note.content}
          onChange={handleContentChange}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
          className="flex-1 bg-transparent resize-none outline-none w-full text-gray-700"
          placeholder="双击编辑内容..."
          maxLength={500}
        />
      ) : (
        <p className="flex-1 text-gray-700 overflow-hidden whitespace-pre-wrap break-words">
          {note.content || <span className="text-gray-400 italic">双击编辑...</span>}
        </p>
      )}

      <div className="text-xs text-gray-500 mt-2">
        {note.content.length}/500
      </div>
    </div>
  );
}
