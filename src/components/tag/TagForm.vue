<template>
  <div>
    <h3>Tags</h3>
    <b-form-group>
      <b-form-tags no-outer-focus size="lg" class="mb-2">
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
          <h5 v-else>There are no tags associated with this recipe</h5>

          <b-dropdown v-if="isEditMode" size="lg" block menu-class="w-100">
            <template #button-content><b-icon-tag-fill /> Choose tags</template>
            <b-dropdown-form>
              <b-form-group label="Search recipe tags">
                <b-form-input v-model="search" type="search" v-debounce:500="searchTags"/>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider/>
            <b-dropdown-item-button v-for="option in availableTags" :key="option.label" @click="onTagSelect(option)">
              {{ option.label }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="!availableTags.length">There are no tags available to select</b-dropdown-text>
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
      search: ""
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
      let tagId = TagsService.getId(tag)
      return this.selectedTags.some(selectedTag => TagsService.getId(selectedTag) === tagId)
    },
    searchTags() {
      let trimmedSearch = this.search.trim().toLowerCase()
      if(!trimmedSearch) {
        this.getInitalSetOfTags()
      } else {
        TagsService.searchByPartialLabel(trimmedSearch)
          .then(tags => {this.allPossibleOptions = tags})
      }
    },
    getInitalSetOfTags() {
      TagsService.getPage(0)
        .then(tags => {this.allPossibleOptions = tags._embedded.tags})
    }
  }
};
</script>