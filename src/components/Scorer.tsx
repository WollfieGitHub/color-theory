import {Box, LinearProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {hexToRgb, rgbDictToHsl} from "./utils/colorUtils";

const SPLIT_ANGLE = 11.25;

export const SCHEME = {
	["Triadic"]: {
		description: "Color this image in a lively and dynamic while maintaining visual stability",
		angles: [120, 240],
	},
	["Monochromatic"]: {
		description: "Color this image in an harmonious and soothing way, creating a sense of unity and simplicity",
		angles: [],
	},
	["Analogous"]: {
		description: "Color this image so that it conveys a sense of comfort and warmth. It should tend to create a" +
			" cohesive and pleasing visual experience",
		angles: [SPLIT_ANGLE, 2 * SPLIT_ANGLE],
	},
	["Complementary"]: {
		description: "Color this image so that it is high-contrast and vibrant, creating a bold and dynamic look",
		angles: [ 180, ],
	},
	["Split-Complementary"]: {
		description: "Color this image so that it offers both vibrant and balanced qualities",
		angles: [ (180 - SPLIT_ANGLE),  (180 + SPLIT_ANGLE), ],
	},
	["Tetradic"]: {
		description: "Color this image so that it gives a sense of diversity and excitement",
		angles: [ 2 * SPLIT_ANGLE,  180,  180 + 2 * SPLIT_ANGLE, ],
	},
	["Square"]: {
		description: "Color this image so that it provides balance and variety, offering both color contrast and cohesion",
		angles: [ 90, 180, 270, ],
	},
	["Diadic"]: {
		description: "",
		angles: [ SPLIT_ANGLE, ],
	},
} as const;

export type SchemeKey = keyof typeof SCHEME;

interface ScorerProps {
	colorsHex: string[];
	schemeKey: keyof typeof SCHEME;
	toleranceDeg: number;
}

export default function Scorer(
	{
		colorsHex,
		schemeKey,
		toleranceDeg = 5,
	}: ScorerProps,
) {
	const [score, setScore] = useState(0);

	useEffect(() => {
		const schemeAngles = SCHEME[schemeKey];

		if (colorsHex.length === 0) {
			return;
		}
		if (colorsHex.length != schemeAngles.angles.length + 1) {
			setScore(0);
			return;
		}

		const colorHues = colorsHex
			.map(colorHex => rgbDictToHsl(hexToRgb(colorHex)).h * 360)
			.toSorted((h1, h2) => h1 - h2);

		let largestDifference = 360 + 2 * toleranceDeg;
		let smallestDifference = largestDifference;

		console.log(colorHues);

		for (let i = 0; i < colorHues.length; i++) {
			// Take the ith angle as reference
			const refAngle = colorHues[i];

			let diffSum = 0;

			for (let j = 1; j < colorHues.length; j++) {
				// Then compare with i+1, i+2, i+3...
				const index = (i + j) % colorHues.length;
				let angleI = (colorHues[index] - refAngle + 360) % 360;

				const diffI = Math.abs(angleI - schemeAngles.angles[j - 1]);
				console.log(`\tDiff ${j}, i = ${(i + j) % colorHues.length} = ${diffI}, angle = ${angleI}`);
				// If one of the angle is different, the angles are invalid according to the reference
				diffSum += diffI;
			}
			// If there is a reference for which all angles are valid, then the scheme is correct
			if (diffSum < smallestDifference) {
				smallestDifference = diffSum;
			}
			console.log(`${i} = ${diffSum}`);
			diffSum = 0;
		}
		if (smallestDifference < toleranceDeg) {
			smallestDifference = 0;
		}

		setScore(1 - (smallestDifference / largestDifference));

	}, [schemeKey, colorsHex, toleranceDeg]);

	return <Box sx={{
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	}}>
		<Typography variant={"h3"} color={"#eac7e7"}>
			{`Score: ${Math.round(score * 100)}/100`}
		</Typography>
		<LinearProgress variant={"determinate"} value={score * 100} sx={{
			width: "100%",
		}}/>
		{ Math.round(score*100) === 100 ? (
			<Typography variant={"subtitle1"} color={"#eac7e7"}>
				{ `You used a ${schemeKey} color scheme, perfect !` }
			</Typography>
		) : <></> }
	</Box>;
}