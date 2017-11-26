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
          :key="tc.spec.name"
          href="#"
          @click="testcaseSelected(tc)">

          <b-media right-align>
            <i slot="aside" class="fa fa-lg fa-spinner" v-if="tc.status === 'queued'"></i>
            <i slot="aside" class="fa fa-lg fa-spinner fa-spin" v-if="tc.status === 'running'"></i>
            <i slot="aside" class="fa fa-lg fa-check text-success" v-if="tc.status === 'success'"></i>
            <i slot="aside" class="fa fa-lg fa-exclamation text-danger" v-if="tc.status === 'failed'"></i>
            <p>{{ tc.spec.name }}</p>
          </b-media>
        
        </b-list-group-item>        
        
      </div>
			<div class="col-sm-6">
        <div class="row">
          <div class="col-sm-12">
            <b-button :disabled="status !== 'idle'" @click="runAll"><i class="fa fa-play fa-4x text-success"></i></b-button>
            <b-button :disabled="status !== 'running'" @click="stopAll"><i class="fa fa-stop fa-4x"></i></b-button>
          </div>
        </div>
        <hr/>
        <div class="row">
          <div class="col-sm-12">
            <b-input-group>
              <b-input-group-addon>
                Reset Command:
              </b-input-group-addon>          
              <b-form-input type="text" size="lg" v-model="myResetCommand" ></b-form-input>
            </b-input-group>              
          </div>
        </div>
        <hr/>
        <div class="row" v-if="selectedTestcase">
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-12">
                <h3>
                  <i class="fa fa-lg fa-spinner" v-if="selectedTestcase.status === 'queued'"></i>
                  <i class="fa fa-lg fa-spinner fa-spin" v-if="selectedTestcase.status === 'running'"></i>
                  <i class="fa fa-lg fa-check text-success" v-if="selectedTestcase.status === 'success'"></i>
                  <i class="fa fa-lg fa-exclamation text-danger" v-if="selectedTestcase.status === 'failed'"></i>
                  {{ selectedTestcase.spec.name }}
                </h3>
              </div>
            </div>
            <hr/>
            <div class="row">
              <div class="col-sm-12">
                <template  v-for="logtext in selectedTestcase.log">              
                {{ logtext }}<br/>
                </template >
              </div>
            </div>
          </div>
         </div>
      </div>
    </div>
  </div>  
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import testrunner from '@/helpers/testrunner';

export default {
  name: 'Run',
  computed: {
    ...mapGetters([
      'allTestcases',
      'lastRun',
      'resetCommand',
    ]),
  },
  data() {
    return {
      selectedTestcase: null,
      myResetCommand: null,
      testcases: [],
      status: 'idle', // 'running', 'ready'
      tab: null,
    };
  },
  created() {
    this.reset();
  },
  destroyed() {
    this.stopAll();
  },
  methods: {
    ...mapActions([
      'setLastRun',
      'setResetCommand',
    ]),
    testcaseSelected(tc) {
      this.selectedTestcase = tc;
    },
    reset() {
      this.status = 'idle';
      if (this.allTestcases && this.allTestcases.length > 0) {
        this.testcases = this.allTestcases.map((tc) => {
          const testcase = {
            spec: tc,
            status: 'idle', // 'running', 'success', 'failed'
            log: [],
            err: null,
          };
          if (this.lastRun) {
            const lastTestcaseResult = this.lastRun.find(l => l.name === tc.name);
            if (lastTestcaseResult) {
              testcase.status = lastTestcaseResult.status;
              testcase.log = lastTestcaseResult.log;
              testcase.err = lastTestcaseResult.err;
            }
          }
          return testcase;
        });
      }
      this.myResetCommand = this.resetCommand;
    },
    runAll() {
      this.setResetCommand(this.myResetCommand);
      testrunner.runTestsuite(this.testcases, this.myResetCommand).then(() => {
        this.setLastRun(this.testcases.map(tc => ({
          name: tc.spec.name,
          status: tc.status,
          log: tc.log,
          err: tc.err,
        })));
      });
    },
    stopAll() {
    },
  },
};
</script>

<style scoped>

</style>
