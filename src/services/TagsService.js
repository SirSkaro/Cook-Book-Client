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
    searchByPartialLabel(partialLabel) {
        let queryParams = {
            partialLabel: partialLabel
        }
        let url = RESOURCE + '/search/searchByPartialLabel'
        return Axios.get(url, {params: queryParams})
            .then(response => response.data._embedded.tags)
    },
    save(tag) {
        return tag._links 
            ? Axios.put(tag._links.self.href, tag) 
            : Axios.post(RESOURCE, tag);
    },
    delete(tag) {
        return Axios.delete(tag._links.self.href)
    },
    getId(tag) {
        let url = tag._links.self.href
        return url.substring(url.lastIndexOf('/') + 1)
    }
}