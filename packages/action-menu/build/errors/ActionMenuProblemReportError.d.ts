import type { ProblemReportErrorOptions } from '@credo-ts/didcomm';
import type { ActionMenuProblemReportReason } from './ActionMenuProblemReportReason';
import { ProblemReportError } from '@credo-ts/didcomm';
import { ActionMenuProblemReportMessage } from '../messages';
/**
 * @internal
 */
interface ActionMenuProblemReportErrorOptions extends ProblemReportErrorOptions {
    problemCode: ActionMenuProblemReportReason;
}
/**
 * @internal
 */
export declare class ActionMenuProblemReportError extends ProblemReportError {
    message: string;
    problemReport: ActionMenuProblemReportMessage;
    constructor(message: string, { problemCode }: ActionMenuProblemReportErrorOptions);
}
export {};
