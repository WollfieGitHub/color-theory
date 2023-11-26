import {hexToRgb, rgbDictToHex, rgbDictToHsl, rgbToHsl} from "./utils/colorUtils";
import {lineHeight} from "@mui/system";
import {ColorZoneResult, PixelPos, RGB} from "./types";


export function findColorZones(
	posToString: (p: PixelPos) => string,
	stringToPos: (s: string) => PixelPos,
	imageMap: Map<string, RGB>,
	onProgress: (value: number) => void = (a: number) => { },
	tolerance: number = 100,
	lightnessTolerance: number = 20,
): ColorZoneResult {
  const visited = new Set();
  const colorZones: PixelPos[][] = [];
  const colorToZoneMap = new Map();

  function isSimilarColor(color1: RGB, color2: RGB) {
    // Compare color difference and lightness
    const colorDiff =
      Math.abs(color1.r - color2.r) +
      Math.abs(color1.g - color2.g) +
      Math.abs(color1.b - color2.b);

    const lightnessDiff = Math.abs(
      (color1.r + color1.g + color1.b) / 3 -
      (color2.r + color2.g + color2.b) / 3
    );

    return colorDiff/3 < tolerance && lightnessDiff < lightnessTolerance;
  }

  function getNeighbors(pos: PixelPos) {
    const { x, y } = pos;
    return [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];
  }

  function bfs(startPos: PixelPos, zoneColor: RGB) {
    const queue = [startPos];
    const zonePixels = [];

    while (queue.length > 0) {
      const currentPos = queue.shift()!;

      if (!visited.has(posToString(currentPos))) {
        visited.add(posToString(currentPos));
        const currentColor = imageMap.get(posToString(currentPos))!;

        if (isSimilarColor(currentColor, zoneColor)) {
          zonePixels.push(currentPos);

          // Add neighbors to the queue
          const neighbors = getNeighbors(currentPos);
          for (const neighbor of neighbors) {
            if (imageMap.has(posToString(neighbor))) {
              queue.push(neighbor);
            }
          }
        }
      }
    }

    return zonePixels;
  }

  for (const [posStr, color] of Array.from(imageMap.entries())) {
    const pos = stringToPos(posStr);

    if (!visited.has(posToString(pos))) {
      // Start a new color zone
      const zonePixels = bfs(pos, color);
      colorZones.push(zonePixels);
      colorToZoneMap.set(posToString(pos), zonePixels);
    }
  }

  // Merge zones with the same color
  const zoneMap = new Map<string, PixelPos[]>();

  for (const zone of colorZones) {
    const posStr = posToString(zone[0])
    const color = imageMap.get(posStr)!
    const similarZones = colorZones.filter((otherZone) =>
      isSimilarColor(color, imageMap.get(posToString(otherZone[0]))!)
    );

    zoneMap.set(rgbDictToHex(color), similarZones.flatMap(_ => _))
  }

  console.log(zoneMap)

  return zoneMap;
}