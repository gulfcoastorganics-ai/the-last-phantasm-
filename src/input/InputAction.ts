export type InputAction = 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'cursorLeft' | 'cursorRight' | 'cursorUp' | 'cursorDown' | 'confirm' | 'cancel' | 'focus' | 'toggleDebug' | 'commandMove' | 'commandAttack' | 'endTurn' | 'inspect';
export interface ActionState { readonly down: boolean; readonly pressed: boolean; readonly released: boolean; }
