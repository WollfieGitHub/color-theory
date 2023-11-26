import {Box, CardContent, CardMedia, Typography} from "@mui/material";
import ColorableImage from "./ColorableImage";
import ColorPicker from "./ColorPicker";
import Scorer, {SCHEME, SchemeKey} from "./Scorer";
import {useState} from "react";
import {StaticImageData} from "./types";

const centeredStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
};

interface ProblemProps {
	image: StaticImageData;
	colorClusters: string[];
	schemeKey: SchemeKey;
}

export default function Problem(
	{
		image, colorClusters, schemeKey,
	}: ProblemProps,
) {
	const [usedColors, setUsedColors] = useState<{ [zone: string]: string }>({});
	const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [colorLightness, setColorLightness] = useState(.6);
	const [_, setUglyUpdate] = useState(false);

	const colorResolution = 16;

	const onColorUsed = (usedColor: string, zone: string) => {
		setUsedColors(prev => {
			prev[zone] = usedColor;
			return prev;
		});
		setUglyUpdate(prev => !prev);
	};

	return <Box sx={{
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	}}>
		<Typography variant={"subtitle1"} style={{color: "#eac7e7"}}>
			{`${SCHEME[schemeKey].description}, using ${SCHEME[schemeKey].angles.length+1} colors.`}
		</Typography>
		<Box sx={{
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<CardMedia sx={centeredStyle}>
				<ColorableImage
					selectedColor={selectedColor}
					image={image}
					imageColors={colorClusters}
					onColorUsed={onColorUsed}
				/>
			</CardMedia>

			<CardContent sx={centeredStyle}>
				{/*<Slider*/}
				{/*  value={colorLightness}*/}
				{/*  min={0} max={1} step={0.01}*/}
				{/*  onChange={(e, v) => setColorLightness(v as number)}/>*/}
				<ColorPicker
					colorLightness={colorLightness}
					selectedColor={selectedColor}
					dimension={120}
					blacklistedHueRanges={[]}
					sx={{width: "100%", height: "100%", zIndex: 1}}
					onColorCLicked={setSelectedColor}
					colorResolution={colorResolution}
				/>
				<Scorer
					colorsHex={Object.values(usedColors)}
					schemeKey={schemeKey}
					toleranceDeg={1.5 * (360 / colorResolution)}
				/>
			</CardContent>
		</Box>
	</Box>;
}