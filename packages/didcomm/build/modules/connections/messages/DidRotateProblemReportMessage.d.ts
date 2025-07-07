import type { ProblemReportMessageOptions } from '../../../messages';
import { ProblemReportMessage } from '../../../messages';
export type DidRotateProblemReportMessageOptions = ProblemReportMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 */
export declare class DidRotateProblemReportMessage extends ProblemReportMessage {
    readonly type: string;
    static readonly type: import("../../../util/messageType").ParsedMessageType;
}
