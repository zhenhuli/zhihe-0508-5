import { useState } from 'react';

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = () => {
    if (editName.trim()) {
      onEdit(task.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(task.name);
      setIsEditing(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="checkmark"></span>
      </label>
      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <>
            <span className="task-name">{task.name}</span>
            {task.completed && task.completedAt && (
              <span className="task-time">✓ {formatTime(task.completedAt)}</span>
            )}
          </>
        )}
      </div>
      <div className="task-actions">
        {!isEditing ? (
          <>
            <button
              className="action-btn edit-btn"
              onClick={() => setIsEditing(true)}
              title="编辑"
            >
              ✏️
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onDelete(task.id)}
              title="删除"
            >
              🗑️
            </button>
          </>
        ) : (
          <button
            className="action-btn save-btn"
            onClick={handleSave}
            title="保存"
          >
            ✓
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
