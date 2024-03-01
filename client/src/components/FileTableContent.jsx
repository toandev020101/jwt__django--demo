import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { BiTrashAlt } from 'react-icons/bi';
import React, { Fragment } from 'react';
import { dateShortFormat } from '../utils/format';

const FileTableContent = ({ headCells, rows, handleDeleteRowIndex }) => {
  const theme = useTheme();

  const childTableCell = (headCell, row) => {
    if (!headCell.key)
      return null;

    if (headCell.key === 'birth_day')
      return <TableCell
        sx={{ fontSize: '14px' }}>{row[headCell.key] ? dateShortFormat(row[headCell.key]) : '--'}</TableCell>;

    return <TableCell
      sx={{ fontSize: '14px' }}>{row[headCell.key] ? row[headCell.key] : '--'}</TableCell>;
  };

  return <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
    <Table
      sx={{
        minWidth: '1000px',
      }}
      aria-label="custom pagination table"
    >
      <TableHead>
        <TableRow>
          {headCells.map((headCell, id) => (
            <TableCell
              key={`header-cell-item-${id}`}
              align={headCell.numeric ? 'right' : 'left'}
              sx={{ fontSize: '14px' }}
              width={headCell.width}
            >
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                sx={{
                  '&:hover  > div': {
                    opacity: 1,
                    visibility: 'visible',
                  },
                }}
              >
                <Typography fontWeight={500} fontSize={'15px'}>{headCell.label}</Typography>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {/* table content */}
        {rows.map((row, index) => {
          return (
            <TableRow
              key={`table-${row.id}`}
              hover
              role="checkbox"
              tabIndex={-1}
            >
              {headCells.map((headCell, idx) => (
                <Fragment key={`rowItem-${idx}`} sx={{ fontSize: '14px' }}>
                  {childTableCell(headCell, row)}
                </Fragment>
              ))}
              <TableCell sx={{ fontSize: '14px' }}>
                <Tooltip title="Xóa">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRowIndex(index);
                    }}
                  >
                    <BiTrashAlt
                      style={{ color: theme.palette.error.main }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}

        {rows.length === 0 && (
          <TableRow style={{ height: 53 }}>
            <TableCell
              colSpan={headCells.length + 1}
              align="center"
              sx={{ fontSize: '14px' }}
            >
              Tệp excel rỗng
            </TableCell>
          </TableRow>
        )}
        {/* table content */}
      </TableBody>
    </Table>
  </TableContainer>;
};

export default FileTableContent;