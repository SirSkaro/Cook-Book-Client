import Axios from 'axios';

const RESOURCE = '/tags';

export default {
    getPage(queryParams) {
        return Axios.get(RESOURCE, {params: queryParams})
            .then((tags) => {
                return tags.data._embedded.tags
            })
    },
    create(tag) {
        return Axios.post(RESOURCE, tag)
    },
    delete(tag) {
        return Axios.delete(tag._links.self.href)
    },
    update(tag) {
        return Axios.put(tag._links.self.href, tag)
    }
}