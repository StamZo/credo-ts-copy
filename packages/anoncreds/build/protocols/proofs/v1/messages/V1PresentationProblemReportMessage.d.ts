import type { ProblemReportMessageOptions } from '@credo-ts/didcomm';
import { ProblemReportMessage } from '@credo-ts/didcomm';
export type V1PresentationProblemReportMessageOptions = ProblemReportMessageOptions;
/**
 * @see https://github.com/hyperledger/aries-rfcs/blob/main/features/0035-report-problem/README.md
 */
export declare class V1PresentationProblemReportMessage extends ProblemReportMessage {
    readonly allowDidSovPrefix = true;
    readonly type: string;
    static readonly type: import("@credo-ts/didcomm").ParsedMessageType;
}
