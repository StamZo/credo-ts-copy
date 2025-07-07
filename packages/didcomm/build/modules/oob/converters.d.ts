import { ConnectionInvitationMessage } from '../connections/messages/ConnectionInvitationMessage';
import { OutOfBandDidCommService } from './domain/OutOfBandDidCommService';
import { OutOfBandInvitation } from './messages/OutOfBandInvitation';
export declare function convertToNewInvitation(oldInvitation: ConnectionInvitationMessage): OutOfBandInvitation;
export declare function convertToOldInvitation(newInvitation: OutOfBandInvitation): ConnectionInvitationMessage;
export declare function outOfBandServiceToNumAlgo4Did(service: OutOfBandDidCommService): {
    shortFormDid: string;
    longFormDid: string;
};
