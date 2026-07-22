# Tactical Map Data Format

Maps are external versioned JSON documents loaded through `MapLoader`. Version `1` requires identity, dimensions, arbitrary tile sizes, elevation step, terrain definitions, and exactly one tile per coordinate. Optional collections default safely to empty arrays.

Terrain defines type, base movement cost, walkability, cover, opacity, destructibility, hazard flags, and display color. Tiles may override terrain-derived values at runtime. Map-level collections include spawn points, objectives, decorations, triggers, encounters, weather, lighting, and string metadata.

Validation returns all independent issues it can identify. Unknown versions, duplicate terrain/tile keys, missing coverage, invalid references, unsafe numbers, and malformed collections fail without producing a partially trusted map.

The canonical executable example is `public/maps/tactical-demo.json`.
