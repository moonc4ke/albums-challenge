export function escapeHtml(unsafe) {
  return (unsafe ?? '')
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function tokenize(value) {
  return value
    .toLowerCase()
    .split(/[ -./\\()"',;<>~!@#$%^&*|+=[\]{}`~?:]+/)
    .filter((v) => v !== '')
    .map((v) => v.replace(/s$/g, ''));
}

export function getDocumentPrice(document) {
  return parseFloat(document['im:price'].attributes.amount);
}

export function getDocumentReleaseYear(document) {
  return new Date(Date.parse(document['im:releaseDate'].label)).getFullYear();
}

export function sliceLastNumberDigit(number) {
  return Math.floor(number / 10);
}
