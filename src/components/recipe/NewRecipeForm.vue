<template>
  <b-modal :id="modalId" title="Let's cook up something new" 
    :ok-disabled="!canSubmit" @ok="handleSubmit(recipeForm)"
    @show="resetForm">
    <p>Tell me a little about your recipe. Then we'll go fill out the details. </p>
    <hr />
    <b-form>
      <b-form-group label="Title" label-for="title">
        <b-form-input id="title" autofocus v-model="$v.recipeForm.label.$model" aria-describedby="titleFeedback" :state="validateState('label')"></b-form-input>
        <b-form-invalid-feedback id="titleFeedback">All recipes need a title!</b-form-invalid-feedback>
        <b-form-valid-feedback id="shortDescriptionFeedback">Sounds yummy!</b-form-valid-feedback>
      </b-form-group>
      <b-form-group label="Short Description" label-for="shortDescription">
        <b-form-textarea no-resize id="shortDescription" rows="4" v-model="$v.recipeForm.shortDescription.$model" aria-describedby="shortDescriptionFeedback" :state="validateState('shortDescription')"></b-form-textarea>
        <b-form-invalid-feedback id="shortDescriptionFeedback">Whoa, you gotta tell me just a little about your recipe (in less than 200 characters)</b-form-invalid-feedback>
        <b-form-valid-feedback id="shortDescriptionFeedback">I like where this is going!</b-form-valid-feedback>
      </b-form-group>
    </b-form>
  </b-modal> 
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
const modalId = 'add-recipe-modal'

export default {
  name: 'NewRecipeForm',
  modalId: modalId,
  mixins: [validationMixin],
  props: {
    handleSubmit: { type: Function, required: true }
  },
  data() {
    return {
      recipeForm: {
        label: null,
        shortDescription: null
      },
      modalId
    }
  },
  validations: {
    recipeForm: {
      label: { required, maxLength: maxLength(50) },
      shortDescription: { required, maxLength: maxLength(200) }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.recipeForm[name]
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.recipeForm.label = null
      this.recipeForm.shortDescription = null
      this.$v.recipeForm.$reset()
    }
  },
  computed: {
    canSubmit: function() {
      return this.$v.recipeForm.$dirty ? !this.$v.recipeForm.$anyError : false
    }
  }
}
</script>