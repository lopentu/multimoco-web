import SearchIcon from '@mui/icons-material/Search';
import { Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import CospGestureMultipleSelectCheckmarks from './cospeech-select';

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 50;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			padding: 0,
			minWidth: 100,
		},
	},
};

export default function SearchForm(props) {

	return (
		<Grid2
			container
			spacing={1}
		>
			<Grid2 xs={12}>
				<form action="search" method="GET">
					<Grid2
						container
						spacing={1}
						justifyContent="center"
						alignItems="center"
					>
						<Grid2 xs={12}>
							<TextField
								fullWidth
								label="Query Text"
								id="search"
								type="text"
								name="query"
								value={props.queryText}
								onChange={(e) => props.setQueryText(e.target.value)}
								InputLabelProps={{ shrink: true }}
								InputProps={{ endAdornment: <Button type="submit" variant="contained" disableElevation><SearchIcon /></Button> }}
								required
							/>
						</Grid2>
					</Grid2>
					<Grid2
						container
						spacing={{xs: 0, sm: 1}}
						justifyContent="left"
						alignItems="center"
					>

						<Grid2 xs="auto" display="flex" sx={{ flexDirection: "row" }}>
							<FormControl>
								<FormLabel id="demo-radio-buttons-group-label">Search Type</FormLabel>
								<RadioGroup
									row={true}
									aria-labelledby="demo-radio-buttons-group-label"
									value={props.searchType}
									onChange={(e) => props.setSearchType(e.target.value)}
									name="searchType"
								>
									<FormControlLabel value="asr" control={<Radio />} label="ASR" />
									<FormControlLabel value="ocr" control={<Radio />} label="OCR" />
									{/* <FormControlLabel value="blank" control={<Radio />} label="Blank" /> */}
								</RadioGroup>
							</FormControl>
						</Grid2>
						<Grid2 xs="auto">
							<FormControl sx={{ width: 150 }} size="small" >
								<InputLabel id="search-collection-label">Collection</InputLabel>
								<Select
									labelId="search-collection-label"
									id="collection-select"
									value={props.searchCollection}
									label="Collection"
									name="searchCollection"
									onChange={(e) => props.setSearchCollection(e.target.value)}
									MenuProps={MenuProps}
								>
									<MenuItem value="legvid">Legislature</MenuItem>
									<MenuItem value="news">News</MenuItem>
									<MenuItem value="all">All</MenuItem>
								</Select>
							</FormControl>
						</Grid2>
						<Grid2 xs="auto">
							<CospGestureMultipleSelectCheckmarks
								cosp={props.cosp}
								setCosp={props.setCosp}
								speaker={props.speaker}
								setSpeaker={props.setSpeaker}
							/>
						</Grid2>
					</Grid2>
				</form>
			</Grid2>
		</Grid2>
	)
}