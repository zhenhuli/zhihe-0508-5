export default function Toolbar({ onAddNote, searchQuery, onSearchChange, noteCount }) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">📝 磁吸便利贴墙</h1>
          <span className="text-sm text-gray-500">共 {noteCount} 个便签</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索便签内容..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => onSearchChange('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <button
            onClick={onAddNote}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg font-medium"
          >
            + 新增便签
          </button>
        </div>
      </div>
    </div>
  );
}
