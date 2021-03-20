<template>
  <div>
    <b-form-group>
      <b-form-tags no-outer-focus size="lg">
        <template>

          <ul v-if="selectedTags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="tag in selectedTags" :key="tag.label" class="list-inline-item">
              <b-form-tag
                :disabled="!isEditMode"
                @remove="onTagRemove(tag)" 
                :title="tag.label" 
                variant="dark">
                {{ tag.label }}
              </b-form-tag>
            </li>
          </ul>
          <h5 v-else>No tags selected</h5>

          <b-dropdown v-if="isEditMode" size="lg" block menu-class="w-100">
            <template #button-content><b-icon-tag-fill /> Choose tags</template>
            <b-dropdown-form>
              <b-form-group label="Search recipe tags">
                <b-form-input size="lg"
                  autofocus
                  v-model="search" 
                  v-debounce:500="searchTags"
                  :readonly="searchPending"/>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider/>
            <div v-if="!searchPending">
              <b-dropdown-item-button
                v-for="tag in availableTags" 
                :key="getTagId(tag)" 
                @click="onTagSelect(tag)">
                {{ tag.label }}
              </b-dropdown-item-button>
            </div>
            <div v-if="searchPending">
              <b-dropdown-item v-for="tag in availableTags" :key="getTagId(tag)">
                <b-skeleton/>
              </b-dropdown-item>
            </div>
            <b-dropdown-text v-if="!availableTags.length">
              There are no tags that match your search.
              Perhaps you'd like to <a href="/#/tags">create a new tag</a>?
            </b-dropdown-text>
          </b-dropdown>

        </template>
      </b-form-tags>
    </b-form-group>
  </div>
</template>

<script>
import TagsService from '../../services/TagsService.js'
import { BIconTagFill } from "bootstrap-vue";

export default {
  name: "TagForm",
  props: {
    isEditMode: {type: Boolean, default: false},
    selectedTags: {type: Array, required: true},
    handleSelectTag: {type: Function, required: true},
    handleRemoveTag: {type: Function, required: true}
  },
  components: {
    BIconTagFill
  },
  data() {
    return {
      allPossibleOptions: [],
      search: "",
      searchPending: false
    };
  },
  created() {
    this.getInitalSetOfTags()
  },
  computed: {
    criteria() {
      return this.search.trim().toLowerCase();
    },
    availableTags() {
      return this.allPossibleOptions
        .filter(tag => !this.tagAlreadySelected(tag))
    }
  },
  methods: {
    onTagSelect(tag) {
      this.handleSelectTag(tag)
      this.search = ""
    },
    onTagRemove(tag) {
      this.handleRemoveTag(tag)
    },
    tagAlreadySelected(tag) {
      let tagId = this.getTagId(tag)
      return this.selectedTags.some(selectedTag => this.getTagId(selectedTag) === tagId)
    },
    searchTags() {
      let trimmedSearch = this.search.trim().toLowerCase()

      this.searchPending = true
      let searchPromise = trimmedSearch ? this.searchByPartialLabel(trimmedSearch) : this.getInitalSetOfTags();
      searchPromise.finally(() => this.searchPending = false)
    },
    searchByPartialLabel(partialLabel) {
      return TagsService.searchByPartialLabel(partialLabel)
          .then(tags => {this.allPossibleOptions = tags})
    },
    getInitalSetOfTags() {
      return TagsService.getPage(0, 15)
        .then(tags => {this.allPossibleOptions = tags._embedded.tags})
    },
    getTagId(tag) {
      return TagsService.getId(tag)
    }
  }
};
</script>