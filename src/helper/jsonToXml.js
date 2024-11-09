// Helper function to convert object to XML
export default function objectToXML(obj, rootTag = 'item') {
  // Handle arrays
  if (Array.isArray(obj)) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<root>
  ${obj.map(item => objectToXML(item, rootTag)).join('\n  ')}
</root>`;
  }

  // Handle single object
  const xmlParts = [];
  xmlParts.push(`<${rootTag}>`);
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip MongoDB _id field or convert it to string
    if (key === '_id') continue;
    
    // Handle nested objects
    if (typeof value === 'object' && value !== null) {
      xmlParts.push(objectToXML(value, key));
    } else {
      // Escape special characters in XML
      const escapedValue = String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      xmlParts.push(`  <${key}>${escapedValue}</${key}>`);
    }
  }
  
  xmlParts.push(`</${rootTag}>`);
  return xmlParts.join('\n');
}