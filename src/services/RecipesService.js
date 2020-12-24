import Axios from 'axios';

const RESOURCE = '/recipes';

export default {
    getPage(page) {
        let queryParams = {
            page: page
          }
        return Axios.get(RESOURCE, {params: queryParams})
            .then((response) => response.data)
    },
    searchPage(page, searchParams) {
        let query = [];
        query.push('page='+page)
        if(searchParams.title) {query.push('title='+searchParams.title)}

        return Axios.get(RESOURCE + '?' + query.join('&'))
            .then((response) => response.data)
    },
    getById(recipeId) {
        return Axios.get(RESOURCE + '/' + recipeId)
            .then(response => response.data)
    },
    save(recipe) {
        return (recipe._links ? Axios.put(recipe._links.self.href, recipe) : Axios.post(RESOURCE, recipe))
            .then(response => response.data)
    },
    delete(recipe) {
        return Axios.delete(recipe._links.self.href)
    },
    getId(recipe) {
        let url = recipe._links.self.href
        return url.substring(url.lastIndexOf('/') + 1)
    },
    getTags(recipe) {
        return Axios.get(recipe._links.tags.href)
            .then(response => response.data._embedded.tags)
    },
    getIngredients(recipe) {
        return Axios.get(recipe._links.ingredients.href)
            .then(response => response.data._embedded.ingredients)
    },
    addTag(recipe, tag) {
        let recipeTagsUrl = recipe._links.tags.href
        let tagSelfRef = tag._links.self.href
        let requestConfig = {
            headers: {'Content-Type' : 'text/uri-list'}
        }
        return Axios.post(recipeTagsUrl, tagSelfRef, requestConfig)
            .then(response => response.data)
    },
    deleteTag(recipe, tag) {
        let recipeTagsUrl = recipe._links.tags.href
        let tagId = this.getId(tag)
        let resourceToDelete = recipeTagsUrl + '/' + tagId
        return Axios.delete(resourceToDelete)
    }
}