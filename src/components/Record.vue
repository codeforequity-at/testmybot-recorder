<template>
	<div>
		<div class="row">
			<div class="col-xs-12">
				<div class="page-header">
				  <h1>1. Record a Chatbot Conversation <small>and save as test case</small></h1>
				</div>
			</div>
		</div>
		<div class="row">
			
      {{ tabs }}

		
		
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
      tabSelected: null,
    };
  },
  created() {
    this.getTabs();
  },
  methods: {
    getTabs() {
      bs.getMatchingTabs('*://www.messenger.com/*').then((tabs) => {
        this.tabs = tabs;
      }, (err) => {
        console.log(err);
      });
    },
  },
};
</script>

<style scoped>

</style>
