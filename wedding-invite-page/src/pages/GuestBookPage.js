import React, { useState } from 'react';

const GuestBookPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, name: '张阿姨', message: '百年好合，永结同心！祝你们幸福美满！', avatar: '👩' },
    { id: 2, name: '李叔叔', message: '郎才女貌，天作之合！早生贵子！', avatar: '👨' },
    { id: 3, name: '小美', message: '祝福姐姐姐夫永远幸福，甜甜蜜蜜！💕', avatar: '👧' },
    { id: 4, name: '王先生', message: '祝新人新婚快乐，白头偕老！', avatar: '🧔' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newName, setNewName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && newName.trim()) {
      const avatars = ['😊', '🥰', '😇', '🤗', '😘', '💕'];
      const newMsg = {
        id: Date.now(),
        name: newName,
        message: newMessage,
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      };
      setMessages([newMsg, ...messages]);
      setNewMessage('');
      setNewName('');
    }
  };

  return (
    <div className="w-100 h-100 relative overflow-hidden bg-washed-pink">
      <div className="absolute top-0 left-0 w-100 h-100" style={{
        background: 'linear-gradient(180deg, #FFE4E9 0%, #FFC0CB 50%, #FFB6C1 100%)'
      }} />

      <div className="relative z-1 w-100 h-100 flex flex-column">
        <div className="tc pt4 pt5-m pb3">
          <h2 className="f3 f2-m dark-pink ma0" style={{ fontFamily: 'Georgia, serif' }}>
            💌 祝福语留言
          </h2>
          <p className="f6 f5-m light-pink mt2">留下您对新人的美好祝福</p>
        </div>

        <div className="px3 mb3">
          <form onSubmit={handleSubmit} className="bg-white-90 ba b--light-pink br3 pa3 shadow-2">
            <div className="mb2">
              <input
                type="text"
                placeholder="您的姓名"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-100 pa2 ba b--light-pink br2 bg-white focus-outline-none focus-b--hot-pink f6"
              />
            </div>
            <div className="mb2">
              <textarea
                placeholder="写下您的祝福..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={2}
                className="w-100 pa2 ba b--light-pink br2 bg-white focus-outline-none focus-b--hot-pink resize-none f6"
              />
            </div>
            <div className="tr">
              <button
                type="submit"
                className="bg-hot-pink white bn br-pill ph3 pv2 f6 b pointer hover-bg-dark-pink transition-all"
              >
                发送祝福 💕
              </button>
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto px3 pb4">
          <div className="flex flex-column gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white-90 ba b--light-pink br3 pa3 shadow-1"
              >
                <div className="flex items-center gap-2 mb1">
                  <span className="f4">{msg.avatar}</span>
                  <span className="f6 b dark-pink">{msg.name}</span>
                </div>
                <p className="f6 mid-gray lh-copy ma0">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestBookPage;
