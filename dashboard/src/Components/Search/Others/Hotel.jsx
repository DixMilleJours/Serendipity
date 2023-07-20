import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicRating({setRating, rate}) {

  const handleChange = (event) => {
    setRating(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 240}}>
        <InputLabel id="demo-simple-select-helper-label">Ratings</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          defaultValue={rate}
          label="Ratings"
          onChange={handleChange}
        >

          <MenuItem value={1}>1 Star</MenuItem>
          <MenuItem value={2}>2 Stars</MenuItem>
          <MenuItem value={3}>3 Stars</MenuItem>
          <MenuItem value={4}>4 Stars</MenuItem>
          <MenuItem value={5}>5 Stars</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}