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
        <b-list-group>
          <b-list-group-item 
            v-for="tab in tabs" 
            :key="tab.id"
            :href="isRecording() || !tab.ready ? '' : '#'"
            :active="selectedTab && selectedTab.id === tab.id"
            :disabled="!tab.ready"
            @click="tabSelected(tab)">

            <b-media>
              <b-img slot="aside" :src="tab.favIconUrl" v-if="tab.favIconUrl" />
              <h5 class="mt-0">Tab {{ tab.index }}: {{ tab.title }}</h5>
            </b-media>
          
          </b-list-group-item>
        </b-list-group>
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
      </div>
		</div>
    <div class="row" v-if="showErrorMessage">
      <div class="col-sm-12">
        <b-alert show variant="danger">
          {{ showErrorMessage }}
        </b-alert>
      </div>
    </div>
    <hr/>
    <div class="row" v-if="recordedMessages">
      <div class="col-sm-12">
        <b-list-group-item 
          v-for="recordedMessage in recordedMessages"
          :key="recordedMessage.index">

          <b-media>
            <i slot="aside" class="fa fa-android" v-if="recordedMessage.from === 'bot'"></i>
            <i slot="aside" class="fa fa-user" v-if="recordedMessage.from === 'me'"></i>
            <p>{{ recordedMessage.text }}</p>
          </b-media>
        
        </b-list-group-item>      
      </div>
    </div>
	</div>
</template>

<script>

import bs from '../helpers/browsersupport';

export default {
  name: 'Record',
  data() {
    return {
      tabs: null,
      selectedTab: null,
      recordingState: 'idle',
      showErrorMessage: null,
      stopRecordingCallback: null,
      recordedMessages: null,
    };
  },
  created() {
    this.getTabs();
  },
  methods: {
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
  },
};
</script>

<style scoped>

</style>
