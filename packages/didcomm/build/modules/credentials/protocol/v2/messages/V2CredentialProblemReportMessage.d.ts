import type { ProblemReportMessageOptions } from '../../../../../messages/problem-reports/ProblemReportMessage';
import { ProblemReportMessage } from '../../../../../messages/problem-reports/ProblemReportMessage';
export type V2CredentialProblemReportMessageOptions = ProblemReportMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 */
export declare class V2CredentialProblemReportMessage extends ProblemReportMessage {
    readonly type: string;
    static readonly type: import("../../../../../util/messageType").ParsedMessageType;
}
