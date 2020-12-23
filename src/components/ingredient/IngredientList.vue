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
      <b-table-simple fixed>
        <b-thead>
          <b-tr>
            <b-th>Quantity</b-th>
            <b-th>Units</b-th>
            <b-th>Ingredient</b-th>
            <b-th v-if="isEditMode"></b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="ingredient in ingredients" v-bind:key="getIngredientId(ingredient)">
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.quantity}}</b-td>
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.units}}</b-td>
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.optional ? ' (optional)' : ''}} {{ingredient.label}}</b-td>
            <b-td v-if="isEditMode">
              <b-button v-if="isEditMode" variant="info" @click="edit(ingredient)"><b-icon-pencil/></b-button>
              <b-button v-if="isEditMode" variant="danger" @click="remove(ingredient)"><b-icon-trash/></b-button>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-row>

    <IngredientForm :ingredient="selectedIngredient" :handle-submit="handleSave"/>
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
import { BIconPencil, BIconTrash, BIconPlusSquare } from 'bootstrap-vue'
import IngredientForm from './IngredientForm'
const deleteModalId = 'delete-ingredient-modal'

export default {
  name: 'IngredientList',
  props: {
    isEditMode: {type: Boolean, default: false},
    ingredients: {type: Array, required: true},
    handleSave: {type: Function, required: true},
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
    BIconPencil, BIconTrash, BIconPlusSquare
  },
  methods: {
    getIngredientId(ingredient) {
      return IngredientsService.getId(ingredient);
    },
    getRowVariant(ingredient) {
      return ingredient.optional ? 'warning' : 'default'
    },
    edit(ingredient) {
      this.selectedIngredient = ingredient;
      this.$bvModal.show(IngredientForm.modalId);
    },
    remove(ingredient) {
      this.selectedIngredient = ingredient;
      this.$bvModal.show(deleteModalId);
    },
    create() {
      this.selectedIngredient = {
        label: null,
        optional: false,
        quantity: null,
        units: null
      }
      this.$bvModal.show(IngredientForm.modalId);
    }
  }
}
</script>