import {Box, SxProps} from "@mui/material";
import {hexToRgb, hslToRgb, rgbDictToHex, rgbDictToHsl, rgbToHsl} from "./utils/colorUtils";

interface ColorPickerProps {
	dimension: number;
	blacklistedHueRanges?: {min: number, max: number}[];
	selectedColor: string|null;
	onColorCLicked: (color: string) => void;
	colorResolution: number;
	colorLightness: number;
	sx?: SxProps;
}

const COLOR_SATURATION = .8;

const COLOR_DISABLED_SATURATION = .4;
const COLOR_DISABLED_LIGHTNESS = .2;

export default function ColorPicker(
	{
		blacklistedHueRanges = [],
		colorResolution,
		selectedColor,
		onColorCLicked,
		colorLightness,
		sx,
		dimension
	}: ColorPickerProps,
) {
	return <Box
		flexShrink={0}
    width={dimension*2 + dimension/2}
    height={dimension*2 + dimension/2}
  >
		<Box sx={{
			pointerEvents: "none",
			...sx,
			transform: `translate(${dimension}px, ${dimension*1.175}px)`,
			position: "relative",
		}}>{
			Array.from(Array(colorResolution).keys()).map(i => {
				const rotationDeg = i / colorResolution * 360;

				const hue = i / colorResolution;

				const color = rgbDictToHex(hslToRgb(hue, COLOR_SATURATION, colorLightness));

				const radius = dimension*3;
				const angle =  (2 * Math.PI) / colorResolution;
				const thirdSide = Math.tan(angle) * radius;

				return (
					<ColorPickerColor
						selected={color === selectedColor}
						key={i} color={color}
						rotationDeg={rotationDeg}
						dimension={thirdSide/4}
						container={dimension}
						onClick={() => onColorCLicked(color)}
						disabled={blacklistedHueRanges.some(range => range.min <= hue && hue <= range.max)}
					/>
				)
			})
		}</Box>
	</Box>;
}


function ColorPickerColor(
	{
		color, rotationDeg, selected, onClick, disabled, dimension, container
	}: {
		color: string,
		selected: boolean
		rotationDeg: number,
		onClick: () => void, disabled: boolean,
		dimension: number;
		container: number;
	}
) {

	const { h, s } = rgbDictToHsl(hexToRgb(color))
	const disabledColor = rgbDictToHex(hslToRgb(h, s*COLOR_DISABLED_SATURATION, COLOR_DISABLED_LIGHTNESS));

	const rotationRad = rotationDeg / 180 * Math.PI;

	const tX = Math.cos(rotationRad) * container;
	const tY = Math.sin(rotationRad) * container;

	const baseTransform = `translate(${tX}px, ${tY}px) rotate(${rotationDeg}deg)`;

	const hoverStyle = {
			transform: `${baseTransform} scale(1.2)`,
			cursor: "pointer",
			borderColor: "white",
			zIndex: 1,
		};

	const selectedStyle = {
		transform: `${baseTransform} scale(1.3)`,
		cursor: "pointer",
		borderColor: "white",
		zIndex: 1,
	}

	return <Box onClick={disabled ? undefined : onClick} sx={{
		pointerEvents: "all",
		transition: "all 150ms ease-in-out",
		height: dimension,
		width: container/2,
		position: "absolute",
		borderRadius: "50px",
		["&:hover"]: (!disabled ? hoverStyle : {}),
		borderColor: "transparent",
		borderStyle: "solid",
		borderWidth: "2px",
		transform: `${baseTransform} scale(1)`,
		zIndex: 0,
		...(selected ? selectedStyle : {})
	}} style={{
		backgroundColor: disabled ? disabledColor : color,
		clipPath: `polygon()`,
		transformOrigin: "center",
	}} />
}