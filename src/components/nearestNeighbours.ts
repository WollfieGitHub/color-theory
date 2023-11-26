import {PixelPos, RGB} from "./types";
import {hexToRgb} from "./utils/colorUtils";

export function nearestNeighbours(
	colors: string[], width: number, height: number,
	distanceSqr: (c1: RGB, c2: RGB) => number,
	posToString: (p: PixelPos) => string,
	imageMap: Map<string, RGB>,
	onProgress: (value: number) => void = (a: number) => { },
): Map<string, PixelPos[]> {

	function closestTo(color: RGB): string {
		let minDistanceSqr = 9999999999
		let minColor = ""

		for (const colorGroup of colors) {
			const distSqr = distanceSqr(hexToRgb(colorGroup), color)

			if (distSqr < minDistanceSqr) {
				minDistanceSqr = distSqr
				minColor = colorGroup
			}
		}
		return minColor
	}
	let result: Map<string, PixelPos[]> = new Map()

	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {

			const closestColor = closestTo(imageMap.get(posToString({ x, y }))!)
			if (!result.has(closestColor)) {
				result.set(closestColor, [])
			}
			result.get(closestColor)!.push({x, y})
			onProgress((x + y*width)/(width*height))
		}
	}
	return result
}