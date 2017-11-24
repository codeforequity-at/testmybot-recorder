import async from 'async';
import bs from './browsersupport';

function runTestcase(testcase) {
  return new Promise((resolve, reject) => {
    testcase.status = 'running';

    bs.openTestRunnerTab(testcase.testcase.url).then((tab) => {
      async.eachSeries(testcase.testcase.convo, (convomsg, cb) => {
        if (convomsg.from === 'me') {
          bs.sendMessage(tab, convomsg.text).then(() => cb()).catch(cb);
        } else if (convomsg.from === 'bot') {
          cb();
        }
      }, (err) => {
        setTimeout(() => bs.closeTestRunnerTab(tab), 3000);

        if (err) {
          console.log(err);
          testcase.status = 'failed';
          testcase.err = err;
          reject(err);
        } else {
          testcase.status = 'success';
          resolve();
        }
      });
    }).catch((err) => {
      console.log(err);
      testcase.status = 'failed';
      testcase.err = err;
      reject(err);
    });
  });
}

function runTestcases(testcases) {
  testcases.forEach((testcase) => { testcase.status = 'queued'; });
  return testcases.reduce((res, testcase) => res.then(
    () => runTestcase(testcase)), Promise.resolve());
}

export default {
  runTestcases,
  runTestcase,
};
