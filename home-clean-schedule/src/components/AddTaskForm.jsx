import { useState } from 'react';

function AddTaskForm({ onAdd, category }) {
  const [taskName, setTaskName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAdd(taskName.trim(), category);
      setTaskName('');
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button className="add-task-btn" onClick={() => setIsExpanded(true)}>
        <span className="add-icon">+</span>
        添加新任务
      </button>
    );
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="输入任务名称..."
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        autoFocus
      />
      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={!taskName.trim()}>
          添加
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsExpanded(false)}
        >
          取消
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
