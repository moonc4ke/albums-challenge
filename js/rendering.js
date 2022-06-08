import { escapeHtml } from './helpers.js';

export function renderSidebar(facets, filters) {
  const sidebar = document.getElementById('sidebar');

  const generateHTML = (field) => `<div class="facet">
    <div class="facet-header">
        ${field}
    </div>
    ${facets[field]
      .map((value) => {
        return `<label>
            <input
                type="checkbox"
                data-facet="${escapeHtml(field)}"
                value="${escapeHtml(value.value)}"
                ${filters[field]?.includes(value.value) ? 'checked="checked"' : ''}
            />
            ${escapeHtml(value.value)} (${escapeHtml(value.count)})
        </label>`;
      })
      .join('')}
      <br/>
      <div>
        <button class="filter-button">Filter</button>
      </div>
    </div>`;

  sidebar.innerHTML = `
        ${generateHTML('price')}
        ${generateHTML('year')}
    `;
}

export function renderContent(documents) {
  const content = document.getElementById('content');

  content.innerHTML = documents
    .map((document) => {
      return `<div class="document">
            <div class="title" >
                <img src="${escapeHtml(document['im:image']?.[0]?.label)}"/>
                ${escapeHtml(document['im:name'].label)}
            </div>
            <div class="price">${escapeHtml(document['im:price'].label)}</div>
        </div>`;
    })
    .join('');
}

export function bindFacetChange(onChange) {
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const facetElements = [...document.querySelectorAll('input[data-facet]')];
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const values = facetElements.reduce((prev, cur) => {
        if (!cur.checked) {
          return prev;
        }

        const field = cur.getAttribute('data-facet') || '';
        const value = cur.value || '';

        if (!(field in prev)) {
          prev[field] = [];
        }
        prev[field].push(value);

        return prev;
      }, {});

      onChange(values);
    });
  });
}
