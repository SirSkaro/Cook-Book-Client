<template>
  <b-modal :id="modalId" 
    title="Edit Ingredient" 
    @ok="handleSubmit(ingredientForm)"
    @shown="resetForm"
    :ok-disabled="!canSubmit">
    <b-form>
      <b-form-group label="Ingredient" label-for="ingredient">
        <b-form-input id="ingredient" autofocus v-model="$v.ingredientForm.label.$model" :state="validateState('label')"/>
      </b-form-group>
      <b-form-group label="Quantity" label-for="quantity">
        <b-input-group>
          <b-form-input placeholder="minimum quantity"
            v-on:blur="handleMinQuantityBlur()"
            v-model="$v.ingredientForm.quantityMin.$model" 
            :state="validateState('quantityMin')"/>
          <b-form-input placeholder="maximum quantity"
            :disabled="minQuantityEmpty" 
            v-model="$v.ingredientForm.quantityMax.$model" 
            :state="validateState('quantityMax')"/>
        </b-input-group>
      </b-form-group>
      <b-form-group label="Units" label-for="units">
        <b-form-input id="units" v-model="$v.ingredientForm.units.$model" :state="validateState('units')"/>
      </b-form-group>
      <b-form-group label="Optional" label-for="optional">
        <b-form-radio-group v-model="$v.ingredientForm.optional.$model">
          <b-form-radio :value="false" checked>No</b-form-radio>
          <b-form-radio :value="true">Yes</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
const modalId = 'ingredient-form-modal'

export default {
  name: 'IngredientForm',
  modalId: modalId,
  mixins: [validationMixin],
  props: {
    handleSubmit: { type: Function, required: true },
    ingredient: { type: Object, required: true }
  },
  data() {
    return {
      ingredientForm: this.ingredientForm = JSON.parse(JSON.stringify(this.ingredient)),
      modalId
    }
  },
  validations: {
    ingredientForm: {
      label: { required, maxLength: maxLength(64) },
      quantityMin: { },
      quantityMax: { },
      units: { maxLength: maxLength(64) },
      optional: { required }
    }
  },
  methods: {
    validateState(name) {
      let { $error } = this.$v.ingredientForm[name]
      return $error ? false : null;
    },
    resetForm() {
      this.ingredientForm = JSON.parse(JSON.stringify(this.ingredient))
      this.$v.ingredientForm.$reset()
    },
    handleMinQuantityBlur() {
      if(this.minQuantityEmpty) {
        this.ingredientForm.quantityMin = this.ingredientForm.quantityMax
        this.ingredientForm.quantityMax = null
      }
    }
  },
  computed: {
    canSubmit: function() {
      return !this.$v.ingredientForm.$invalid
    },
    minQuantityEmpty: function() {
      return !this.$v.ingredientForm.quantityMin.$model
    }
  }
}
</script>