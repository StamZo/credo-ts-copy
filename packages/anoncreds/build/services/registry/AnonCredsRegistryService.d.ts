import type { AgentContext } from '@credo-ts/core';
import type { AnonCredsRegistry } from '.';
/**
 * @internal
 * The AnonCreds registry service manages multiple {@link AnonCredsRegistry} instances
 * and returns the correct registry based on a given identifier
 */
export declare class AnonCredsRegistryService {
    getRegistryForIdentifier(agentContext: AgentContext, identifier: string): AnonCredsRegistry;
}
