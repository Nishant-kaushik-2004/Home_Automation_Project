export const downloadOptions = [
  {
    id: 'csv',
    label: 'CSV Format',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#4CAF50"/>
        <path d="M14 2v6h6" fill="#4CAF50"/>
        <path d="M4 13h16" stroke="#2E7D32" strokeWidth="2"/>
        <path d="M4 17h16" stroke="#2E7D32" strokeWidth="2"/>
        <path d="M4 9h8" stroke="#2E7D32" strokeWidth="2"/>
        <text x="8" y="19" fontSize="6" fill="#FFF" fontWeight="bold">CSV</text>
      </svg>
    ),
    extension: 'csv',
    mimeType: 'text/csv'
  },
  {
    id: 'json',
    label: 'JSON Format',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#FFA000"/>
        <path d="M14 2v6h6" fill="#FFA000"/>
        <path d="M10 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2" stroke="#F57C00" strokeWidth="2"/>
        <path d="M14 16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2" stroke="#F57C00" strokeWidth="2"/>
        <text x="7" y="19" fontSize="6" fill="#FFF" fontWeight="bold">JSON</text>
      </svg>
    ),
    extension: 'json',
    mimeType: 'application/json'
  },
  {
    id: 'xml',
    label: 'XML Format',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#2196F3"/>
        <path d="M14 2v6h6" fill="#2196F3"/>
        <path d="M8 12l3 3-3 3" stroke="#1565C0" strokeWidth="2"/>
        <path d="M16 18l-3-3 3-3" stroke="#1565C0" strokeWidth="2"/>
        <text x="8" y="19" fontSize="6" fill="#FFF" fontWeight="bold">XML</text>
      </svg>
    ),
    extension: 'xml',
    mimeType: 'application/xml'
  }
];