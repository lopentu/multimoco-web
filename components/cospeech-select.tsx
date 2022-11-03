import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { CospeechGesture } from '../types/corpus';

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 50;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			padding: 0,
    },
  },
};

export default function CospGestureMultipleSelectCheckmarks() {
  const [cosp, setCosp] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof cosp>) => {
    const {
      target: { value },
    } = event;
    setCosp(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{  width: 200 }}>
        <InputLabel id="gesture-multiple-checkbox-label">Gesture</InputLabel>
        <Select
          labelId="gesture-multiple-checkbox-label"
          id="gesture-multiple-checkbox"
          multiple
          value={cosp}
					label="Gesture"
          onChange={handleChange}
          // input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
					name="gestureSelect"
					autoWidth
        >
          {(Object.keys(CospeechGesture).filter(key => isNaN(Number(key)))).map((ges) => (
            <MenuItem key={ges} value={ges}>
              <Checkbox checked={cosp.indexOf(ges) > -1} />
              <ListItemText primary={ges} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
