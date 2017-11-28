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
        <hr/>
        <div class="row">
          <div class="col-sm-12">
            <b-button-group size="lg">
              <b-dropdown split size="lg" variant="primary">
                <template slot="button-content">
                  <i class="fa fa-pencil"></i> Edit
                </template>
                <b-dropdown-item><i class="fa fa-comment"></i> Edit Script</b-dropdown-item>
                <b-dropdown-item><i class="fa fa-trash"></i> Delete</b-dropdown-item>
              </b-dropdown>
              <b-dropdown split size="lg"  variant="primary">
                <template slot="button-content">
                  <i class="fa fa-download"></i> Export
                </template>
                <b-dropdown-item><i class="fa fa-github"></i> ... to Github</b-dropdown-item>
                <b-dropdown-item @click="exportAsConvo(selectedTestcase)"><i class="fa fa-file-text"></i> ... as *.convo</b-dropdown-item>
                <b-dropdown-item><i class="fa fa-jsfiddle"></i> ... as *.json</b-dropdown-item>
              </b-dropdown>
              <b-button :href="selectedTestcase.url" target="_blank" variant="primary"><i class="fa fa-facebook"></i> Open Chatbot</b-button>
            </b-button-group>
          </div>
        </div>
        <hr/>
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
import slugify from 'slugify';
import ChatView from '@/components/partial/ChatView';
import bs from '@/helpers/browsersupport';

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
    exportAsConvo(tc) {
      const lines = [];
      lines.push(tc.name.replace('#', ''));
      lines.push('');
      tc.convo.forEach((el) => {
        lines.push(`#${el.from}`);
        lines.push(el.text);
        lines.push('');
      });
      const content = lines.join('\r\n');
      const filename = `${slugify(tc.name)}.convo.txt`;

      bs.saveTextFile(content, filename)
        .then(() => { })
        .catch(console.log);
    },
  },
};
</script>

<style scoped>
</style>
