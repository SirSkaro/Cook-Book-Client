<template>
  <div>
    <h3>Ingredients</h3>
    <b-table-simple fixed>
      
    </b-table-simple>
  </div>
</template>

<script>
export default {
  name: 'IngredientList',
  props: {
    isEditMode: {type: Boolean, default: false},
    ingredients: {type: Array, required: true},
    handleEdit: {type: Function, required: true},
    handleDelete: {type: Function, required: true}
  }
}
</script>