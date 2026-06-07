export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };

  const semiCount = (lines[0].match(/;/g) || []).length;
  const commaCount = (lines[0].match(/,/g) || []).length;
  const sep = semiCount > commaCount ? ';' : ',';

  function splitRow(line) {
    const cols = [];
    let cur = '';
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === sep && !inQ) { cols.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur.trim());
    return cols;
  }

  const headers = splitRow(lines[0]);
  const rows = lines.slice(1).filter(l => l.trim()).map(splitRow);
  return { headers, rows };
}

export function parseDate(str) {
  if (!str) return '';
  const s = str.trim();
  const m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return s;
}

export function parseValue(str) {
  if (!str) return NaN;
  let s = String(str).replace(/[^0-9.,\-]/g, '').trim();
  if (!s) return NaN;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  if (lastComma > lastDot) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }

  return parseFloat(s);
}

export function exportToCSV(expenses, filename = 'despesas.csv') {
  const BOM = '﻿';
  const header = ['Descrição', 'Valor (€)', 'Data', 'Categoria'].join(';');
  const lines = expenses.map(e => [
    `"${(e.description || '').replace(/"/g, '""')}"`,
    Number(e.value).toFixed(2).replace('.', ','),
    new Date(e.date).toLocaleDateString('pt-PT'),
    `"${(e.category?.name || '').replace(/"/g, '""')}"`,
  ].join(';'));

  const csv = BOM + [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
