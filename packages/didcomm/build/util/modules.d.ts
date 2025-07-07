import type { Agent, ModulesMap } from '@credo-ts/core';
import type { DidCommModuleConfigOptions } from '../DidCommModuleConfig';
import { DidCommModule } from '../DidCommModule';
import { BasicMessagesModule, ConnectionsModule, CredentialsModule, DiscoverFeaturesModule, MediationRecipientModule, MediatorModule, MessagePickupModule, OutOfBandModule, ProofsModule } from '../modules';
/**
 * Type that represents the default agent modules. This is the {@link ModulesMap} variant for the default modules in the framework.
 * It uses the return type of the {@link getDefaultDidcommModules} method to automatically infer which modules are always available on
 * the agent and in the agent. namespace.
 */
export type DefaultDidCommModules = {
    [moduleKey in keyof ReturnType<typeof getDefaultDidcommModules>]: ReturnType<typeof getDefaultDidcommModules>[moduleKey];
};
export type WithoutDefaultDidCommModules<Modules extends ModulesMap> = {
    [moduleKey in Exclude<keyof Modules, keyof DefaultDidCommModules>]: Modules[moduleKey];
};
export type AgentModulesInput = Partial<DefaultAgentModulesInput> & ModulesMap;
/**
 * Defines the input type for the default agent modules. This is overwritten as we
 * want the input type to allow for generics to be passed in for the credentials module.
 */
export type DefaultAgentModulesInput = Omit<DefaultDidCommModules, 'credentials' | 'proofs'> & {
    credentials: CredentialsModule<any>;
    proofs: ProofsModule<any>;
};
export type DidCommAgent = Agent<DefaultDidCommModules>;
export declare function getDefaultDidcommModules(didcommModuleConfig?: DidCommModuleConfigOptions): {
    readonly didcomm: DidCommModule;
    readonly connections: ConnectionsModule;
    readonly credentials: CredentialsModule<[]>;
    readonly proofs: ProofsModule<import("../modules").DefaultProofProtocols>;
    readonly mediator: MediatorModule;
    readonly discovery: DiscoverFeaturesModule;
    readonly mediationRecipient: MediationRecipientModule;
    readonly messagePickup: MessagePickupModule<import("../modules").DefaultMessagePickupProtocols>;
    readonly basicMessages: BasicMessagesModule;
    readonly oob: OutOfBandModule;
};
