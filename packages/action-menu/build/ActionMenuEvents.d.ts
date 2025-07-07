import type { BaseEvent } from '@credo-ts/core';
import type { ActionMenuState } from './ActionMenuState';
import type { ActionMenuRecord } from './repository';
/**
 * @public
 */
export declare enum ActionMenuEventTypes {
    ActionMenuStateChanged = "ActionMenuStateChanged"
}
/**
 * @public
 */
export interface ActionMenuStateChangedEvent extends BaseEvent {
    type: typeof ActionMenuEventTypes.ActionMenuStateChanged;
    payload: {
        actionMenuRecord: ActionMenuRecord;
        previousState: ActionMenuState | null;
    };
}
