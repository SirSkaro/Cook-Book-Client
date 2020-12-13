<template>
    <b-overlay :show="show">
        <template #overlay>
            <div class="text-center">
                <b-icon-cup font-scale="5" animation="cylon"></b-icon-cup>
                <p>Brewing data...</p>
            </div>
        </template>
        <slot></slot>
    </b-overlay>
</template>

<script>
import { BIconCup } from 'bootstrap-vue'

export default {
    name: 'LoadingScreen',
    props: {
        show: { 
            type: Boolean,
            required: true
        }
    },
    components: {
        BIconCup
    }
}
</script>