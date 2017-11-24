<template>
  <div>
		<div class="row">
			<div class="col-xs-12">
        <h1>Run your test cases</h1>
			</div>
		</div>
    <hr/>
		<div class="row">
			<div class="col-sm-6">
        <b-list-group-item 
          v-for="tc in testcases"
          :key="tc.testcase.name">

          <b-media right-align>
            <i slot="aside" class="fa fa-lg fa-spinner" v-if="tc.status === 'idle'"></i>
            <i slot="aside" class="fa fa-lg fa-spinner fa-spin" v-if="tc.status === 'running'"></i>
            <i slot="aside" class="fa fa-lg fa-check text-success" v-if="tc.status === 'success'"></i>
            <i slot="aside" class="fa fa-lg fa-exclamation text-danger" v-if="tc.status === 'failed'"></i>
            <p>{{ tc.testcase.name }}</p>
          </b-media>
        
        </b-list-group-item>        
        
      </div>
			<div class="col-sm-6">
        <div class="row">
          <div class="col-xs-12">
            <b-button :disabled="status !== 'idle'" @click="runAll"><i class="fa fa-play fa-4x text-success"></i></b-button>
            <b-button :disabled="status !== 'running'" @click="stopAll"><i class="fa fa-stop fa-4x"></i></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>

import { mapGetters } from 'vuex';
import thenChrome from 'then-chrome';
import bs from '@/helpers/browsersupport';

export default {
  name: 'Run',
  computed: {
    ...mapGetters([
      'allTestcases',
    ]),
  },
  data() {
    return {
      testcases: [],
      status: 'idle', // 'running', 'ready'
    };
  },
  created() {
    this.reset();
  },
  destroyed() {
    this.stopAll();
  },
  methods: {
    reset() {
      this.status = 'idle';
      if (this.allTestcases && this.allTestcases.length > 0) {
        this.testcases = this.allTestcases.map(tc => ({
          testcase: tc,
          status: 'idle', // 'running', 'success', 'failed'
          err: null,
        }));
      }
    },
    runAll() {
      this.status = 'running';
      bs.getMatchingTabs('*://www.messenger.com/*').then((tabs) => {
        const debuggee = { tabId: tabs[0].id };
        thenChrome.debugger.attach(debuggee, '1.2').then(() => {
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 65,
            text: '',
            type: 'rawKeyDown',
            unmodifiedText: '',
            windowsVirtualKeyCode: 65,
          });
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 0,
            text: 'A',
            type: 'char',
            unmodifiedText: 'A',
            windowsVirtualKeyCode: 0,
          });
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 65,
            text: '',
            type: 'keyUp',
            unmodifiedText: '',
            windowsVirtualKeyCode: 65,
          });
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 13,
            text: '',
            type: 'rawKeyDown',
            unmodifiedText: '',
            windowsVirtualKeyCode: 13,
          });
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 0,
            text: '\r',
            type: 'char',
            unmodifiedText: 'A',
            windowsVirtualKeyCode: 0,
          });
          thenChrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            modifiers: 0,
            nativeVirtualKeyCode: 13,
            text: '',
            type: 'keyUp',
            unmodifiedText: '',
            windowsVirtualKeyCode: 13,
          });
        }).catch(e => console.log(e));

        /*
        bs.sendMessage(tabs[0], 'hugo').then(() => {
          console.log('sent');
        }, (err) => {
          console.log(err);
        });
        */
      });
    },
    stopAll() {
      this.status = 'idle';
    },
  },
};
</script>

<style scoped>

</style>
