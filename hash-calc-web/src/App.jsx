import React, { useState, useEffect, useCallback } from 'react';
import { calculateAllHashes, calculateFileHashes } from './utils/hashUtils';

const HISTORY_STORAGE_KEY = 'hash-calc-history';

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' });
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('加载历史记录失败:', e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState('text');
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (activeTab === 'text' && inputText) {
      const timer = setTimeout(async () => {
        setLoading(true);
        const result = await calculateAllHashes(inputText);
        setHashes(result);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inputText, activeTab]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setLoading(true);
      const result = await calculateFileHashes(file);
      setHashes(result);
      setLoading(false);
    }
  }, []);

  const copyToClipboard = useCallback(async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  const saveToHistory = useCallback(() => {
    if (!hashes.md5 && !hashes.sha1 && !hashes.sha256) return;

    const newRecord = {
      id: Date.now(),
      type: activeTab,
      source: activeTab === 'text' ? (inputText.length > 50 ? inputText.substring(0, 50) + '...' : inputText) : selectedFile?.name,
      ...hashes,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    setHistory(prev => [newRecord, ...prev.slice(0, 19)]);
  }, [hashes, activeTab, inputText, selectedFile]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-white mb-2">在线哈希值计算工具</h1>
          <p className="text-white/80">支持 MD5、SHA1、SHA256 算法</p>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">历史记录</span>
            {history.length > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => { setActiveTab('text'); setSelectedFile(null); setHashes({ md5: '', sha1: '', sha256: '' }); }}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === 'text' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              文本计算
            </button>
            <button
              onClick={() => { setActiveTab('file'); setInputText(''); setHashes({ md5: '', sha1: '', sha256: '' }); }}
              className={`flex-1 py-4 px-6 font-medium transition-colors ${activeTab === 'file' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              文件计算
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'text' ? (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">输入文本</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此输入要计算哈希值的文本..."
                  className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none transition-colors"
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">选择文件</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-5xl mb-4">📁</div>
                    <p className="text-gray-600">点击或拖拽文件到此处</p>
                    {selectedFile && (
                      <p className="mt-2 text-purple-600 font-medium">
                        已选择: {selectedFile.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">计算中...</p>
              </div>
            )}

            {(hashes.md5 || hashes.sha1 || hashes.sha256) && !loading && (
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-700 text-lg">计算结果</h3>
                
                {['md5', 'sha1', 'sha256'].map((type) => (
                  <div key={type} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-600 uppercase">{type}</span>
                      <button
                        onClick={() => copyToClipboard(hashes[type], type)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${copied === type ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                      >
                        {copied === type ? '✓ 已复制' : '复制'}
                      </button>
                    </div>
                    <code className="block bg-white p-3 rounded-lg text-sm break-all font-mono text-gray-700 border">
                      {hashes[type]}
                    </code>
                  </div>
                ))}

                <button
                  onClick={saveToHistory}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  保存到历史记录
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">历史记录</h2>
              <div className="flex items-center gap-3">
                {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  清空历史
                </button>
              )}
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500">暂无历史记录</p>
                </div>
              ) : (
                history.map((record, index) => (
                  <div key={record.id} className={`p-6 ${index !== history.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${record.type === 'text' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {record.type === 'text' ? '文本' : '文件'}
                        </span>
                        <span className="text-gray-600 text-sm">{record.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">{record.timestamp}</span>
                        <button
                          onClick={() => deleteHistoryItem(record.id)}
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['md5', 'sha1', 'sha256'].map((type) => (
                        <div key={type} className="flex items-center gap-3">
                          <span className="w-16 text-xs font-medium text-gray-500 uppercase">{type}</span>
                          <code className="flex-1 text-sm text-gray-700 truncate font-mono">{record[type]}</code>
                          <button
                            onClick={() => copyToClipboard(record[type], `history-${record.id}-${type}`)}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          >
                            {copied === `history-${record.id}-${type}` ? '✓' : '复制'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
