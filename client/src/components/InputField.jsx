import { Box, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { BiHide, BiShowAlt } from 'react-icons/bi';

const InputField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, name, label, required, type, fix, readonly, ...others } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({
                 field: { onChange, onBlur, value, name, ref },
                 fieldState: { invalid, error },
               }) => (
        <Box position="relative" width="100%">
          <TextField
            onBlur={onBlur} // notify when input is touched
            value={value}
            onChange={onChange}
            name={name}
            label={`${label}${required ? ' *' : ''}`}
            inputRef={ref}
            InputProps={
              readonly && {
                readOnly: true,
              }
            }
            fullWidth
            {...others}
            error={invalid}
            helperText={error?.message}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  fontSize: '16px',
                },
              },
              '& label.Mui-focused': {
                fontSize: '16px',
              },

              '& fieldset, & label.Mui-error, & label': {
                fontSize: '16px',
              },

              '& input': {
                paddingRight: type === 'password' ? '50px' : '0',
              },

              '& p': {
                fontSize: '14px',
              },

              marginBottom: '10px',
            }}
          />

          {type === 'password' && (
            <IconButton
              aria-label="showPassword"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              sx={
                fix
                  ? { position: 'absolute', top: '0', right: '20px' }
                  : { position: 'absolute', top: invalid ? '11%' : '13%', right: '20px' }
              }
            >
              {showPassword ? <BiShowAlt /> : <BiHide />}
            </IconButton>
          )}
        </Box>
      )}
    />
  );
};

export default InputField;
