import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { BiSearchAlt, BiTrashAlt } from 'react-icons/bi';
import { FiPlusSquare } from 'react-icons/fi';
import React from 'react';

const Header = ({ searchTerm, handleSearchChange, selectedArr, handleOpenAddDialog, handleDeleteRowIndex }) => {
  return <Box display="flex" justifyContent="space-between" marginBottom="20px">
    <Box display="flex" alignItems={'center'} gap={'10px'}>
      <TextField
        id="outlined-basic"
        label="Tìm kiếm vai trò"
        variant="outlined"
        size="small"
        sx={{ width: '250px' }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <BiSearchAlt fontSize="20px" />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {selectedArr.length > 0 && (
        <Button
          variant="contained"
          color="error"
          startIcon={<BiTrashAlt />}
          sx={{
            textTransform: 'capitalize',
          }}
          onClick={() => handleDeleteRowIndex(-1)}
        >
          Xóa ({selectedArr.length})
        </Button>
      )}
    </Box>

    <Button
      variant="contained"
      startIcon={<FiPlusSquare />}
      sx={{ textTransform: 'inherit' }}
      onClick={handleOpenAddDialog}
    >
      Thêm mới
    </Button>
  </Box>;
};

export default Header;