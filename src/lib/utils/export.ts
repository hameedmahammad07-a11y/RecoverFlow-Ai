export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;

  const keys = Object.keys(rows[0]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [
      keys.join(','),
      ...rows.map((row) =>
        keys
          .map((k) => {
            let val = row[k] === null || row[k] === undefined ? '' : row[k];
            if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
            return val;
          })
          .join(',')
      ),
    ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
