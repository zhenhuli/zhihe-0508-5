let currentData = null;
const shareCode = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
  loadSubmissions();
});

async function loadSubmissions() {
  try {
    const response = await fetch(`/api/forms/${shareCode}/submissions`);
    
    if (!response.ok) {
      showNotFound();
      return;
    }

    currentData = await response.json();
    
    document.getElementById('loading').classList.add('hidden');
    
    if (currentData.submissions.length === 0) {
      showEmptyState();
    } else {
      renderData();
    }
  } catch (error) {
    console.error('Error:', error);
    showNotFound();
  }
}

function showNotFound() {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('not-found').classList.remove('hidden');
}

function showEmptyState() {
  document.getElementById('page-title').textContent = currentData.form.title + ' - 数据';
  document.getElementById('stats-container').classList.remove('hidden');
  document.getElementById('empty-state').classList.remove('hidden');
  
  document.getElementById('total-submissions').textContent = '0';
  document.getElementById('total-fields').textContent = currentData.form.fields.length;
  document.getElementById('share-code').textContent = shareCode;
}

function renderData() {
  const { form, submissions } = currentData;
  
  document.getElementById('page-title').textContent = form.title + ' - 数据';
  document.getElementById('stats-container').classList.remove('hidden');
  document.getElementById('data-container').classList.remove('hidden');

  document.getElementById('total-submissions').textContent = submissions.length;
  document.getElementById('total-fields').textContent = form.fields.length;
  document.getElementById('share-code').textContent = shareCode;

  const thead = document.getElementById('table-header');
  const headerRow = document.createElement('tr');
  
  headerRow.innerHTML = `
    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
    ${form.fields.map(field => `
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${field.label}</th>
    `).join('')}
    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
  `;
  thead.appendChild(headerRow);

  const tbody = document.getElementById('table-body');
  submissions.forEach((submission, index) => {
    const row = document.createElement('tr');
    row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    
    const cells = [
      `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${index + 1}</td>`
    ];

    form.fields.forEach(field => {
      let value = submission.data[field.id];
      let displayValue = value;
      let title = '';
      
      if (field.type === 'file' && value && value.url) {
        displayValue = `<a href="${value.url}" target="_blank" class="text-blue-600 hover:text-blue-800 underline">📄 ${value.originalName || '下载文件'}</a>`;
        title = value.originalName || '下载文件';
      } else if (Array.isArray(value)) {
        displayValue = value.join(', ');
        title = displayValue;
      }
      
      cells.push(`
        <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title="${title || (value ? (typeof value === 'object' ? JSON.stringify(value) : value) : '-')}">
          ${displayValue ? displayValue : '<span class="text-gray-400">-</span>'}
        </td>
      `);
    });

    cells.push(`
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${new Date(submission.submitted_at).toLocaleString()}
      </td>
    `);

    row.innerHTML = cells.join('');
    tbody.appendChild(row);
  });
}

function exportCSV() {
  if (!currentData || currentData.submissions.length === 0) {
    alert('暂无数据可导出');
    return;
  }

  const { form, submissions } = currentData;
  const headers = ['序号', ...form.fields.map(f => f.label), '提交时间'];
  
  const rows = submissions.map((submission, index) => {
    const values = form.fields.map(field => {
      let value = submission.data[field.id];
      
      if (field.type === 'file' && value && value.url) {
        value = value.originalName || value.url;
      } else if (Array.isArray(value)) {
        value = value.join(', ');
      }
      
      return value || '';
    });
    return [index + 1, ...values, new Date(submission.submitted_at).toLocaleString()];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${form.title}_数据_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
