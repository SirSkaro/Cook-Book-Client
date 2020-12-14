import Axios from 'axios';

const RESOURCE = '/recipes';

export default {
    getPage(page) {
        let queryParams = {
            page: page
          }
        return Axios.get(RESOURCE, {params: queryParams})
            .then((tags) => {
                return tags.data
            })
    },
    save(recipe) {
        return recipe._links 
            ? Axios.put(recipe._links.self.href, recipe) 
            : Axios.post(RESOURCE, recipe);
    },
    delete(recipe) {
        return Axios.delete(recipe._links.self.href)
    }
}