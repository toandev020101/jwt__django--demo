import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';

const RemoveDialog = ({ open, onClose, title, content, isLoading, onConfirm }) => {
  return <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px' }}>
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <LoadingButton
        loading={isLoading}
        loadingIndicator={'Loading...'}
        variant="contained"
        type="submit"
        sx={{
          textTransform: 'inherit',
        }}
        disabled={isLoading}
        onClick={() => {
          onClose();
          onConfirm();
        }}
      >
        Xác nhận
      </LoadingButton>

      <Button
        variant={'contained'}
        color={'error'}
        onClick={onClose}
        sx={{
          textTransform: 'capitalize',
        }}
      >
        Huỷ
      </Button>
    </DialogActions>
  </Dialog>;
};

export default RemoveDialog;