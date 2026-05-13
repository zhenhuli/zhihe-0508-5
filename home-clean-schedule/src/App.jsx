import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import { initialTasks } from './data/tasks';
import './App.css';

const TABS = [
  { key: 'daily', label: '每日任务', icon: '📅' },
  { key: 'weekly', label: '每周任务', icon: '📆' },
  { key: 'monthly', label: '每月任务', icon: '🗓️' },
];

function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('cleanScheduleTasks');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('cleanScheduleTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (taskId) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      for (const category of Object.keys(newTasks)) {
        const taskIndex = newTasks[category].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          newTasks[category] = [...newTasks[category]];
          newTasks[category][taskIndex] = {
            ...newTasks[category][taskIndex],
            completed: !newTasks[category][taskIndex].completed,
            completedAt: !newTasks[category][taskIndex].completed
              ? new Date().toISOString()
              : null,
          };
          break;
        }
      }
      return newTasks;
    });
  };

  const addTask = (taskName, category) => {
    const newTask = {
      id: `${category}-${Date.now()}`,
      name: taskName,
      completed: false,
      completedAt: null,
    };
    setTasks((prev) => ({
      ...prev,
      [category]: [...prev[category], newTask],
    }));
  };

  const editTask = (taskId, newName) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      for (const category of Object.keys(newTasks)) {
        const taskIndex = newTasks[category].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          newTasks[category] = [...newTasks[category]];
          newTasks[category][taskIndex] = {
            ...newTasks[category][taskIndex],
            name: newName,
          };
          break;
        }
      }
      return newTasks;
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => {
      const newTasks = { ...prev };
      for (const category of Object.keys(newTasks)) {
        const taskIndex = newTasks[category].findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          newTasks[category] = newTasks[category].filter((t) => t.id !== taskId);
          break;
        }
      }
      return newTasks;
    });
  };

  const getProgress = (category) => {
    const categoryTasks = tasks[category];
    const completed = categoryTasks.filter((t) => t.completed).length;
    return { completed, total: categoryTasks.length };
  };

  const resetCategory = (category) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].map((t) => ({
        ...t,
        completed: false,
        completedAt: null,
      })),
    }));
  };

  const currentProgress = getProgress(activeTab);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">🏠 家庭清洁计划表</h1>
          <p className="subtitle">让家更整洁，让生活更美好</p>
        </header>

        <div className="tabs">
          {TABS.map((tab) => {
            const progress = getProgress(tab.key);
            return (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-badge">
                  {progress.completed}/{progress.total}
                </span>
              </button>
            );
          })}
        </div>

        <div className="content">
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(currentProgress.completed / currentProgress.total) * 100}%`,
                }}
              />
            </div>
            <div className="progress-info">
              <span className="progress-text">
                完成进度: {currentProgress.completed}/{currentProgress.total}
              </span>
              <button
                className="reset-btn"
                onClick={() => resetCategory(activeTab)}
              >
                重置全部
              </button>
            </div>
          </div>

          <TaskList
            tasks={tasks[activeTab]}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
            onAdd={addTask}
            category={activeTab}
          />
        </div>

        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">今日已完成</span>
            <span className="stat-value">
              {tasks.daily.filter((t) => t.completed).length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">本周已完成</span>
            <span className="stat-value">
              {tasks.weekly.filter((t) => t.completed).length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">本月已完成</span>
            <span className="stat-value">
              {tasks.monthly.filter((t) => t.completed).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
