<template>
  <b-form>
    <b-row>
      <b-col md="6">
        <h4>Search by title</h4>
        <hr />
        <b-form-group>
          <b-form-input 
            v-model="selectedTitle" 
            placeholder="Enter title. E.g. 'Hunter's Chili'"/>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <h4>Search by serving yield</h4>
        <hr />
        <b-form-group>
          <b-form-input type="number"
            v-model="serveCount" 
            placeholder="(Leave blank for any serving yield)"/>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <h4>Search by ingredients</h4>
        <hr />
          <b-form-group v-for="(ingredient, index) in selectedIngredients" v-bind:key="index">
            <b-form-input 
              v-model="selectedIngredients[index]" 
              v-on:blur="handleIngredientBlur(index)"
              placeholder="Enter ingredient. E.g. 'garlic'"/>
          </b-form-group>
        <b-col v-if="showAddIngredient" md="6" offset-md="6">
          <b-button @click="addSearchIngredient()"><b-icon-plus-square/> Add ingredient to search</b-button>
        </b-col>
      </b-col>
      <b-col md="6">
        <h4>Search by tags</h4>
        <hr />
        <TagForm :is-edit-mode="true"
          :selected-tags="selectedTags"
          :handle-select-tag="selectTag"
          :handle-remove-tag="removeTag"/>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import TagForm from '../../components/tag/TagForm'
import TagsService from '../../services/TagsService.js'
import { BIconPlusSquare } from 'bootstrap-vue'

export default {
  name: 'RecipeFitlerForm',
  components: {
    TagForm,
    BIconPlusSquare
  },
  data() {
    return {
      selectedTags: [],
      selectedIngredients: [null],
      selectedTitle: null,
      serveCount: null
    }
  },
  props: {
    filterCriteria: { type: Object, required: true}
  },
  methods: {
    selectTag(tag) {
      this.selectedTags.push(tag)
    },
    removeTag(tag) {
      let tagId = TagsService.getId(tag)
      this.selectedTags = this.selectedTags.filter(selectedTag => {
        return TagsService.getId(selectedTag) !== tagId
      })
    },
    addSearchIngredient() {
      this.selectedIngredients.push(null)
    },
    handleIngredientBlur(index) {
      let isLastIngredient = index == this.selectedIngredients.length -1;
      let isStringEmpty = !this.selectedIngredients[index]
      if(!isLastIngredient && isStringEmpty) {
        this.selectedIngredients.splice(index, 1)
      }
    }
  },
  computed: {
    showAddIngredient() {
      let ingredientSearchSize = this.selectedIngredients.length;
      return !!this.selectedIngredients[ingredientSearchSize - 1]
    }
  }
}
</script>