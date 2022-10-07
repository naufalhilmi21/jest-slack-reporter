// import { IncomingWebhook } from '@slack/webhook';
import { readFile } from 'fs'
import { TestResults } from '../types/messageTypes';

export default function (reportJSON: string, webhook: string, message: string) {
    let attachment: any;

    readFile(reportJSON, (err, data: any) => {
        if (err) throw new Error('Please provide a valid json file');;
        attachment = generateMessage(JSON.parse(data), message);
    });

    console.log(attachment);
    console.log(webhook);
    console.log('sdfsdfsdf')
}

export function printSome(message: string) {
    console.log(message);
}

// Send the notification
// (async () => {
//   await createReport();
//   console.log('Sending slack message');
//   const message: object = await generateMessage();

//   try {
//     const slackResponse = await webhook.send(message);
//     console.log('Message response', slackResponse);
//   } catch (e) {
//     console.error('There was a error with the request', e);
//   }
// })();

function generateMessage(result: TestResults, message: string) {
  const passed = result.numFailedTests > 0 ? false : true;
  const sidebarColor = passed ? '#00FF00' : '#ff3333'
  return {
    text: message,
    attachments: [
      { 
        color: sidebarColor, // color of the attachments sidebar.
        fields: [
          {
            title: 'Total Tests',
            value: result.numTotalTests,
            short: true
          },
          {
            title: 'Skipped',
            value: result.numPendingTests,
            short: true
          },
          {
            title: 'Passed',
            value: result.numPassedTests,
            short: true
          },
          {
            title: 'Failed',
            value: result.numFailedTests,
            short: true
          }
        ]
      }
    ]
  }
}
