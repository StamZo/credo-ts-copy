import type { AgentContext } from '../../../../agent/context/AgentContext';
import type { DocumentLoader } from './jsonld';
export type DocumentLoaderWithContext = (agentContext: AgentContext) => DocumentLoader;
export declare function defaultDocumentLoader(agentContext: AgentContext): DocumentLoader;
