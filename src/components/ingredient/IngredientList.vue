<template>
  <div>
    <b-row>
      <b-col md="2" offset-md="5">
        <h3>Ingredients</h3>
      </b-col>
      <b-col md="3" offset-md="2"> 
        <b-button v-if="isEditMode" @click="create" size="lg" variant="primary"><b-icon-plus-square/> Add Ingredient</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-table-simple fixed striped>
        <b-thead>
          <b-tr>
            <b-th>Quantity</b-th>
            <b-th>Units</b-th>
            <b-th :colspan="ingredientColumnSpan" class="text-left">Ingredient</b-th>
            <b-th colspan="2" v-if="isEditMode"></b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="(ingredient, index) in ingredients" v-bind:key="getIngredientId(ingredient)" :variant="getRowVariant(ingredient)">
            <b-td>{{formatQuantityRange(ingredient)}}</b-td>
            <b-td>{{ingredient.units}}</b-td>
            <b-td :colspan="ingredientColumnSpan" class="text-left">{{formatIngredientLabel(ingredient)}}</b-td>
            <b-td v-if="isEditMode" colspan="2">
              <b-button-group>
                <b-button variant="info" @click="edit(ingredient)"><b-icon-pencil/></b-button>
                <b-button variant="danger" @click="remove(ingredient)"><b-icon-trash/></b-button>
              </b-button-group>
              <b-button-group class="ml-1">
                <b-button variant="secondary" @click="increaseOrderPriority(index)" :disabled="ingredientIsHighestPriority(ingredient)"><b-icon-arrow-up-circle-fill/></b-button>
                <b-button variant="secondary" @click="decreaseOrderPriority(index)" :disabled="ingredientIsLowestPriority(ingredient)"><b-icon-arrow-down-circle-fill/></b-button>
              </b-button-group>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-row>

    <IngredientForm :ingredient="selectedIngredient" :handle-submit="handleSingleSave"/>
    <b-modal :id="deleteModalId"
      title="Remove ingredient"
      ok-variant="danger"
      ok-title="Yes, remove"
      @ok="handleDelete(selectedIngredient)">
      <p>You are about to remove the ingredient <b>{{selectedIngredient.label}}</b> from this recipe.</p>
      <p>Are you sure you want to remove this ingredient?</p>
    </b-modal>
  </div>
</template>

<script>
import IngredientsService from '../../services/IngredientsService.js'
import { BIconPencil, BIconTrash, BIconPlusSquare,
   BIconArrowUpCircleFill, BIconArrowDownCircleFill } from 'bootstrap-vue'
import IngredientForm from './IngredientForm'
const deleteModalId = 'delete-ingredient-modal'

export default {
  name: 'IngredientList',
  props: {
    isEditMode: {type: Boolean, default: false},
    ingredients: {type: Array, required: true},
    handleSingleSave: {type: Function, required: true},
    handleMultiSave: {type: Function, required: true},
    handleDelete: {type: Function, required: true}
  },
  data() {
    return {
      selectedIngredient: {},
      deleteModalId
    }
  },
  components: {
    IngredientForm, 
    BIconPencil, BIconTrash, BIconPlusSquare,
    BIconArrowUpCircleFill, BIconArrowDownCircleFill
  },
  methods: {
    getIngredientId(ingredient) {
      return IngredientsService.getId(ingredient);
    },
    getRowVariant(ingredient) {
      return ingredient.optional ? 'warning' : 'default'
    },
    formatQuantityRange(ingredient) {
      let quantityLowerBoundFormatted = (ingredient.quantityMin ? ingredient.quantityMin : '')
      let quantityUpperBoundFormatted = (ingredient.quantityMax ? (' - ' + ingredient.quantityMax) : '')
      return quantityLowerBoundFormatted + quantityUpperBoundFormatted
    },
    formatIngredientLabel(ingredient) {
      return ingredient.label + (ingredient.optional ? ' (optional)' : '')
    },
    edit(ingredient) {
      this.selectedIngredient = ingredient;
      this.$bvModal.show(IngredientForm.modalId);
    },
    remove(ingredient) {
      this.selectedIngredient = ingredient;
      this.$bvModal.show(deleteModalId);
    },
    increaseOrderPriority(index) {
      let ingredientToMoveUp = this.ingredients[index]
      let ingredientToMoveDown = this.ingredients[index - 1]
      ingredientToMoveUp.sortOrder -= 1
      ingredientToMoveDown.sortOrder += 1

      return this.handleMultiSave([ingredientToMoveUp, ingredientToMoveDown])
    },
    decreaseOrderPriority(index) {
      let ingredientToMoveDown = this.ingredients[index]
      let ingredientToMoveUp = this.ingredients[index + 1]
      ingredientToMoveUp.sortOrder -= 1
      ingredientToMoveDown.sortOrder += 1

      return this.handleMultiSave([ingredientToMoveUp, ingredientToMoveDown])
    },
    ingredientIsHighestPriority(ingredient) {
      return ingredient.sortOrder == 1
    },
    ingredientIsLowestPriority(ingredient) {
      return ingredient.sortOrder == this.ingredients[this.ingredients.length - 1].sortOrder
    },
    create() {
      this.selectedIngredient = {
        label: null,
        optional: false,
        quantityMin: null,
        units: null,
        sortOrder: this.nextLowestSortPriority
      }
      this.$bvModal.show(IngredientForm.modalId);
    }
  },
  computed: {
    nextLowestSortPriority: function() {
      let numberOfIngredients = this.ingredients.length;
      if(numberOfIngredients == 0) {
        return 1;
      }
      return this.ingredients[numberOfIngredients - 1].sortOrder + 1;
    },
    ingredientColumnSpan: function() {
      return this.isEditMode ? 3 : 5
    }
  }
}
</script>