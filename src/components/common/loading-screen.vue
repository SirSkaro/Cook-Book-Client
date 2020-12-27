<template>
  <b-overlay :show="showOverlay">
    <template #overlay>
      <div class="text-center">
        <div v-if="showLoading">
          <b-icon-cup font-scale="5" animation="cylon" />
          <p>Brewing data...</p>
        </div>
        <b-alert v-model="errorAlertConfig.countdown" variant="danger">
          <b-icon-exclamation-triangle font-scale="5" animation="fade" variant="danger" />
          <p>{{errorAlertConfig.message}}</p>
        </b-alert>
        <b-alert v-model="successAlertConfig.countdown" variant="success">
          <b-iconstack font-scale="5">
            <b-icon-cloud stacked variant="info" />
            <b-icon-check2 stacked animation="throb" variant="success" />
          </b-iconstack>
          <p>{{successAlertConfig.message}}</p>
        </b-alert>
      </div>
    </template>
    <slot></slot>
  </b-overlay>
</template>

<script>
import {
  BIconCup,
  BIconExclamationTriangle,
  BIconCloud,
  BIconCheck2,
  BIconstack
} from "bootstrap-vue";

export default {
  name: "LoadingScreen",
  data() {
    return {
      errorAlertConfig: {
        message: null,
        countdown: 0
      },
      successAlertConfig: {
        message: null,
        countdown: 0
      }
    };
  },
  props: {
    show: { type: Boolean, required: true }
  },
  components: {
    BIconCup,
    BIconExclamationTriangle,
    BIconCloud,
    BIconCheck2,
    BIconstack
  },
  methods: {
    showError(message) {
      this.errorAlertConfig.message = message;
      this.errorAlertConfig.countdown = 5;
    },
    showSuccess(message) {
      this.successAlertConfig.message = message;
      this.successAlertConfig.countdown = 1;
    }
  },
  computed: {
    showOverlay: function() {
      return (
        this.show ||
        !!this.errorAlertConfig.countdown ||
        !!this.successAlertConfig.countdown
      );
    },
    showLoading: function() {
      return (
        this.show &&
        !this.errorAlertConfig.countdown &&
        !this.successAlertConfig.countdown
      );
    }
  }
};
</script>