import React from 'react';
import './App.css';

import {Box, Card, CardActions, IconButton, Tooltip, Typography} from "@mui/material";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {useState} from "react";
import Problem from "./components/Problem";
import ColorableDonald from "../public/images/618px-Donald_Duck.svg.webp";

const centeredStyle = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
};


const PROBLEMS = [
	<Problem
		key={2}
		image={ColorableDonald}
		colorClusters={["#000000", "#2e7db7", "#f70002", "#fec140", "#ffffff"]}
		schemeKey={"Split-Complementary"}
	/>,
];

function App() {
  const [problemIndex, setProblemIndex] = useState(0);

	return (
		<main style={{
			backgroundColor: "#130712",
		}}>
			<Card variant={"outlined"} sx={{
				backgroundColor: "#331230",
				display: "flex",
				flexDirection: "row",
			}}>
				<Box sx={centeredStyle}>
					<Typography variant={"h3"} color={"#eac7e7"}>
						Learning Color Theory
					</Typography>
					<Typography variant={"h4"} style={{color: "#eac7e7"}}>
						{ `Problem ${problemIndex+1} / ${PROBLEMS.length}` }
					</Typography>
					<Box sx={{
						display: "flex",
						flexDirection: "row",
					}}>
						{PROBLEMS[problemIndex]}
					</Box>
				</Box>
				<CardActions sx={centeredStyle}>
					<Box sx={centeredStyle}>
						<Tooltip title={"Previous problem"}>
							<IconButton style={{color: "#eac7e7"}} size={"large"} edge={"start"} onClick={
								() => setProblemIndex(prev => {
									if (prev > 0) {
										return prev - 1;
									} else {
										return prev;
									}
								})
							}> <KeyboardArrowUp/> </IconButton>
						</Tooltip>
						<Tooltip title={"Next problem"}>
							<IconButton style={{color: "#eac7e7"}} size={"large"} edge={"start"} onClick={
								() => setProblemIndex(prev => {
									if (prev < PROBLEMS.length-1) {
										return prev + 1;
									} else {
										return prev;
									}
								})
							}> <KeyboardArrowDown/> </IconButton>
						</Tooltip>
					</Box>
				</CardActions>
			</Card>
		</main>
	);
}

export default App;
