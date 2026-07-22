# Tactical Rendering

The Canvas 2D pipeline runs in this order:

1. Terrain tops and elevation sides, depth-sorted by grid depth and elevation
2. Semantic tile overlays
3. Units
4. Effects and path preview
5. Canvas-local labels
6. Development-only tile diagnostics

Text-heavy status and controls remain semantic DOM. Terrain tiles draw back-to-front with elevation side faces and camera-scaled outlines. Highlight kinds use fixed priority so selection or invalid feedback cannot disappear beneath movement range.

The unit and effects passes are stable integration points, not claims of completed unit or VFX systems. Production diagnostics are disabled. Draw calls are measured as lightweight logical Canvas operations for comparative debugging rather than GPU calls.
