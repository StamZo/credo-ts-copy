import type { AgentDependencies } from '@credo-ts/core';
import { HttpInboundTransport } from './transport/HttpInboundTransport';
import { WsInboundTransport } from './transport/WsInboundTransport';
export { NodeInMemoryKeyManagementStorage } from './kms/NodeInMemoryKeyManagementStorage';
export { NodeKeyManagementService } from './kms/NodeKeyManagementService';
export { NodeKeyManagementStorage } from './kms/NodeKeyManagementStorage';
declare const agentDependencies: AgentDependencies;
export { agentDependencies, HttpInboundTransport, WsInboundTransport };
