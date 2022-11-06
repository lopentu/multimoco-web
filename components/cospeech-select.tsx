import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { CospeechGesture } from '../types/corpus';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Stack } from '@mui/material';

const ITEM_HEIGHT = 200;
const ITEM_PADDING_TOP = 100;
const MenuProps = {
	PaperProps: {
		style: {
			// minHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			padding: 0,
			minWidth: 100,
		},
	},
};

export default function CospGestureMultipleSelectCheckmarks(props) {

	const handleGestureChange = (event: SelectChangeEvent<typeof props.cosp>) => {
		const {
			target: { value },
		} = event;
		props.setCosp(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	return (
		<div>
			{/* <Grid2
				display="flex"
				container
				// spacing={1}
				sx={{ flexDirection: "row" }}
			> */}
			<Stack
				direction={{ xs: 'row' }}
				spacing={1}
			// justifyContent="space-around"
			>
				{/* <Grid2 md={6}> */}
				<FormControl sx={{ minWidth: 150 }} size="small">
					<InputLabel id="gesture-multiple-checkbox-label">Gesture</InputLabel>
					<Select
						labelId="gesture-multiple-checkbox-label"
						id="gesture-multiple-checkbox"
						multiple
						value={props.cosp}
						label="Gesture"
						onChange={handleGestureChange}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
						name="gestureSelect"
						autoWidth
					>
						{(Object.keys(CospeechGesture).filter(key => isNaN(Number(key)))).map((ges) => (
							<MenuItem key={ges} value={ges}>
								<Checkbox checked={props.cosp.indexOf(ges) > -1} />
								<ListItemText primary={ges} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{/* </Grid2> */}
				{/* <Grid2 md={6}> */}
				<FormControl sx={{ minWidth: 150 }} size="small">
					<InputLabel id="speaker-select-small">Speaker</InputLabel>
					<Select
						labelId="speaker-select-small"
						id="speaker-select-small"
						value={props.speaker}
						label="Speaker"
						onChange={(e) => props.setSpeaker(e.target.value)}
						MenuProps={MenuProps}
						name="gestureSpeaker"
					>
						<MenuItem value="any">Any</MenuItem>
						<MenuItem value="SP1">Speaker 1</MenuItem>
						<MenuItem value="SP2">Speaker 2</MenuItem>
					</Select>
				</FormControl>
			</Stack>
			{/* </Grid2> */}
			{/* </Grid2> */}
		</div>
	);
}
