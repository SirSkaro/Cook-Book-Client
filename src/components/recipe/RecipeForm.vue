<template>
  <div>
    <b-form>
      <b-col md="12">
        <b-form-group label="Title" label-for="title" label-align="left">
          <b-form-input id="title" v-model="$v.recipeForm.label.$model" :state="validateState('label')"></b-form-input>
          <b-form-invalid-feedback>Your recipe needs a title!</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col md="12">
        <b-form-group label="Short Description" label-for="shortDescription" label-align="left">
          <b-form-textarea no-resize id="shortDescription" rows="2" v-model="$v.recipeForm.shortDescription.$model" aria-describedby="shortDescriptionFeedback" :state="validateState('shortDescription')"></b-form-textarea>
          <b-form-invalid-feedback>Your recipe must have a short description</b-form-invalid-feedback>
        </b-form-group>
      </b-col>

      <b-col md="3">
        <b-form-group label="Serving Yield" label-align="left">
          <b-form-input id="serveCount" type="number" v-model="$v.recipeForm.serveCount.$model" :state="validateState('serveCount')"></b-form-input>
          <b-form-invalid-feedback>This has to be a real number of persons!</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Original Source" label-align="left">
          <b-form-input id="source" v-model="$v.recipeForm.source.$model"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col md="12">
        <b-form-group label="Instructions" label-for="instructions" label-align="left">
          <b-form-textarea no-resize id="instructions" rows="15" v-model="$v.recipeForm.instructions.$model" :state="validateState('instructions')"></b-form-textarea>
          <b-form-invalid-feedback>Instructions must be less than 8000 characters</b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, minValue, integer } from 'vuelidate/lib/validators'

export default {
  name: 'RecipeForm',
  mixins: [validationMixin],
  props: {
    recipe: {type: Object, required: true},
    editMode: {type: Boolean, default: false},
    handleSave: {type: Function, required: false }
  },
  data() {
    return {
      recipeForm: this.recipe
    }
  },
  watch: {
    recipe: function(newValue) {
      this.recipeForm = newValue.data
    }
  },
  validations: {
    recipeForm: {
      label: { required, maxLength: maxLength(255) },
      shortDescription: { required, maxLength: maxLength(200) },
      serveCount: { minValue: minValue(1), integer: integer},
      source: {},
      instructions: {maxLength: maxLength(8000)}
    }
  },
  methods: {
    validateState(name) {
      let { $error } = this.$v.recipeForm[name]
      return $error ? false : null;
    },
  }
}
</script>