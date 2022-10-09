import sendReport from '../src'

describe('Testing slack integration', () => {
    let response: any;
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    test('Valid input', async () => {
        console.log = jest.fn();

        response = await sendReport('./__tests__/report.json', webhookUrl, {
            successMessage: 'Wow all tests passed',
            failedMessage: 'Test has failed'
        });

        expect(console.log).toHaveBeenCalledWith('Message response', {'text': 'ok'});
    })

    test('Using default message', async () => {
        console.log = jest.fn();

        response = await sendReport('./__tests__/report.json', webhookUrl);
        expect(console.log).toHaveBeenCalledWith('Message response', {'text': 'ok'});
    })

    test('Invalid webhook url', async () => {
        expect(async () => {
            await sendReport('./__tests__/report.json', 'test')
        }).rejects.toThrow(Error);
    })

    test('Invalid Jest result file', async () => {
        expect(async () => {
            await sendReport('./__tests__/falseReport.json', webhookUrl)
        }).rejects.toThrow(Error);
    })

    test('Invalid Jest result file', async () => {
        expect(async () => {
            await sendReport('./__tests__/falseReport.json', webhookUrl)
        }).rejects.toThrow(Error);
    })
})