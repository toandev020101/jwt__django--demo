import { Box, IconButton, TextField } from '@mui/material';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import React, { useState } from 'react';

const PasswordField = ({ variant, label, onChange, error, helperText }) => {
  const [show, setShow] = useState(false);

  return <Box position={'relative'}>
    <TextField fullWidth variant={variant} label={label} type={show ? 'text' : 'password'} required
               onChange={onChange} error={error} helperText={helperText} />
    <IconButton
      aria-label="showPassword"
      onClick={() => setShow(!show)}
      edge="end"
      sx={
        { position: 'absolute', top: error ? '11%' : '13%', right: '20px' }
      }
    >
      {show ? <BiShowAlt /> : <BiHide />}
    </IconButton>
  </Box>;
};

export default PasswordField;