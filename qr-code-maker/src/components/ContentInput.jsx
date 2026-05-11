import { useState } from 'react';
import { Type, Link, Mail, Phone, MapPin, FileText } from 'lucide-react';

const inputTypes = [
  { id: 'text', label: '文本', icon: Type, placeholder: '请输入文本内容...' },
  { id: 'url', label: '网址', icon: Link, placeholder: 'https://example.com' },
  { id: 'email', label: '邮箱', icon: Mail, placeholder: 'example@email.com' },
  { id: 'phone', label: '电话', icon: Phone, placeholder: '+86 138 0000 0000' },
  { id: 'location', label: '位置', icon: MapPin, placeholder: '39.9042, 116.4074' },
  { id: 'vcard', label: '名片', icon: FileText, placeholder: 'BEGIN:VCARD...' },
];

function ContentInput({ content, setContent, contentType, setContentType }) {
  const [activeType, setActiveType] = useState(contentType || 'text');

  const handleTypeChange = (type) => {
    setActiveType(type);
    setContentType(type);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const currentType = inputTypes.find(t => t.id === activeType);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon bg-indigo-50">
          <Type size={20} className="text-indigo-600" />
        </div>
        <h3 className="card-title">内容输入</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-5">
        {inputTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`btn-ghost ${
                activeType === type.id
                  ? 'btn-ghost-active'
                  : 'btn-ghost-inactive'
              }`}
            >
              <Icon size={14} />
              {type.label}
            </button>
          );
        })}
      </div>

      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={currentType?.placeholder || '请输入内容...'}
        className="input-field h-36 resize-none"
      />
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          提示：内容越长，二维码越复杂
        </span>
        <span className="text-sm font-medium text-slate-500">
          {content.length} 字符
        </span>
      </div>
    </div>
  );
}

export default ContentInput;
