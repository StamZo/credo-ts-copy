import type { ProblemReportErrorOptions } from '../../../errors';
import type { DidExchangeProblemReportReason } from './DidExchangeProblemReportReason';
import { ProblemReportError } from '../../../errors';
import { DidExchangeProblemReportMessage } from '../messages';
interface DidExchangeProblemReportErrorOptions extends ProblemReportErrorOptions {
    problemCode: DidExchangeProblemReportReason;
}
export declare class DidExchangeProblemReportError extends ProblemReportError {
    message: string;
    problemReport: DidExchangeProblemReportMessage;
    constructor(message: string, { problemCode }: DidExchangeProblemReportErrorOptions);
}
export {};
