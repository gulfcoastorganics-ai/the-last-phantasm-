# Combat Rendering

The existing tactical pipeline remains terrain → overlays → units → effects → UI → debug. The unit pass now depth-sorts vector markers and communicates team, HP, facing, active/selected/hover/target state, impact, and defeat. Movement world-position overrides are presentation-only.

The DOM HUD keeps the playfield central: active unit at upper-left, five-turn timeline centered, objective upper-right, compact commands at the lower edge, collapsible log, and contextual action preview.
