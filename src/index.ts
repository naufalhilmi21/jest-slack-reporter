import { IncomingWebhook } from '@slack/webhook';
import { readFileSync } from 'fs'
import { CustomMessage, TestResults } from '../types/messageTypes';

export default async function (reportJSON: string, webhookUrl: string, message?: CustomMessage) {
    const rawResult = readFileSync(reportJSON);
    const jestResult: TestResults = JSON.parse(rawResult.toString());

    if (jestResult.numFailedTests == undefined) throw new Error('Not a valid jest result');

    if (message != undefined) {
      await sendToSlack(webhookUrl, generateMessage(jestResult, message));
    } else {
      await sendToSlack(webhookUrl, generateMessage(jestResult));
    }
}

async function sendToSlack(webhookUrl: string, messageContent: object) {
  const webhook = new IncomingWebhook(webhookUrl);
  try {
    const slackResponse = await webhook.send(messageContent);
    console.log('Message response', slackResponse);
  } catch (e) {
    throw new Error('There was an error with the request. Please check your webhook url.' + e);
  }
}

function generateMessage(result: TestResults, message?: CustomMessage) {
  const passed = result.numFailedTests > 0 ? false : true;
  const sidebarColor = passed ? '#00FF00' : '#ff3333';
  const defaultMessage = passed ? 'Great News! All tests have passed!' : 'Bad News! Test run has failed test';
  let customMessage;

  if (message != undefined) {
    customMessage = passed ? message?.successMessage : message?.failedMessage;
  }
  
  return {
    text: customMessage || defaultMessage,
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
