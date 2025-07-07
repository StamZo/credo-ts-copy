import type { ProblemReportMessageOptions } from '../../../messages';
import { ProblemReportMessage } from '../../../messages';
export type ConnectionProblemReportMessageOptions = ProblemReportMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 */
export declare class ConnectionProblemReportMessage extends ProblemReportMessage {
    readonly allowDidSovPrefix = true;
    readonly type: string;
    static readonly type: import("../../../util/messageType").ParsedMessageType;
}
