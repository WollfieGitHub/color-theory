/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */
export function sanitizeDegreesDouble(degrees: number): number {
    degrees = degrees % 360.0;
    if (degrees < 0) {
        degrees = degrees + 360.0;
    }
    return degrees;
}

/**
 * Mathematical modulo
 * @param value Value
 * @param base Base of the modulo
 */
export function modulo(value: number, base: number): number {
    return ((value % base) + base) % base;
}

/**
 * Sign of direction change needed to travel from one angle to
 * another.
 *
 * For angles that are 180 degrees apart from each other, both
 * directions have the same travel distance, so either direction is
 * shortest. The value 1.0 is returned in this case.
 *
 * @param from The angle travel starts from, in degrees.
 * @param to The angle travel ends at, in degrees.
 * @return -1 if decreasing from leads to the shortest travel
 * distance, 1 if increasing from leads to the shortest travel
 * distance.
 */
export function rotationDirection(from: number, to: number): number {
    const increasingDifference = sanitizeDegreesDouble(to - from);
    return increasingDifference <= 180.0 ? 1.0 : -1.0;
}

/**
 * Distance of two points on a circle, represented using degrees.
 */
export function differenceDegrees(a: number, b: number): number {
    return 180.0 - Math.abs(Math.abs(a - b) - 180.0);
}