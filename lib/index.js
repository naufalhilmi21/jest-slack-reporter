"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const webhook_1 = require("@slack/webhook");
const fs_1 = require("fs");
function postMessage(reportJSON, webhookUrl, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawResult = (0, fs_1.readFileSync)(reportJSON);
        const jestResult = JSON.parse(rawResult.toString());
        if (jestResult.numFailedTests == undefined)
            throw new Error('Not a valid jest result');
        if (message != undefined) {
            yield sendToSlack(webhookUrl, generateMessage(jestResult, message));
        }
        else {
            yield sendToSlack(webhookUrl, generateMessage(jestResult));
        }
    });
}
exports.postMessage = postMessage;
function sendToSlack(webhookUrl, messageContent) {
    return __awaiter(this, void 0, void 0, function* () {
        const webhook = new webhook_1.IncomingWebhook(webhookUrl);
        try {
            const slackResponse = yield webhook.send(messageContent);
            console.log('Message response', slackResponse);
        }
        catch (e) {
            throw new Error('There was an error with the request. Please check your webhook url.' + e);
        }
    });
}
function generateMessage(result, message) {
    const passed = result.numFailedTests > 0 ? false : true;
    const sidebarColor = passed ? '#00FF00' : '#ff3333';
    const defaultMessage = passed ? 'Great News! All tests have passed!' : 'Bad News! Test run has failed test';
    let customMessage;
    if (message != undefined) {
        customMessage = passed ? message === null || message === void 0 ? void 0 : message.successMessage : message === null || message === void 0 ? void 0 : message.failedMessage;
    }
    return {
        text: customMessage || defaultMessage,
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
