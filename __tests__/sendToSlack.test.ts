import exp from 'constants';
import sendReport from '../src'

describe('Testing slack integration', () => {
    let response: any;
    const webhookUrl: any = process.env.SLACK_WEBHOOK_URL;
    
    test('Valid input', async () => {
        console.log = jest.fn();

        response = await sendReport('./__tests__/report.json', webhookUrl, 'this is a message');
        expect(console.log).toHaveBeenCalledWith('Message response', {'text': 'ok'});
    })

    test('Using default message', async () => {
        console.log = jest.fn();

        response = await sendReport('./__tests__/report.json', webhookUrl);
        expect(console.log).toHaveBeenCalledWith('Message response', {'text': 'ok'});
    })

    test('Invalid webhook url', async () => {
        expect(async () => {
            await sendReport('./__tests__/report.json', 'test', 'this is a message')
        }).rejects.toThrow(new Error('There was an error with the request. Please check your webhook url.'));
    })

    test('Invalid Jest result file', async () => {
        expect(async () => {
            await sendReport('./__tests__/falseReport.json', webhookUrl, 'this is a message')
        }).rejects.toThrow(Error);
    })

    test('Invalid Jest result file', async () => {
        expect(async () => {
            await sendReport('./__tests__/falseReport.json', webhookUrl, 'this is a message')
        }).rejects.toThrow(Error);
    })
})