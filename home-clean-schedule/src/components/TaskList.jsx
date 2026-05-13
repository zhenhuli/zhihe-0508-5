import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';

function TaskList({ tasks, onToggle, onEdit, onDelete, onAdd, category }) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <AddTaskForm onAdd={onAdd} category={category} />
    </div>
  );
}

export default TaskList;
