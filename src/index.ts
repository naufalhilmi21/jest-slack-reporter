import { IncomingWebhook } from '@slack/webhook';
// @ts-ignore
import Parser from "junitxml-to-javascript";
const url: any = process.env.SLACK_WEBHOOK_URL;
const jobUrl = process.env.CI_JOB_URL
const pipelineUrl = process.env.CI_PIPELINE_URL
const webhook = new IncomingWebhook(url);
const p = new Parser();

let reportObject: any = {};
let errorResult = 0;
let passedResult = 0;
let skippedResult = 0;
let testTotal = 0;

async function createReport() {
  // Read junit report
  await p.parseXMLFile("./reports/combined-junit.xml", "utf8")
    .then((report: any) => reportObject = report)
    .catch((err: any) => console.error(err.message));

  reportObject.testsuites.forEach((element: { tests: number; errors: number; skipped: number; succeeded: number; }) => {
    testTotal += element.tests;
    errorResult += element.errors;
    skippedResult += element.skipped;
    passedResult += element.succeeded;
  })
}

// Send the notification
(async () => {
  await createReport();
  console.log('Sending slack message');
  const message: object = await generateMessage();

  try {
    const slackResponse = await webhook.send(message);
    console.log('Message response', slackResponse);
  } catch (e) {
    console.error('There was a error with the request', e);
  }
})();

async function generateMessage() {
  const passed = errorResult > 0 ? false : true;
  const slackId = `<@${process.env.PIC_SLACK_ID}>`;
  const messageIntro = passed ? "*Yeay, all the tests has passed* :anya-waku-waku:": 
                                "*I've got bad news for you..* :anya-cry:\n" + slackId;
  const sidebarColor = passed ? '#00FF00' : '#ff3333'
  return {
    text: messageIntro + '\n\nThis is the result for *Backend E2E Test*',
    attachments: [
      { 
        color: sidebarColor, // color of the attachments sidebar.
        fields: [
          {
            title: 'Total Tests',
            value: testTotal,
            short: true
          },
          {
            title: 'Skipped',
            value: skippedResult,
            short: true
          },
          {
            title: 'Passed',
            value: passedResult,
            short: true
          },
          {
            title: 'Failed',
            value: errorResult,
            short: true
          }
        ],
        actions: [
          {
            type: 'button',
            text: 'Test Report',
            style: 'primary',
            url: pipelineUrl + '/test_report'
          },
          {
            type: 'button',
            text: 'Job Details',
            style: 'danger',
            url: jobUrl
          }
        ]
      }
    ]
  }
}
