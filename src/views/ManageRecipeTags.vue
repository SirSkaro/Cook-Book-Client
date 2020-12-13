<template>
  <b-container>
    <h1>Manage Recipe Tags</h1>
    <b-row>
      <b-col md="3" offset-md="9"> 
        <b-button size="lg" variant="primary" @click="setupModalAdd()" v-b-modal.tag-modal><b-icon-plus-square></b-icon-plus-square> Add Tag</b-button>
      </b-col>
    </b-row>

    <b-row>
      <b-table striped hover fixed :items="tags" :fields="tableFields">
        <template #cell(actions)="row">
          <b-button size="sm" variant="info" v-b-modal.tag-modal @click="setupModalModle(row.item)"><b-icon-pencil></b-icon-pencil></b-button>
          <b-button size="sm" variant="danger" v-b-modal.delete-confirmation-modal @click="setupModalModle(row.item)"><b-icon-trash></b-icon-trash></b-button>
        </template>
      </b-table>
    </b-row>

    <b-row>
      <b-col md="12">
        <b-pagination align="center"
          v-model="pageConfig.currentPage"
          :total-rows="pageConfig.totalItems"
          :per-page="pageConfig.itemsPerPage"
          @input="loadTags">
        </b-pagination>
      </b-col>
    </b-row>

    <b-modal id="tag-modal" title="Edit Recipe Tag" @ok="saveTag" :ok-disabled="!canSubmit">
      <form>
        <b-form-group label="Label" label-for="label-input">
          <b-form-input id="label-input" v-model="$v.form.label.$model" aria-describedby="label-feedback" :state="validateState('label')"></b-form-input>
          <b-form-invalid-feedback id="label-feedback">A label is required</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal id="delete-confirmation-modal" title="Delete Recipe Tag" @ok="deleteTag" ok-variant="danger" ok-title="Yes, delete">
      <p>You are about to delete this tag. It will no longer be associated with any of your recipes.</p>
      <p>Are you sure you want to delete this tag?</p>
    </b-modal>
  </b-container>
  
</template>

<script>
import TagsService from '../services/TagsService.js'
import { validationMixin } from 'vuelidate'
import { BIconPlusSquare, BIconPencil, BIconTrash } from 'bootstrap-vue'
import { required } from 'vuelidate/lib/validators'

export default {
  
  name: 'ManageRecipeTags',
  mixins: [validationMixin],
  components: {
    BIconPlusSquare, BIconPencil, BIconTrash
  },
  data() {
    return {
      tags: [],
      tableFields: ['label', 'actions'],
      pageConfig: {
        currentPage: 1,
        itemsPerPage: 0,
        totalItems: 0
      },
      form: {
        label: null
      }
    }
  },
  validations: {
    form: {
      label: {
        required
      }
    }
  },
  created() {
    this.loadTags()
  },
  computed: {
    canSubmit: function() {
      return this.$v.form.$dirty ? !this.$v.form.$anyError : false
    }
  },
  methods: {
    loadTags: function() {
        TagsService.getPage(this.pageConfig.currentPage - 1)
          .then(tagsPage =>{
            this.tags = tagsPage._embedded.tags
            this.pageConfig.currentPage = tagsPage.page.number + 1;
            this.pageConfig.itemsPerPage = tagsPage.page.size
            this.pageConfig.totalItems = tagsPage.page.totalElements
          })
    },
    saveTag() {
      return TagsService.save(this.form)
        .then(this.loadTags)
    },
    deleteTag() {
      TagsService.delete(this.form)
        .then(this.loadTags)
    },
    setupModalModle(tag) {
      this.form = JSON.parse(JSON.stringify(tag))
      this.$v.form.$reset()
    },
    setupModalAdd() {
      this.form = { label: null }
      this.$v.form.$reset()
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null;
    }
  }
  
}
</script>