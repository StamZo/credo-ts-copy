import type { ProblemReportErrorOptions } from '../../../../../errors';
import type { PresentationProblemReportReason } from '../../../errors/PresentationProblemReportReason';
import { ProblemReportError } from '../../../../../errors';
import { V2PresentationProblemReportMessage } from '../messages';
interface V2PresentationProblemReportErrorOptions extends ProblemReportErrorOptions {
    problemCode: PresentationProblemReportReason;
}
export declare class V2PresentationProblemReportError extends ProblemReportError {
    message: string;
    problemReport: V2PresentationProblemReportMessage;
    constructor(message: string, { problemCode }: V2PresentationProblemReportErrorOptions);
}
export {};
