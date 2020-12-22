<template>
  <div>
    <h3>Tags</h3>
    <b-form-group>
      <b-form-tags no-outer-focus class="mb-2">
        <template>

          <ul v-if="selectedTags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="tag in selectedTags" :key="tag.label" class="list-inline-item">
              <b-form-tag @remove="onTagRemove(tag)" :title="tag.label" variant="info">{{ tag.label }}</b-form-tag>
            </li>
          </ul>
          <h5 v-else>There are no tags associated with this recipe</h5>

          <b-dropdown v-if="isEditMode" size="sm" block menu-class="w-100">
            <template #button-content><b-icon-tag-fill /> Choose tags</template>
            <b-dropdown-form>
              <b-form-group label="Search recipe tags">
                <b-form-input v-model="search" type="search"/>
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
    TagsService.getAll()
      .then(tags => {this.allPossibleOptions = tags})
  },
  computed: {
    criteria() {
      return this.search.trim().toLowerCase();
    },
    availableTags() {
      return this.allPossibleOptions
        .filter(tag => !this.tagAlreadySelected(tag))
        .filter(this.tagMatchesSearchCriteria)
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
    tagMatchesSearchCriteria(tag) {
      if(!this.criteria) {
        return true
      } 
      return tag.label.toLowerCase().indexOf(this.criteria) > -1
    }
  }
};
</script>