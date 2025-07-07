import type { ProblemReportMessageOptions } from '@credo-ts/didcomm';
import { ProblemReportMessage } from '@credo-ts/didcomm';
export type ActionMenuProblemReportMessageOptions = ProblemReportMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 * @internal
 */
export declare class ActionMenuProblemReportMessage extends ProblemReportMessage {
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
}
