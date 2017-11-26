import async from 'async';
import escapeStringRegexp from 'escape-string-regexp';
import bs from './browsersupport';
import Queue from './queue';

function runTestcase(testcase, resetcommand) {
  return new Promise((testcaseResolve, testcaseReject) => {
    testcase.status = 'running';

    const queue = new Queue();

    let tab = null;
    let stopRecording = null;

    async.series([
      (tabOpened) => {
        bs.openTestRunnerTab(testcase.spec.url).then((openedTab) => {
          tab = openedTab;
          tabOpened();
        }).catch(tabOpened);
      },

      (recordingStarted) => {
        stopRecording = bs.startRecording(tab,
          (message) => {
            if (message.from === 'bot') {
              queue.push(message.text);
            }
          });
        recordingStarted();
      },

      (resetCompleted) => {
        if (resetcommand) {
          bs.sendMessage(tab, resetcommand).then(() => resetCompleted()).catch(resetCompleted);
        } else {
          resetCompleted();
        }
      },

      (testcaseCompleted) => {
        queue.clear();
        async.eachSeries(testcase.spec.convo, (convomsg, cb) => {
          if (convomsg.from === 'me') {
            console.debug(`testcase ${testcase.spec.name} sending to bot ${convomsg.text}`);
            testcase.log.push(`sending to bot: ${convomsg.text}`);
            bs.sendMessage(tab, convomsg.text).then(() => cb()).catch(cb);
          } else if (convomsg.from === 'bot') {
            console.debug(`testcase ${testcase.spec.name} expecting from bot: ${convomsg.text}`);
            testcase.log.push(`expecting from bot: ${convomsg.text}`);
            queue.pop(10000).then((msg) => {
              console.debug(`testcase ${testcase.spec.name} got from bot: ${msg}`);
              testcase.log.push(`got from bot: ${msg}`);
              const checkRegexp = new RegExp(escapeStringRegexp(convomsg.text), 'i');
              if (msg.match(checkRegexp)) {
                cb();
              } else {
                cb(`expected <${convomsg.text}>, got <${msg}>`);
              }
            }).catch((err) => {
              cb(err);
            });
          }
        }, (err) => {
          if (err) {
            testcase.status = 'failed';
            testcase.err = err;
          } else {
            testcase.status = 'success';
          }
          testcaseCompleted();
        });
      },

      (recordingStopped) => {
        if (stopRecording) {
          stopRecording();
        }
        recordingStopped();
      },

      (tabClosed) => {
        if (testcase.status === 'success') {
          setTimeout(() => bs.closeTestRunnerTab(tab), 3000);
        }
        tabClosed();
      },
    ], (err) => {
      if (err) {
        console.error(err);
        testcase.status = 'failed';
        testcase.err = err;
        testcaseReject(err);
      } else if (testcase.status === 'failed') {
        testcaseReject(testcase.err);
      } else {
        testcaseResolve();
      }
    });
  });
}

function runTestsuite(testcases, resetcommand) {
  return new Promise((resolve) => {
    testcases.forEach((testcase) => {
      testcase.status = 'queued';
      testcase.log = [];
    });
    async.eachSeries(testcases, (testcase, cb) => {
      console.info(`testcase ${testcase.spec.name} running`);
      runTestcase(testcase, resetcommand).then(() => {
        console.info(`testcase ${testcase.spec.name} success`);
        cb();
      }).catch((err) => {
        console.error(`testcase ${testcase.spec.name} failed: ${err}`);
        cb();
      });
    }, () => {
      resolve();
    });
  });
}

export default {
  runTestsuite,
  runTestcase,
};
