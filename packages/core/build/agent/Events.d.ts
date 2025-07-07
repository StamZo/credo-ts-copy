import type { Observable } from 'rxjs';
export declare function filterContextCorrelationId(contextCorrelationId: string): <T extends BaseEvent>(source: Observable<T>) => Observable<T>;
export interface EventMetadata {
    contextCorrelationId: string;
}
export interface BaseEvent {
    type: string;
    payload: Record<string, unknown>;
    metadata: EventMetadata;
}
