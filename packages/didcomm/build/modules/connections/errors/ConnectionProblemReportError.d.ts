import type { ProblemReportErrorOptions } from '../../../errors';
import type { ConnectionProblemReportReason } from './ConnectionProblemReportReason';
import { ProblemReportError } from '../../../errors';
import { ConnectionProblemReportMessage } from '../messages';
interface ConnectionProblemReportErrorOptions extends ProblemReportErrorOptions {
    problemCode: ConnectionProblemReportReason;
}
export declare class ConnectionProblemReportError extends ProblemReportError {
    message: string;
    problemReport: ConnectionProblemReportMessage;
    constructor(message: string, { problemCode }: ConnectionProblemReportErrorOptions);
}
export {};
