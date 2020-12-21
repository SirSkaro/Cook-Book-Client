<template>
  <div>
    <b-row>
      <b-col md="2" offset-md="5">
        <h3>Ingredients</h3>
      </b-col>
      <b-col md="3" offset-md="2"> 
        <b-button v-if="isEditMode" size="lg" variant="primary"><b-icon-plus-square/> Add Ingredient</b-button>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-table-simple fixed>
        <b-thead>
          <b-tr>
            <b-th>Ingredient</b-th>
            <b-th>Quantity</b-th>
            <b-th>Units</b-th>
            <b-th v-if="isEditMode"></b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="ingredient in ingredients" v-bind:key="getIngredientId(ingredient)">
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.optional ? ' (optional)' : ''}} {{ingredient.label}}</b-td>
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.quantity}}</b-td>
            <b-td :variant="getRowVariant(ingredient)">{{ingredient.units}}</b-td>
            <b-td v-if="isEditMode">
              <b-button v-if="isEditMode" variant="info"><b-icon-pencil/></b-button>
              <b-button v-if="isEditMode" variant="danger"><b-icon-trash/></b-button>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-row>
  </div>
</template>

<script>
import IngredientsService from '../../services/IngredientsService.js'
import { BIconPencil, BIconTrash, BIconPlusSquare } from 'bootstrap-vue'

export default {
  name: 'IngredientList',
  props: {
    isEditMode: {type: Boolean, default: false},
    ingredients: {type: Array, required: true},
    handleEdit: {type: Function, required: true},
    handleDelete: {type: Function, required: true}
  },
  components: {
    BIconPencil, BIconTrash, BIconPlusSquare
  },
  methods: {
    getIngredientId(ingredient) {
      return IngredientsService.getId(ingredient);
    },
    getRowVariant(ingredient) {
      return ingredient.optional ? 'warning' : 'default'
    }
  }
}
</script>