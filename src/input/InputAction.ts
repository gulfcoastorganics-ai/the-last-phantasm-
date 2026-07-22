export type InputAction = 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'confirm' | 'cancel' | 'focus' | 'toggleDebug';
export interface ActionState { readonly down: boolean; readonly pressed: boolean; readonly released: boolean; }
