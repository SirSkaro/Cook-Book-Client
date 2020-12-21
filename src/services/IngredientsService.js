import Axios from 'axios';

const RESOURCE = '/ingredients';

export default {
    getPage(page) {
        let queryParams = {
            page: page
        }
        return Axios.get(RESOURCE, {params: queryParams})
            .then((response) => response.data)
    },
    save(ingredient, recipe) {
        if(recipe && !ingredient._links) {
            ingredient.recipe = recipe._links.self.href
        }
        return (ingredient._links ? Axios.put(ingredient._links.self.href, ingredient) : Axios.post(RESOURCE, ingredient))
            .then(response => response.data)
    },
    delete(ingredient) {
        return Axios.delete(ingredient._links.self.href)
    },
    getId(ingredient) {
        let url = ingredient._links.self.href
        return url.substring(url.lastIndexOf('/') + 1)
    }
}