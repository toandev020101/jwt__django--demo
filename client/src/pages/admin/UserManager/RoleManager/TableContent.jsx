import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { Fragment } from 'react';
import { BiEdit, BiTrashAlt } from 'react-icons/bi';
import { dateFullFormat } from '../../../../utils/format';

const TableContent = ({
                        rows,
                        selectedArr,
                        handleSelectAllClick,
                        headCells,
                        isLoading,
                        rowsPerPage,
                        isSelected,
                        handleRowClick,
                        handleOpenEditDialog,
                        handleDeleteRowIndex,
                        handleChangePage,
                        handleChangeRowsPerPage,
                        total, page,
                      }) => {
  const theme = useTheme();

  const childTableCell = (headCell, row) => {
    if (!headCell.key)
      return null;

    if (headCell.key === 'modified_at')
      return <TableCell
        sx={{ fontSize: '14px' }}>{row[headCell.key] ? dateFullFormat(row[headCell.key]) : '--'}</TableCell>;

    if (headCell.key === 'users')
      return <TableCell>
        {row[headCell.key].length > 0 ?
          <AvatarGroup max={5} sx={{ flexDirection: 'row' }}>
            {row[headCell.key].map((user, i) => <Fragment key={`user-index-${i}`}>
              {user.avatar ? <Avatar alt={user.fullname} src={user.avatar} /> :
                <Avatar>{user.fullname.substring(0, 1)}</Avatar>}
            </Fragment>)}
          </AvatarGroup> : '--'}
      </TableCell>;

    return <TableCell
      sx={{ fontSize: '14px' }}>{row[headCell.key] ? row[headCell.key] : '--'}</TableCell>;
  };

  return <TableContainer component={Paper}>
    <Table
      sx={{
        minWidth: 500,
      }}
      aria-label="custom pagination table"
    >
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={selectedArr.length > 0 && selectedArr.length < rows.length - 1}
              checked={rows.length > 1 && selectedArr.length === rows.length - 1}
              onChange={handleSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>

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
                <Typography fontWeight={500}>{headCell.label}</Typography>
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <>
            {Array(rowsPerPage)
              .fill(0)
              .map((_row, idx) => (
                <TableRow key={`table-${idx}`}>
                  <TableCell sx={{ fontSize: '14px' }}>
                    <Skeleton variant="rounded" animation="wave" width="18px" height="18px">
                      <Checkbox />
                    </Skeleton>
                  </TableCell>

                  {headCells.map((headCell, i) => (
                    <Fragment key={`loading-item-${i}`}>
                      {headCell.key && headCell.key !== 'users' ? (
                        <TableCell>
                          <Skeleton animation="wave" width="100%">
                            <Typography>{headCell.label}</Typography>
                          </Skeleton>
                        </TableCell>
                      ) : <TableCell>
                        <Skeleton animation="wave" width="100%">
                          <AvatarGroup max={5}>
                            <Avatar>G</Avatar>
                            <Avatar>G</Avatar>
                            <Avatar>G</Avatar>
                            <Avatar>G</Avatar>
                            <Avatar>G</Avatar>
                          </AvatarGroup>
                        </Skeleton>
                      </TableCell>}
                    </Fragment>
                  ))}

                  <TableCell>
                    <Box display="flex" gap="10px">
                      <Skeleton animation="wave" variant="circular">
                        <IconButton>
                          <BiEdit />
                        </IconButton>
                      </Skeleton>

                      <Skeleton animation="wave" variant="circular">
                        <IconButton>
                          <BiTrashAlt />
                        </IconButton>
                      </Skeleton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </>
        ) : (
          <>
            {/* table content */}
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  key={`table-${row.id}`}
                  onClick={(event) => {
                    if (row.code !== 'admin') {
                      return handleRowClick(event, row.id);
                    }
                  }}
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  tabIndex={-1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                      disabled={row.code === 'admin'}
                    />
                  </TableCell>
                  {headCells.map((headCell, idx) => (
                    <Fragment key={`rowItem-${idx}`}>
                      {childTableCell(headCell, row)}
                    </Fragment>
                  ))}
                  <TableCell sx={{ fontSize: '14px' }}>
                    <Box display="flex" gap="10px">
                      <Tooltip title="Sửa">
                        <IconButton onClick={(e) => handleOpenEditDialog(e, index)}>
                          <BiEdit style={{ color: theme.palette.warning.main }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRowIndex(index);
                          }}
                          disabled={row.code === 'admin'}
                        >
                          <BiTrashAlt
                            style={{ color: row.code === 'admin' ? theme.palette.grey[400] : theme.palette.error.main }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
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
                  Không có vai trò nào!
                </TableCell>
              </TableRow>
            )}
            {/* table content */}
          </>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: total > 0 ? total : -1 }]}
            colSpan={headCells.length + 1}
            count={total > 0 ? total : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                'aria-label': 'Rows per page:',
              },
              native: true,
            }}
            labelRowsPerPage="Số hàng trên mỗi trang"
            labelDisplayedRows={({ from, to }) => `${from}–${to} / ${total}`}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  </TableContainer>;
};

export default TableContent;