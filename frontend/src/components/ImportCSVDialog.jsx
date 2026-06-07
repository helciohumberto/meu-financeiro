import { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody,
  Alert, CircularProgress, Checkbox, FormControlLabel,
  Chip, Grid,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { parseCSV, parseDate, parseValue } from '../utils/csv';
import { api } from '../services/api';

function autoDetect(headers) {
  const n = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const m = { description: '', value: '', date: '' };
  headers.forEach((h, i) => {
    const hn = n(h);
    if (!m.description && /desc|memo|hist|narr|text|bezeich|detail|referenc/.test(hn)) m.description = String(i);
    if (!m.value && /valor|value|amount|betrag|importe|debito|credito|montant|quantia/.test(hn)) m.value = String(i);
    if (!m.date && /data|date|datum|fecha/.test(hn)) m.date = String(i);
  });
  return m;
}

function getPreviewRows(csvData, mapping) {
  if (!csvData) return [];
  return csvData.rows.slice(0, 5).map((row, i) => ({
    i,
    description: mapping.description !== '' ? (row[Number(mapping.description)] || '') : '',
    value: mapping.value !== '' ? parseValue(row[Number(mapping.value)]) : NaN,
    date: mapping.date !== '' ? parseDate(row[Number(mapping.date)]) : '',
  }));
}

function buildImportRows(csvData, mapping, categoryId, negativeOnly) {
  if (!csvData || !categoryId) return [];
  return csvData.rows
    .map(row => {
      const description = mapping.description !== '' ? (row[Number(mapping.description)] || '').trim() : '';
      const rawValue = mapping.value !== '' ? parseValue(row[Number(mapping.value)]) : NaN;
      const date = mapping.date !== '' ? parseDate(row[Number(mapping.date)]) : '';
      const value = negativeOnly ? Math.abs(rawValue) : rawValue;
      return { description, value, rawValue, date };
    })
    .filter(r => {
      if (!r.description) return false;
      if (isNaN(r.value) || r.value <= 0) return false;
      if (negativeOnly && r.rawValue >= 0) return false;
      if (!r.date) return false;
      return true;
    })
    .map(({ description, value, date }) => ({ description, value, date, category: categoryId }));
}

export default function ImportCSVDialog({ open, onClose, categories, onImport }) {
  const fileRef = useRef();
  const [step, setStep] = useState(0);
  const [filename, setFilename] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [mapping, setMapping] = useState({ description: '', value: '', date: '' });
  const [categoryId, setCategoryId] = useState('');
  const [negativeOnly, setNegativeOnly] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const reset = () => {
    setStep(0);
    setFilename('');
    setCsvData(null);
    setMapping({ description: '', value: '', date: '' });
    setCategoryId('');
    setNegativeOnly(false);
    setResult(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFile = (file) => {
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = parseCSV(e.target.result);
      if (data.headers.length === 0) return;
      setCsvData(data);
      setMapping(autoDetect(data.headers));
      setStep(1);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const rows = buildImportRows(csvData, mapping, categoryId, negativeOnly);
    if (rows.length === 0) return;
    setImporting(true);
    try {
      const { data } = await api.post('/expenses/bulk', { expenses: rows });
      setResult(data);
      setStep(2);
      if (data.created > 0) onImport(data.created);
    } catch {
      setResult({ created: 0, errors: [{ row: 0, reason: 'Erro de comunicação com o servidor' }] });
      setStep(2);
    } finally {
      setImporting(false);
    }
  };

  const mappingOk = mapping.description !== '' && mapping.value !== '' && mapping.date !== '' && categoryId !== '';
  const importRows = step === 1 ? buildImportRows(csvData, mapping, categoryId, negativeOnly) : [];
  const preview = step === 1 ? getPreviewRows(csvData, mapping) : [];
  const totalRows = csvData?.rows?.length || 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {step === 0 && 'Importar CSV'}
        {step === 1 && `Mapeamento — ${filename}`}
        {step === 2 && 'Resultado da Importação'}
      </DialogTitle>

      <DialogContent>
        {step === 0 && (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
            }}
            onClick={() => fileRef.current.click()}
          >
            <UploadFileIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              Clique para selecionar o ficheiro CSV
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
              Suporta vírgula ou ponto-e-vírgula como separador
            </Typography>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              hidden
              onChange={e => handleFile(e.target.files[0])}
            />
          </Box>
        )}

        {step === 1 && csvData && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Colunas detectadas: {csvData.headers.join(' · ')} &nbsp;·&nbsp; {totalRows} linhas no ficheiro
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1.5 }}>
              <Grid item xs={4}>
                <TextField
                  select fullWidth size="small" label="Coluna → Descrição"
                  value={mapping.description}
                  onChange={e => setMapping(m => ({ ...m, description: e.target.value }))}
                >
                  <MenuItem value="">—</MenuItem>
                  {csvData.headers.map((h, i) => (
                    <MenuItem key={i} value={String(i)}>{h || `Coluna ${i + 1}`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select fullWidth size="small" label="Coluna → Valor"
                  value={mapping.value}
                  onChange={e => setMapping(m => ({ ...m, value: e.target.value }))}
                >
                  <MenuItem value="">—</MenuItem>
                  {csvData.headers.map((h, i) => (
                    <MenuItem key={i} value={String(i)}>{h || `Coluna ${i + 1}`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select fullWidth size="small" label="Coluna → Data"
                  value={mapping.date}
                  onChange={e => setMapping(m => ({ ...m, date: e.target.value }))}
                >
                  <MenuItem value="">—</MenuItem>
                  {csvData.headers.map((h, i) => (
                    <MenuItem key={i} value={String(i)}>{h || `Coluna ${i + 1}`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select fullWidth size="small" label="Categoria padrão"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <MenuItem value="">Selecione...</MenuItem>
                  {categories?.map(c => (
                    <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={negativeOnly}
                      onChange={e => setNegativeOnly(e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Apenas débitos (valores negativos → positivo)
                    </Typography>
                  }
                />
              </Grid>
            </Grid>

            {preview.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                  Pré-visualização (5 primeiras linhas)
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {preview.map((row) => (
                      <TableRow key={row.i}>
                        <TableCell>
                          {row.description || (
                            <Typography color="error" variant="caption">em falta</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {isNaN(row.value)
                            ? <Typography color="error" variant="caption">inválido</Typography>
                            : `€${Number(row.value).toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          {row.date || (
                            <Typography color="error" variant="caption">em falta</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${importRows.length} lançamentos prontos para importar`}
                color={importRows.length > 0 ? 'success' : 'default'}
                size="small"
              />
              {importRows.length < totalRows && (
                <Typography variant="caption" color="text.secondary">
                  ({totalRows - importRows.length} linhas ignoradas por dados inválidos{negativeOnly ? ' ou por serem créditos' : ''})
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {step === 2 && result && (
          <Box sx={{ pt: 1 }}>
            <Alert severity={result.created > 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {result.created} lançamento(s) importado(s) com sucesso.
            </Alert>
            {result.errors?.length > 0 && (
              <Alert severity="error">
                {result.errors.length} linha(s) com erro:
                {result.errors.slice(0, 5).map((e, i) => (
                  <div key={i}>Linha {e.row}: {e.reason}</div>
                ))}
                {result.errors.length > 5 && (
                  <div>...e mais {result.errors.length - 5} erros</div>
                )}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 0 && (
          <Button onClick={handleClose}>Cancelar</Button>
        )}
        {step === 1 && (
          <>
            <Button onClick={() => { setCsvData(null); setStep(0); }}>Voltar</Button>
            <Button onClick={handleClose} color="inherit">Cancelar</Button>
            <Button
              variant="contained"
              disabled={!mappingOk || importRows.length === 0 || importing}
              onClick={handleImport}
              startIcon={importing ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {importing ? 'A importar...' : `Importar ${importRows.length} lançamentos`}
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button onClick={reset}>Nova importação</Button>
            <Button variant="contained" onClick={handleClose}>Fechar</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
