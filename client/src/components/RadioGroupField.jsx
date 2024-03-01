import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';

const RadioGroupField = (props) => {
  const { form, name, label, required, options, type } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
                 field: { onChange, onBlur, value, name, ref },
                 fieldState: { invalid, error },
               }) => (
        <FormControl fullWidth sx={{ marginBottom: '10px' }}>
          <FormLabel id="demo-controlled-radio-buttons-group">{label} {required ? '*' : ''}</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            sx={
              type === 'horizontal' ? { display: 'flex', flexDirection: 'row', width: '100%' } : { width: '100%' }
            }
          >
            {options.map((option, index) => (
              <FormControlLabel key={`radio-item-${index}`} value={option.value} control={<Radio />}
                                label={option.label} />))}
          </RadioGroup>
          {invalid ? <FormHelperText>{error?.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
};

export default RadioGroupField;
