export default {
  canCreate(resource) {
    return !!resource._links.create
  },
  canUpdate(resource) {
    return !!resource._links.update
  },
  canDelete(resource) {
    return !!resource._links.delete
  }
}