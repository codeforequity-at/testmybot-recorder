<template>
	<div>
		<div class="row">
			<div class="col-xs-12">
        <h1>Record a Chatbot Conversation</h1>
        <h3 class="mb-2 text-muted">... and save as test case</h3>
			</div>
		</div>
    <hr/>
    <div class="row">
      <div class="col-sm-4">
        <b-list-group v-if="tabs && tabs.length > 0">
          <b-list-group-item 
            v-for="tab in tabs" 
            :key="tab.id"
            :href="isRecording() || !tab.ready ? '' : '#'"
            :active="selectedTab && selectedTab.id === tab.id"
            :disabled="!tab.ready"
            @click="tabSelected(tab)">

            <b-media>
              <b-img slot="aside" :src="tab.favIconUrl" v-if="tab.favIconUrl" />
              <p class="mt-0">Tab {{ tab.index }}: {{ tab.title }}</p>
            </b-media>
          
          </b-list-group-item>
        </b-list-group>
        <b-alert show variant="warning" v-if="!tabs || tabs.length === 0">
          Please open <a href="https://www.messenger.com" target="_blank">Facebook Messenger</a> and navigate to your chatbot.
        </b-alert>	
        <a href="#" @click="getTabs">Reload</a>
      </div>
      <div class="col-sm-3">
        <b-button-group size="lg">
          <b-button :disabled="!selectedTab || isRecording()" @click="startRecording"><i class="fa fa-circle fa-4x text-danger"></i></b-button>
          <b-button :disabled="!selectedTab || !isRecording()" @click="stopRecording"><i class="fa fa-stop fa-4x"></i></b-button>
        </b-button-group>
      </div>
      <div class="col-sm-5">
        <b-alert show variant="info" v-if="isRecording()">
          <h4 class="alert-heading"><i class="fa fa-spinner fa-spin"></i> {{ recordingState }}</h4>      
        </b-alert>
        <b-alert show variant="danger" v-if="showErrorMessage">
          {{ showErrorMessage }}
        </b-alert>
        <b-alert show variant="success" v-if="showSuccessMessage">
          {{ showSuccessMessage }}
        </b-alert>
      </div>
    </div>
    <hr/>
    <div class="row" v-if="isRecording() || (recordedMessages && recordedMessages.length > 0)">
      <div class="col-sm-6">
        <div class="row">
          <div class="col-sm-8">
            <h3>Conversation</h3>
          </div>
          <div class="col-sm-4 text-right">
            <a href="#" @click="clearRecording">Clear</a>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <chat-view v-bind:convo="recordedMessages"></chat-view>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="row">
          <div class="col-sm-8">
            <h3>Save as Test Case</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
      
            <b-input-group>
              <b-form-input type="text" size="lg" v-model="saveTestcaseName" :disabled="!saveTestcasePossible()"></b-form-input>
              <b-input-group-button slot="right">
                <b-btn size="lg" variant="primary" :disabled="!saveTestcasePossible() || !saveTestcaseName" @click="saveTestcase">Save</b-btn>
              </b-input-group-button>
            </b-input-group>
          </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script>

import { mapActions } from 'vuex';
import ChatView from '@/components/partial/ChatView';
import bs from '@/helpers/browsersupport';

export default {
  name: 'Record',
  components: { ChatView },
  data() {
    return {
      tabs: null,
      selectedTab: null,
      recordingState: 'idle',
      showErrorMessage: null,
      showSuccessMessage: null,
      stopRecordingCallback: null,
      recordedMessages: null,
      saveTestcaseName: '#001 Test Case',
    };
  },
  created() {
    this.getTabs();
  },
  destroyed() {
    this.stopRecording();
  },
  methods: {
    ...mapActions([
      'addTestcase',
    ]),
    tabSelected(tab) {
      if (this.isRecording()) return;
      if (!tab.ready) return;
      this.selectedTab = tab;
    },
    getTabs() {
      this.tabs = null;
      this.selectedTab = null;

      bs.getMatchingTabs('*://www.messenger.com/*').then((tabs) => {
        console.log(`getMatchingTabs ${JSON.stringify(tabs)}`);
        this.tabs = tabs;
        if (this.tabs) {
          this.selectedTab = this.tabs.find(tab => tab.ready);
        }
      }, (err) => {
        console.log(err);
      });
    },
    isRecording() {
      return this.recordingState !== 'idle';
    },
    startRecording() {
      this.showErrorMessage = null;
      this.showSuccessMessage = null;
      this.recordingState = 'connecting';
      this.recordedMessages = [];
      bs.prepareTab(this.selectedTab).then(() => {
        this.stopRecordingCallback = bs.startRecording(this.selectedTab,
          (message) => {
            console.log(message);
            this.recordedMessages.push(
              Object.assign(message, { index: this.recordedMessages.length }));
          });
        this.recordingState = 'recording';
      }, (err) => {
        this.showErrorMessage = `error prepare tabs: ${err}`;
        this.recordingState = 'idle';
      });
    },
    stopRecording() {
      if (this.stopRecordingCallback) {
        this.stopRecordingCallback();
        this.stopRecordingCallback = null;
      }
      this.recordingState = 'idle';
    },
    clearRecording() {
      this.recordedMessages = [];
    },
    saveTestcasePossible() {
      return this.recordedMessages && this.recordedMessages.length > 0;
    },
    saveTestcase() {
      this.stopRecording();

      const newTestcase = {
        name: this.saveTestcaseName,
        url: this.selectedTab.url,
        convo: this.recordedMessages,
      };
      this.addTestcase(newTestcase).then(() => {
        this.showErrorMessage = null;
        this.showSuccessMessage = `Conversation saved as test case "${this.saveTestcaseName}"`;
        this.recordedMessages = null;
      }, (err) => {
        this.showErrorMessage = err;
        this.showSuccessMessage = null;
      });
    },
  },
};
</script>

<style scoped>

</style>
