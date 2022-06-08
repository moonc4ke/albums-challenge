import { renderSidebar, renderContent, bindFacetChange } from './rendering.js';
import {
  getDocumentPrice,
  getDocumentReleaseYear,
  tokenize,
  sliceNumberLastDigit,
  getNumberLastDigit,
} from './helpers.js';

const PRICE_CONSTANT = 5;

export async function loadData() {
  const products = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json').then((v) => v.json());
  return {
    documents: products.feed.entry,
  };
}

export function executeSearch(searchQuery, filters, data) {
  console.log(`Searching for "${searchQuery}" with filters`, filters);

  const result = search(searchQuery, filters, data);

  console.log(`Found ${result.documents.length} results`, result);

  renderSidebar(result.facets, filters);
  renderContent(result.documents);
  bindFacetChange((newFilters) => {
    executeSearch(searchQuery, newFilters, data);
  });
}

export function search(searchQuery, filters, data) {
  let filteredDocuments = filterDocumentsByQuery(data.documents, searchQuery);

  if (filters.price) {
    filteredDocuments = filterDocumentsByPrice(filteredDocuments, filters.price);
  }

  if (filters.year) {
    filteredDocuments = filterDocumentsByYear(filteredDocuments, filters.year);
  }

  const pricesFacet = getPricesFacet(filteredDocuments);
  const yearsFacet = getYearsFacet(filteredDocuments);

  return {
    documents: filteredDocuments,
    facets: {
      price: pricesFacet,
      year: yearsFacet,
    },
  };
}

export function filterDocumentsByQuery(documents, searchQuery) {
  const queryWords = tokenize(searchQuery);

  return documents.filter((document) => {
    const documentWords = new Set(
      [document['im:name'].label, document['im:artist'].label, document.category.attributes.label].map(tokenize).flat()
    );

    return queryWords.every((word) => documentWords.has(word));
  });
}

export function filterDocumentsByPrice(documents, priceFilters) {
  let filteredDocuments = [];

  priceFilters.map((filter) => {
    const tokenizedFilter = tokenize(filter);
    const lower = tokenizedFilter[0];
    const upper = tokenizedFilter[1];

    for (const document of documents) {
      const documentPrice = parseFloat(document['im:price'].attributes.amount);
      if (documentPrice > lower && documentPrice <= upper) {
        filteredDocuments.push(document);
      }
    }
  });

  return filteredDocuments;
}

export function filterDocumentsByYear(documents, yearFilters) {
  let filteredDocuments = [];

  yearFilters.map((yearFilter) => {
    for (const document of documents) {
      const year = new Date(Date.parse(document['im:releaseDate'].label)).getFullYear();
      if (Number(yearFilter) === year) {
        filteredDocuments.push(document);
      }
    }
  });

  return filteredDocuments;
}

export function getPricesFacet(filteredDocuments) {
  let lower = 0;
  let upper = PRICE_CONSTANT;
  let biggestPrice = 0;
  let pricesFacet = [];

  for (const document of filteredDocuments) {
    const documentPrice = getDocumentPrice(document);
    if (biggestPrice < documentPrice) {
      biggestPrice = documentPrice;
    }
  }

  biggestPrice = calculateBiggestPrice(biggestPrice);

  while (upper <= biggestPrice) {
    let count = 0;

    for (const document of filteredDocuments) {
      const documentPrice = getDocumentPrice(document);
      if (documentPrice > lower && documentPrice <= upper) {
        count++;
      }
    }

    if (count > 0) {
      pricesFacet.push({
        value: `${lower} - ${upper}`,
        count: count,
      });
    }

    lower += PRICE_CONSTANT;
    upper += PRICE_CONSTANT;
  }

  return pricesFacet;
}

export function calculateBiggestPrice(biggestPrice) {
  biggestPrice = Math.ceil(biggestPrice);
  if (biggestPrice % PRICE_CONSTANT !== 0) {
    const lastNumber = getNumberLastDigit(biggestPrice);
    let increaseNumber = PRICE_CONSTANT;

    if (lastNumber > PRICE_CONSTANT) {
      increaseNumber += PRICE_CONSTANT;
    }

    biggestPrice = sliceNumberLastDigit(biggestPrice);
    biggestPrice = String(biggestPrice) + increaseNumber;
    biggestPrice = Number(biggestPrice);
  }

  return biggestPrice;
}

export function getYearsFacet(filteredDocuments) {
  let year = 0;
  let years = [];
  let yearsFacet = [];

  for (const document of filteredDocuments) {
    let count = 0;
    year = getDocumentReleaseYear(document);

    for (const document of filteredDocuments) {
      const documentReleaseYear = getDocumentReleaseYear(document);
      if (year === documentReleaseYear && !years.includes(year)) {
        count++;
      }
    }

    if (count > 0) {
      yearsFacet.push({
        value: year.toString(),
        count: count,
      });
    }

    years.push(year);
  }

  yearsFacet = sortYearsFacet(yearsFacet);

  return yearsFacet;
}

export function sortYearsFacet(yearsFacet) {
  for (let i = 1; i < yearsFacet.length; i++) {
    for (let j = i - 1; j > -1; j--) {
      if (yearsFacet[j + 1].value > yearsFacet[j].value) {
        [yearsFacet[j + 1], yearsFacet[j]] = [yearsFacet[j], yearsFacet[j + 1]];
      }
    }
  }

  return yearsFacet;
}
