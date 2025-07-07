import { CredoError } from '@credo-ts/core';
import { ProblemReportMessage } from '../../messages/problem-reports/ProblemReportMessage';
export interface ProblemReportErrorOptions {
    problemCode: string;
}
export declare class ProblemReportError extends CredoError {
    problemReport: ProblemReportMessage;
    constructor(message: string, { problemCode }: ProblemReportErrorOptions);
}
