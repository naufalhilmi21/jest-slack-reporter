# Jest Json Slack Webhook

Integrate your Jest report .json to your Slack webhook.

## Installation
To install randomstring, use npm:

```
npm install jest-json-slack
```

## Usage

```
const sendToSlack = require(jest-json-slack)

const webhookUrl = 'https://yourwebhookurl.com'
const reportLocation = './test-report.json'

(async () => {
  await sendToSlack(reportLocation, webhookUrl)
  ...
})();

```

*Use custom message*

```
(async () => {
  await sendToSlack(reportLocation, webhookUrl, {
    successMessage: 'Wohoo all the test passed',
    failedMessage: 'So sad there are tests have failed'
  })
  ...
})();
```