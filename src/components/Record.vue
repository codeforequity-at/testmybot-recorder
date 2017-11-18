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
            :key="tab.id" v-bind:href="isRecording() ? '' : '#'" 
            @click="tabSelected(tab)" 
            :class="[{ active: selectedTab && selectedTab.id === tab.id }]">
          Tab {{ tab.index }}: {{ tab.title }}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-3">
        <b-button-group size="lg">
          <b-button :disabled="isRecording()" @click="startRecording"><i class="fa fa-circle fa-4x text-danger"></i></b-button>
          <b-button :disabled="!isRecording()" @click="stopRecording"><i class="fa fa-stop fa-4x"></i></b-button>
        </b-button-group>
      </div>
      <div class="col-sm-5">
        <b-alert show variant="info" v-if="isRecording()">
        
          <h4 class="alert-heading"><i class="fa fa-spinner fa-spin"></i> {{ recordingState }}</h4>      
        </b-alert>
      </div>
		</div>
 <hr/>		
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
    };
  },
  created() {
    this.getTabs();
  },
  methods: {
    tabSelected(tab) {
      if (this.isRecording()) return;
      this.selectedTab = tab;
    },
    getTabs() {
      bs.getMatchingTabs('*://www.messenger.com/*').then((tabs) => {
        this.tabs = tabs;
        if (this.tabs) {
          this.selectedTab = this.tabs[0];
        }
      }, (err) => {
        console.log(err);
      });
    },
    isRecording() {
      return this.recordingState !== 'idle';
    },
    startRecording() {
      this.recordingState = 'start';
      bs.prepareTab(this.selectedTab).then(() => {
        this.recordingState = 'connecting';
      });
    },
    stopRecording() {
      this.recordingState = 'idle';
    },
  },
};
</script>

<style scoped>

</style>
