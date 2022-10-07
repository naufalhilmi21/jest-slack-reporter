"use strict";
exports.__esModule = true;
exports.printSome = void 0;
// import { IncomingWebhook } from '@slack/webhook';
var fs_1 = require("fs");
function default_1(reportJSON, webhook, message) {
    var attachment;
    (0, fs_1.readFile)(reportJSON, function (err, data) {
        if (err)
            throw new Error('Please provide a valid json file');
        ;
        attachment = generateMessage(JSON.parse(data), message);
    });
    console.log(attachment);
    console.log(webhook);
    console.log('sdfsdfsdf');
}
exports["default"] = default_1;
function printSome(message) {
    console.log(message);
}
exports.printSome = printSome;
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
function generateMessage(result, message) {
    var passed = result.numFailedTests > 0 ? false : true;
    var sidebarColor = passed ? '#00FF00' : '#ff3333';
    return {
        text: message,
        attachments: [
            {
                color: sidebarColor,
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
    };
}
