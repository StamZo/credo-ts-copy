import type { ResolvedDidCommService } from '@credo-ts/core';
import { DidDocumentService } from '@credo-ts/core';
export declare class OutOfBandDidCommService extends DidDocumentService {
    constructor(options: {
        id: string;
        serviceEndpoint: string;
        recipientKeys: string[];
        routingKeys?: string[];
        accept?: string[];
    });
    static type: string;
    serviceEndpoint: string;
    recipientKeys: string[];
    routingKeys?: string[];
    accept?: string[];
    get resolvedDidCommService(): ResolvedDidCommService;
    static fromResolvedDidCommService(service: ResolvedDidCommService): OutOfBandDidCommService;
}
