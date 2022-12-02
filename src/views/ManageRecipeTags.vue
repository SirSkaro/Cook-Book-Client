<template>
  <b-container>
    <h1>Recipe Tags</h1>
    <LoadingScreen :show="hasPendingCall" ref="loadingScreen">
      <b-row class="mt-3">
        <b-col md="3" offset-md="9"> 
          <b-button size="lg" variant="primary" v-if="permissions.create" @click="setupModalAdd()" v-b-modal.tag-modal><b-icon-plus-square></b-icon-plus-square> Add Tag</b-button>
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col md="12">
          <b-table striped hover fixed :items="tags" :fields="tableFields">
            <template #cell(actions)="row">
              <b-button size="sm" variant="info" v-if="canUpdateTag(row.item)" v-b-modal.tag-modal @click="setupModalModle(row.item)"><b-icon-pencil></b-icon-pencil></b-button>
              <b-button size="sm" variant="danger" v-if="canDeleteTag(row.item)" v-b-modal.delete-confirmation-modal @click="setupModalModle(row.item)"><b-icon-trash></b-icon-trash></b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <b-row class="mt-3">
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
          <b-form-group label="Label" label-for="labelInput">
            <b-form-input id="labelInput" autofocus v-model="$v.form.label.$model" aria-describedby="labelFeedback" :state="validateState('label')"></b-form-input>
            <b-form-invalid-feedback id="labelFeedback">A label is required</b-form-invalid-feedback>
          </b-form-group>
        </form>
      </b-modal>
      <b-modal id="delete-confirmation-modal" title="Delete Recipe Tag" @ok="deleteTag" ok-variant="danger" ok-title="Yes, delete">
        <p>You are about to delete the tag <b>{{this.form.label}}</b>. It will no longer be associated with any of your recipes.</p>
        <p>Are you sure you want to delete this tag?</p>
      </b-modal>
    </LoadingScreen>
  </b-container>
  
</template>

<script>
import TagsService from '../services/TagsService.js'
import PermissionService from '../services/PermissionService'
import LoadingScreen from '../components/common/loading-screen'
import { validationMixin } from 'vuelidate'
import { BIconPlusSquare, BIconPencil, BIconTrash } from 'bootstrap-vue'
import { required } from 'vuelidate/lib/validators'

export default {
  
  name: 'ManageRecipeTags',
  mixins: [validationMixin],
  components: {
    BIconPlusSquare, BIconPencil, BIconTrash,
    LoadingScreen
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
      },
      permissions: {
        create: false
      },
      hasPendingCall: false
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
    this.togglePendingCall()
    this.loadTags()
      .finally(this.togglePendingCall)
  },
  computed: {
    canSubmit: function() {
      return this.$v.form.$dirty ? !this.$v.form.$anyError : false
    }
  },
  methods: {
    loadTags() {
        return TagsService.getPage(this.pageConfig.currentPage - 1)
          .then(tagsPage =>{
            this.tags = tagsPage._embedded.tags
            this.pageConfig.currentPage = tagsPage.page.number + 1
            this.pageConfig.itemsPerPage = tagsPage.page.size
            this.pageConfig.totalItems = tagsPage.page.totalElements
            this.permissions.create = PermissionService.canCreate(tagsPage)
          }).catch(() => this.showErrorBanner('Unable to load tags'))
    },
    saveTag() {
      this.togglePendingCall()
      return TagsService.save(this.form)
        .then(() => this.showSuccessBanner('Tag saved'))
        .catch(() => this.showErrorBanner('Unable to save tag'))
        .then(this.loadTags)
        .finally(this.togglePendingCall)
    },
    deleteTag() {
      this.togglePendingCall()
      return TagsService.delete(this.form)
        .then(() => this.showSuccessBanner('Tag deleted'))
        .catch(() => this.showErrorBanner('Unable to delete tag'))
        .then(this.loadTags)
        .finally(this.togglePendingCall)
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
    },
    showErrorBanner(message) {
      this.$refs.loadingScreen.showError(message)
    },
    showSuccessBanner(message) {
      this.$refs.loadingScreen.showSuccess(message)
    },
    togglePendingCall() {
      this.hasPendingCall = !this.hasPendingCall;
    },
    canUpdateTag(tag) {
      return PermissionService.canUpdate(tag)
    },
    canDeleteTag(tag) {
      return PermissionService.canDelete(tag)
    }
  }
  
}
</script>