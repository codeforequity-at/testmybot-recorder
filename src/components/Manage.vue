<template>
  <div>
    <div class="row">
      <div class="col-xs-12">
        <h1>Manage your test cases</h1>
			</div>
		</div>
    <hr/>
    <div class="row">
      <div class="col-sm-6">
        <b-list-group v-if="allTestcases && allTestcases.length > 0">
          <b-list-group-item 
            v-for="tc in allTestcases" 
            :key="tc.name"
            href="#"
            @click="testcaseSelected(tc)">

            <b-media>
              <p class="mt-0">{{ tc.name }}</p>
            </b-media>
          
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-6" v-if="selectedTestcase">
        <div class="row">
          <div class="col-sm-12">
            <h3>{{ selectedTestcase.name }}</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <a :href="selectedTestcase.url" target="_blank">Open Facebook Messenger</a>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <chat-view v-bind:convo="selectedTestcase.convo"></chat-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';
import ChatView from '@/components/partial/ChatView';

export default {
  name: 'Manage',
  components: { ChatView },
  data() {
    return {
      selectedTestcase: null,
    };
  },
  created() {
    if (this.allTestcases && this.allTestcases.length > 0) {
      this.selectedTestcase = this.allTestcases[0];
    }
  },
  computed: {
    ...mapGetters([
      'allTestcases',
    ]),
  },
  methods: {
    testcaseSelected(tc) {
      this.selectedTestcase = tc;
    },
  },
};
</script>

<style scoped>
</style>
