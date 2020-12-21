import Axios from 'axios';

const RESOURCE = '/tags';

export default {
    getPage(page) {
        let queryParams = {
            page: page,
            sort: 'label,asc'
          }
        return Axios.get(RESOURCE, {params: queryParams})
            .then((response) => response.data)
    },
    save(tag) {
        return tag._links 
            ? Axios.put(tag._links.self.href, tag) 
            : Axios.post(RESOURCE, tag);
    },
    delete(tag) {
        return Axios.delete(tag._links.self.href)
    }
}