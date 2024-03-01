import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import InputField from '../../../../components/InputField';
import React, { useEffect, useState } from 'react';

const AddOrEditDialog = ({ form, openDialog, handleClose, handleSubmit }) => {
  const [text, setText] = useState(null);

  useEffect(() => {
    let newText = text;
    if (openDialog === 'add') {
      newText = 'Thêm mới';
    } else if (openDialog === 'edit') {
      newText = 'Chỉnh sửa';
    }

    setText(newText);
  }, [openDialog]);

  return <Dialog
    open={!!openDialog}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
      {text} vai trò
    </DialogTitle>
    <DialogContent sx={{ width: '400px' }}>
      <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} margin="10px 0">
        <InputField
          form={form}
          name="code"
          label="Mã"
          required
        />
        <InputField
          form={form}
          name="name"
          label="Tên"
          required
        />

        <Box display="flex" justifyContent="flex-end" gap="10px" marginTop="20px">
          <Button variant="contained" type="submit" sx={{ textTransform: 'inherit' }}>
            {text}
          </Button>
          <Button variant="contained" onClick={handleClose} color="error"
                  sx={{ textTransform: 'inherit' }}>
            Hủy
          </Button>
        </Box>
      </Box>
    </DialogContent>
  </Dialog>;
};

export default AddOrEditDialog;