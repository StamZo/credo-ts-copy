import type { InboundMessageContext } from '../../../../../models';
import type { V1RevocationNotificationMessage } from '../messages/V1RevocationNotificationMessage';
import type { V2CreateRevocationNotificationMessageOptions } from './RevocationNotificationServiceOptions';
import { EventEmitter, Logger } from '@credo-ts/core';
import { MessageHandlerRegistry } from '../../../../../MessageHandlerRegistry';
import { CredentialRepository } from '../../../repository';
import { V2RevocationNotificationMessage } from '../messages/V2RevocationNotificationMessage';
export declare class RevocationNotificationService {
    private credentialRepository;
    private eventEmitter;
    private logger;
    constructor(credentialRepository: CredentialRepository, eventEmitter: EventEmitter, messageHandlerRegistry: MessageHandlerRegistry, logger: Logger);
    private processRevocationNotification;
    /**
     * Process a received {@link V1RevocationNotificationMessage}. This will create a
     * {@link RevocationNotification} and store it in the corresponding {@link CredentialRecord}
     *
     * @param messageContext message context of RevocationNotificationMessageV1
     */
    v1ProcessRevocationNotification(messageContext: InboundMessageContext<V1RevocationNotificationMessage>): Promise<void>;
    /**
     * Create a V2 Revocation Notification message
     */
    v2CreateRevocationNotification(options: V2CreateRevocationNotificationMessageOptions): Promise<{
        message: V2RevocationNotificationMessage;
    }>;
    /**
     * Process a received {@link V2RevocationNotificationMessage}. This will create a
     * {@link RevocationNotification} and store it in the corresponding {@link CredentialRecord}
     *
     * @param messageContext message context of RevocationNotificationMessageV2
     */
    v2ProcessRevocationNotification(messageContext: InboundMessageContext<V2RevocationNotificationMessage>): Promise<void>;
    private registerMessageHandlers;
}
