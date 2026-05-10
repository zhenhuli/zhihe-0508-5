let currentForm = null;
const shareCode = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
  loadForm();
});

async function loadForm() {
  try {
    const response = await fetch(`/api/forms/${shareCode}`);
    
    if (!response.ok) {
      showNotFound();
      return;
    }

    currentForm = await response.json();
    renderForm();
  } catch (error) {
    console.error('Error:', error);
    showNotFound();
  }
}

function showNotFound() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('not-found').classList.remove('hidden');
}

function renderForm() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('form-container').classList.remove('hidden');

  document.getElementById('form-title').textContent = currentForm.title;
  document.getElementById('form-description').textContent = currentForm.description || '';

  const formContainer = document.getElementById('dynamic-form');
  formContainer.innerHTML = '';

  currentForm.fields.forEach(field => {
    const fieldElement = createFieldElement(field);
    formContainer.appendChild(fieldElement);
  });

  const submitButton = document.createElement('div');
  submitButton.innerHTML = `
    <button type="submit" id="submit-btn" class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
      提交
    </button>
  `;
  formContainer.appendChild(submitButton);

  formContainer.addEventListener('submit', handleSubmit);
}

function createFieldElement(field) {
  const fieldDiv = document.createElement('div');
  fieldDiv.className = 'field-group';

  const label = document.createElement('label');
  label.className = 'block font-medium text-gray-700 mb-2';
  label.innerHTML = `${field.label}${field.required ? '<span class="text-red-500 ml-1">*</span>' : ''}`;
  fieldDiv.appendChild(label);

  switch (field.type) {
    case 'text':
      fieldDiv.appendChild(createInputField(field, 'text'));
      break;
    case 'email':
      fieldDiv.appendChild(createInputField(field, 'email'));
      break;
    case 'number':
      fieldDiv.appendChild(createInputField(field, 'number'));
      break;
    case 'textarea':
      fieldDiv.appendChild(createTextareaField(field));
      break;
    case 'radio':
      fieldDiv.appendChild(createRadioField(field));
      break;
    case 'checkbox':
      fieldDiv.appendChild(createCheckboxField(field));
      break;
    case 'date':
      fieldDiv.appendChild(createInputField(field, 'date'));
      break;
    case 'time':
      fieldDiv.appendChild(createInputField(field, 'time'));
      break;
    case 'select':
      fieldDiv.appendChild(createSelectField(field));
      break;
    case 'file':
      fieldDiv.appendChild(createFileField(field));
      break;
  }

  return fieldDiv;
}

function createInputField(field, type) {
  const input = document.createElement('input');
  input.type = type;
  input.name = field.id;
  input.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  input.placeholder = field.placeholder || '请输入...';
  if (field.required) {
    input.required = true;
  }
  return input;
}

function createTextareaField(field) {
  const textarea = document.createElement('textarea');
  textarea.name = field.id;
  textarea.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none';
  textarea.placeholder = field.placeholder || '请输入...';
  textarea.rows = 4;
  if (field.required) {
    textarea.required = true;
  }
  return textarea;
}

function createRadioField(field) {
  const container = document.createElement('div');
  container.className = 'space-y-3';

  field.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors';
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = field.id;
    input.value = option;
    input.className = 'mr-3 h-4 w-4 text-blue-600';
    if (field.required && index === 0) {
      input.required = true;
    }

    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    container.appendChild(label);
  });

  return container;
}

function createCheckboxField(field) {
  const container = document.createElement('div');
  container.className = 'space-y-3';

  field.options.forEach(option => {
    const label = document.createElement('label');
    label.className = 'flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = field.id;
    input.value = option;
    input.className = 'mr-3 h-4 w-4 text-blue-600 rounded';

    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    container.appendChild(label);
  });

  return container;
}

function createSelectField(field) {
  const select = document.createElement('select');
  select.name = field.id;
  select.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '请选择...';
  select.appendChild(defaultOption);

  field.options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });

  if (field.required) {
    select.required = true;
  }

  return select;
}

function createFileField(field) {
  const container = document.createElement('div');
  container.className = 'file-upload-container';

  const input = document.createElement('input');
  input.type = 'file';
  input.name = field.id;
  input.className = 'hidden';
  input.id = `file-input-${field.id}`;
  
  if (field.maxSize) {
    input.dataset.maxSize = field.maxSize * 1024 * 1024;
  }
  if (field.acceptTypes) {
    input.accept = field.acceptTypes;
  }

  const preview = document.createElement('div');
  preview.id = `file-preview-${field.id}`;
  preview.className = 'mt-2 text-sm text-gray-600 hidden';

  const uploadArea = document.createElement('div');
  uploadArea.className = 'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors';
  uploadArea.innerHTML = `
    <div class="text-4xl mb-2">📎</div>
    <p class="text-gray-600">点击选择文件或拖拽到此处</p>
    ${field.maxSize ? `<p class="text-xs text-gray-400 mt-1">最大 ${field.maxSize}MB</p>` : ''}
    ${field.acceptTypes ? `<p class="text-xs text-gray-400">支持格式: ${field.acceptTypes}</p>` : ''}
  `;

  uploadArea.addEventListener('click', () => {
    input.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-blue-500', 'bg-blue-50');
  });

  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-500', 'bg-blue-50');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-500', 'bg-blue-50');
    if (e.dataTransfer.files.length > 0) {
      input.files = e.dataTransfer.files;
      handleFileSelect(field.id, input.files[0]);
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      handleFileSelect(field.id, input.files[0]);
    }
  });

  container.appendChild(uploadArea);
  container.appendChild(input);
  container.appendChild(preview);

  return container;
}

function handleFileSelect(fieldId, file) {
  const preview = document.getElementById(`file-preview-${fieldId}`);
  const fileInput = document.getElementById(`file-input-${fieldId}`);
  
  const maxSize = parseInt(fileInput.dataset.maxSize);
  if (maxSize && file.size > maxSize) {
    alert(`文件大小超过限制 (最大 ${maxSize / 1024 / 1024}MB)`);
    fileInput.value = '';
    return;
  }

  preview.classList.remove('hidden');
  preview.innerHTML = `
    <div class="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
      <div class="flex items-center">
        <span class="text-lg mr-2">📄</span>
        <span class="text-gray-700">${file.name}</span>
        <span class="text-gray-400 text-xs ml-2">(${formatFileSize(file.size)})</span>
      </div>
      <button type="button" onclick="removeFile('${fieldId}')" class="text-red-500 hover:text-red-700">
        ✕
      </button>
    </div>
  `;
}

function removeFile(fieldId) {
  const fileInput = document.getElementById(`file-input-${fieldId}`);
  const preview = document.getElementById(`file-preview-${fieldId}`);
  fileInput.value = '';
  preview.classList.add('hidden');
  preview.innerHTML = '';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function uploadFile(fieldId) {
  const fileInput = document.getElementById(`file-input-${fieldId}`);
  if (!fileInput || !fileInput.files.length) return null;

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      return {
        filename: result.filename,
        originalName: result.originalName,
        url: result.url,
        size: result.size
      };
    }
    return null;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = '提交中...';

  try {
    const formData = new FormData(e.target);
    const data = {};

    const fileFields = currentForm.fields.filter(f => f.type === 'file');
    for (const field of fileFields) {
      const fileInput = document.getElementById(`file-input-${field.id}`);
      if (fileInput && fileInput.files.length > 0) {
        const uploadedFile = await uploadFile(field.id);
        if (uploadedFile) {
          data[field.id] = uploadedFile;
        }
      }
    }

    currentForm.fields.forEach(field => {
      if (field.type === 'checkbox') {
        const values = formData.getAll(field.id);
        if (values.length > 0) {
          data[field.id] = values;
        }
      } else if (field.type !== 'file') {
        const value = formData.get(field.id);
        if (value) {
          data[field.id] = value;
        }
      }
    });

    for (const field of currentForm.fields) {
      if (field.required) {
        if (field.type === 'checkbox') {
          const values = formData.getAll(field.id);
          if (values.length === 0) {
            alert(`请选择"${field.label}"`);
            submitBtn.disabled = false;
            submitBtn.textContent = '提交';
            return;
          }
        } else if (field.type === 'file') {
          const fileInput = document.getElementById(`file-input-${field.id}`);
          if (!fileInput || !fileInput.files.length) {
            alert(`请上传"${field.label}"`);
            submitBtn.disabled = false;
            submitBtn.textContent = '提交';
            return;
          }
        } else if (!formData.get(field.id)) {
          alert(`请填写"${field.label}"`);
          submitBtn.disabled = false;
          submitBtn.textContent = '提交';
          return;
        }
      }
    }

    const response = await fetch(`/api/forms/${shareCode}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    const result = await response.json();

    if (response.ok) {
      showSuccess();
    } else {
      alert(result.error || '提交失败，请重试');
      submitBtn.disabled = false;
      submitBtn.textContent = '提交';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('提交失败，请重试');
    submitBtn.disabled = false;
    submitBtn.textContent = '提交';
  }
}

function showSuccess() {
  document.getElementById('form-container').classList.add('hidden');
  document.getElementById('success').classList.remove('hidden');
}

function resetForm() {
  document.getElementById('success').classList.add('hidden');
  renderForm();
}
