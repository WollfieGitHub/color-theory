import {useEffect, useRef, useState} from "react";
import {
	hexToRgb,
	rgbDictToHex,
	rgbDictToHsl,
	rgbDictToLab,
	rgbDistSqr,
	stringToColor,
} from "./utils/colorUtils";
import {MouseEvent} from "react";
import {StaticImageData} from "next/image";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;
import {findColorZones} from "@/components/BFS";
import {hashcode} from "@/components/utils/jsUtils";
import {Box, CircularProgress} from "@mui/material";
import {nearestNeighbours} from "@/components/nearestNeighbours";

interface ColorableImageProps {
	selectedColor: string|null;
	image: StaticImageData;
	imageColors: string[]
	threshold?: number;
	onColorUsed: (color: string, zone: string) => void;
}

type PixelMap = {
	[zone: string]: Array<{x: number, y: number}>
};

type InversePixelMap = {
	[index: number]: string
}

export default function ColorableImage(
	{
		selectedColor,
		image: imageData,
		imageColors,
		onColorUsed,
	}: ColorableImageProps,
) {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [ map, setMap ] = useState<PixelMap>({});
	const [ inverseMap, setInverseMap ] = useState<InversePixelMap>({});
	const [progress, setProgress] = useState(0);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null) {
			return;
		}

		const ctx = canvas.getContext("2d");
		if (ctx === null) {
			return;
		}

		const image = new Image();
		image.crossOrigin = "Anonymous";
		image.src = imageData.src;
		setLoaded(false);
		image.onload = () => {
			// Draw the image onto the canvas
			ctx.drawImage(image, 0, 0);

			const posToString = (pos: {x: number, y: number}) => `${pos.x},${pos.y}`;

			let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data

			let pixelMap = new Map<string, { r: number, g: number, b: number }>();

			for (let x = 0; x < canvas.width; x++) {
				for (let y = 0; y < canvas.height; y++) {

					const index = (y * canvas.width + x) * 4;
					const red = pixels[index];
					const green = pixels[index + 1];
					const blue = pixels[index + 2];

					pixelMap.set(posToString({x: x, y: y}), { r: red, g: green, b: blue })
				}
			}

			const initialSize = canvas.width * canvas.height;
			const colorGroupResults = nearestNeighbours(
				imageColors, canvas.width, canvas.height,
				rgbDistSqr,
				posToString, pixelMap,
				(progress: number) => {
					const ratio = 1 - progress/initialSize;
					setProgress(ratio)
				}
			);

			setLoaded(true);
			console.log(`${colorGroupResults.size} zones found in the image !`)
			console.log(Array.from(colorGroupResults.entries()))

			let map: PixelMap = { }
			let inverseMap: InversePixelMap = { }

			Array.from(colorGroupResults.entries())
				.forEach(entry => {
					console.log()
					map[entry[0]] = entry[1];
					entry[1].forEach(({x, y}) => {
						const index = y * canvas.width + x;
						inverseMap[index] = entry[0]

						const { r, g, b } = hexToRgb("#FFFFFF");

						if (entry[0] === "#000000") {
							pixels[4*index] = 0
							pixels[4*index+1] = 0
							pixels[4*index+2] = 0
						} else {
							pixels[4*index] = r
							pixels[4*index+1] = g
							pixels[4*index+2] = b
						}
						pixels[4*index+3] = 255

					})
				})

			setMap(map);
			setInverseMap(inverseMap);

			ctx.putImageData(new ImageData(
				pixels,
				canvas.width, canvas.height,
			), 0, 0);
		};
	}, [imageData]);


	const onCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
		if (selectedColor === null) {
			alert("Please select a color on the color wheel")
			return;
		}

		const canvas = canvasRef.current;
		if (canvas === null) {
			return;
		}

		const ctx = canvas.getContext("2d");
		if (ctx === null) {
			return;
		}

		const rect = canvas.getBoundingClientRect();
		const x0 = Math.round(e.clientX - rect.left);
		const y0 = Math.round(e.clientY - rect.top);

		// Get the pixel data of the top-left corner (position: 0,0)
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

		const {r: sR, g: sG, b: sB} = hexToRgb(selectedColor);

		const colorGroup = inverseMap[y0 * canvas.width + x0]
		if (colorGroup === "#000000") { return; }
		const zonePixels = map[colorGroup];

		for (const { x, y } of zonePixels) {
			const index = (y * canvas.width + x) * 4;

			data[index] = sR;
			data[index+1] = sG;
			data[index+2] = sB;
		}

		ctx.putImageData(new ImageData(
			data,
			canvas.width, canvas.height,
		), 0, 0);

		onColorUsed(selectedColor, colorGroup)
	};

	return <Box>
		<canvas
			width={imageData.width}
			height={imageData.height}
			ref={canvasRef}
			onClick={onCanvasClick}
		/>
		<Box>{
			loaded ? <></> : <CircularProgress variant={"determinate"} value={progress*100}/>
		}</Box>
	</Box>
}