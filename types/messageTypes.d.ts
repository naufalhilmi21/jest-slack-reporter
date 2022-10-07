export interface TestResults {
    success: boolean;
    startTime: Date;
    numTotalTestSuites: number;
    numPassedTestSuites: number;
    numFailedTestSuites: number;
    numTotalTests: number;
    numPassedTests: number;
    numFailedTests: number;
    numPendingTestSuites: number;
    numPendingTests: number;
}