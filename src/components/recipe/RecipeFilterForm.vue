<template>
  <b-form>
    <b-row>
      <b-col md="6">
        <h4>Search by title</h4>
        <hr />
        <b-form-group>
          <b-form-input 
            v-model="searchCriteria.title" 
            placeholder="Enter title. E.g. 'Hunter's Chili'"/>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <h4>Search by serving yield</h4>
        <hr />
        <b-form-group>
          <b-form-input type="number"
            v-model="searchCriteria.serveCount" 
            placeholder="(Leave blank for any serving yield)"/>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <h4>Search by ingredients</h4>
        <hr />
          <b-form-group v-for="(ingredient, index) in searchCriteria.ingredients" v-bind:key="index">
            <b-form-input 
              v-model="searchCriteria.ingredients[index]" 
              v-on:blur="handleIngredientBlur(index)"
              placeholder="Enter ingredient. E.g. 'garlic'"/>
          </b-form-group>
        <b-col v-if="showAddIngredient" align-self="center">
          <b-button @click="addSearchIngredient()"><b-icon-plus-square/> Add ingredient to search</b-button>
        </b-col>
      </b-col>
      <b-col md="6">
        <h4>Search by tags</h4>
        <hr />
        <TagForm :is-edit-mode="true"
          :selected-tags="searchCriteria.tags"
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
  props: {
    searchCriteria: { type: Object, required: true}
  },
  methods: {
    selectTag(tag) {
      this.searchCriteria.tags.push(tag)
    },
    removeTag(tag) {
      let tagId = TagsService.getId(tag)
      this.searchCriteria.tags = this.searchCriteria.tags.filter(selectedTag => {
        return TagsService.getId(selectedTag) !== tagId
      })
    },
    addSearchIngredient() {
      this.searchCriteria.ingredients.push(null)
    },
    handleIngredientBlur(index) {
      let isStringEmpty = !this.searchCriteria.ingredients[index]
      if(isStringEmpty) {
        this.searchCriteria.ingredients.splice(index, 1)
      }
    }
  },
  computed: {
    showAddIngredient() {
      let ingredientSearchSize = this.searchCriteria.ingredients.length;
      if(!ingredientSearchSize) {
        return true;
      }
      return !!this.searchCriteria.ingredients[ingredientSearchSize - 1]
    }
  }
}
</script>