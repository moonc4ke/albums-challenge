import { loadData, executeSearch } from './search.js'

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('searchform')

    const data = await loadData()

    console.log('Loaded initial data', data)

    form.addEventListener('submit', event => {
        event.preventDefault()
        executeSearch(new FormData(form).get('query') || '', {}, data)
    })

    executeSearch('', {}, data)

    document.body.classList.remove('loading')
})
