import { search } from './search.js'

const {
    core: {describe, it, expect, run},
    prettify,
} = window.jestLite;

const doc1 = {
    id: {
        attributes: {
            'im:id': '1'
        }
    },
    'im:name': {
        label: 'Legend: The Best of Bob Marley and the Wailers (Remastered)',
    },
    title: {
        label: 'Legend: The Best of Bob Marley and the Wailers (Remastered)'
    },
    'im:artist': {
        label: 'Bob Marley & The Wailers'
    },
    category: {
        attributes: {
            label: 'POP'
        }
    },
    'im:price': {
        attributes: {
            amount: "9.99"
        },
        label: '$9.99'
    },
    'im:releaseDate': {
        label: '2002-01-01T00:00:00-07:00',
        attributes: {
            label: 'January 1, 2002'
        }
    },
    rights: {
        label: 'This Compilation ℗ 2002 The Island Def Jam Music Group'
    }
}
const doc2 = {
    id: {
        attributes: {
            'im:id': '2'
        }
    },
    'im:name': {
        label: 'The Very Best of The Doors',
    },
    title: {
        label: 'The Very Best of The Doors'
    },
    'im:artist': {
        label: 'The Doors'
    },
    category: {
        attributes: {
            label: 'POP'
        }
    },
    'im:price': {
        attributes: {
            amount: "19.99"
        },
        label: '$19.99'
    },
    'im:releaseDate': {
        label: '2008-01-29T00:00:00-07:00',
        attributes: {
            label: 'January 29, 2008'
        }
    },
    rights: {
        label: '℗ 2008 Rhino Entertainment Company, A Warner Music Group Company'
    }
}
const data = {
    documents: [doc1, doc2]
}

describe('search', () => {
    it('finds by keyword', () => {
        expect(search('best', {}, data).documents).toEqual(data.documents)
    })

    it('finds by exact title', () => {
        expect(search('Legend: The Best of Bob Marley and the Wailers', {}, data).documents).toEqual([doc1])
    })

    it('returns price facet for matched documents', () => {
        expect(search('best', {}, data).facets.price.map(v => v.value)).toEqual([
            '5 - 10',
            '15 - 20'
        ])
    })

    it('returns year facet for matched documents', () => {
        expect(search('best', {}, data).facets.year.map(v => v.value)).toEqual([
            '2008',
            '2002'
        ])
    })

    it('allows filtering by one facet value', () => {
        const results = search('best', {
            year: ['2002']
        }, data)

        expect(results.documents).toEqual([doc1])
        expect(results.facets.year.map(v => v.value)).toEqual(['2002'])
        expect(results.facets.price.map(v => v.value)).toEqual(['5 - 10'])
    })

    it('allows filtering by multiple facet values', () => {
        const results = search('best', {
            year: ['2002', '2008'],
        }, data)

        expect(results.documents).toEqual(data.documents)
        expect(results.facets.year.map(v => v.value)).toEqual(['2008', '2002'])
        expect(results.facets.price.map(v => v.value)).toEqual(['5 - 10', '15 - 20'])
    })

    it('allows filtering by multiple facets', () => {
        const results = search('best', {
            year: ['2002'],
            price: ['5 - 10'],
        }, data)

        expect(results.documents).toEqual([doc1])
        expect(results.facets.year.map(v => v.value)).toEqual(['2002'])
        expect(results.facets.price.map(v => v.value)).toEqual(['5 - 10'])
    })


    it('calculate facet counts when filtering by year', () => {
        expect(search('best', {
            year: ['2002']
        }, data)).toEqual({
            documents: [doc1],
            facets: {
                year: [
                    {
                        value: '2002',
                        count: 1
                    }
                ],
                price: [
                    {
                        value: '5 - 10',
                        count: 1
                    }
                ]
            }
        })
    })

    it('calculate facet counts when filtering by multiple facets', () => {
        expect(search('best', {
            year: ['2002', '2008']
        }, data)).toEqual({
            documents: data.documents,
            facets: {
                year: [
                    {
                        value: '2008',
                        count: 1
                    },
                    {
                        value: '2002',
                        count: 1
                    }
                ],
                price: [
                    {
                        value: '5 - 10',
                        count: 1
                    },
                    {
                        value: '15 - 20',
                        count: 1
                    }
                ]
            }
        })
    })
})

prettify.toHTML(run(), document.body)
