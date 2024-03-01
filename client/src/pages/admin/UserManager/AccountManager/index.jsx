import { Box, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitlePage from '../../../../components/TitlePage';
import { toast } from 'react-toastify';
import RemoveDialog from '../../../../components/RemoveDialog';
import { useAuthContext } from '../../../../contexts/authContext';
import * as RoleApi from '../../../../apis/roleApi';
import * as UserApi from '../../../../apis/userApi';
import DetailOrAddOrEditDialog from './DetailOrAddOrEditDialog';
import TableContent from './TableContent';
import Header from './Header';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import roleSchema from '../../../../schemas/roleSchema';
import JWTManager from '../../../../utils/jwt';

const AccountManager = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedArr, setSelectedArr] = useState([]);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHandleDialog, setOpenHandleDialog] = useState(null);
  const [handleIndex, setHandleIndex] = useState(-1);
  const [deleteRowIndex, setDeleteRowIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [isVerifiedFilter, setIsVerifiedFilter] = useState('all');

  const { isAuthenticated } = useAuthContext();

  const headCells = [
    // các thành phần trên header
    {
      label: 'ID', // chữ hiển thị
      key: 'id', // key dùng để lấy value
      numeric: false, // là chữ số
      width: 60, // độ rộng của cột
    },
    {
      label: 'Ảnh đại diện',
      key: 'avatar',
      numeric: false,
      width: 130,
    },
    {
      label: 'Họ và tên',
      key: 'fullname',
      numeric: false,
      width: 120,
    },
    {
      label: 'Email',
      key: 'email',
      numeric: false,
      width: 150,
    },
    {
      label: 'Xác minh email',
      key: 'is_verified',
      numeric: false,
      width: 160,
    },
    {
      label: 'Vai trò',
      key: 'role',
      numeric: false,
      width: 120,
    },
    {
      label: 'Ngày cập nhật',
      key: 'modified_at',
      numeric: false,
      width: 180,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  useEffect(() => {
    const getAllRole = async () => {
      setIsLoading(true);
      try {
        const res = await RoleApi.getAll();
        const newRoles = res.result.data;
        setRoles(newRoles);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
      setIsLoading(false);
    };

    if (isAuthenticated) {
      getAllRole();
    }
  }, []);

  useEffect(() => {
    // bỏ chọn nếu lấy lại danh sách rows
    setSelectedArr([]);

    const getPagination = async () => {
      setIsLoading(true);
      try {
        const res = await UserApi.getPagination({
          _limit: rowsPerPage,
          _page: page,
          searchTerm,
          roleCode: roleFilter,
          isVerified: isVerifiedFilter,
        });

        const { data, total } = res.result;
        let newRows = data;

        if (newRows.length === 0 && page > 0) {
          setPage((prevPage) => prevPage - 1);
        }
        setRows(newRows);
        setTotal(total);
      } catch (error) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
        } else {
          navigate(`/error/${status}`);
        }
      }
      setIsLoading(false);
    };

    if (isAuthenticated) {
      getPagination();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, reload, isAuthenticated, roleFilter, isVerifiedFilter]);

  const form = useForm({
    defaultValues: {
      code: '',
      name: '',
    },
    resolver: yupResolver(roleSchema),
  });

  const handleOpenAddDialog = () => {
    setOpenHandleDialog('add');
    form.setValue('code', '');
    form.setValue('name', '');
  };

  const handleOpenDetailDialog = (e, index) => {
    e.stopPropagation();
    setOpenHandleDialog('detail');
    setHandleIndex(index);
    form.setValue('code', rows[index].code);
    form.setValue('name', rows[index].name);
  };

  const handleOpenEditDialog = (e, index) => {
    e.stopPropagation();
    setOpenHandleDialog('edit');
    setHandleIndex(index);
    form.setValue('code', rows[index].code);
    form.setValue('name', rows[index].name);
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (openHandleDialog === 'edit') {
        res = await RoleApi.updateOne(rows[handleIndex].id, values);
      } else {
        res = await RoleApi.addOne(values);
      }

      toast.success(res.detail, {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });
      setOpenHandleDialog(null);
      setHandleIndex(-1);
      setReload(!reload);
      form.reset();
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 403) {
        if (status === 400) {
          form.setError('code', { type: 'manual', message: data.detail });
        }

        toast.error(`${openHandleDialog === 'add' ? 'Thêm' : 'Chỉnh sửa'} tài khoản thất bại!`, {
          theme: 'colored',
          toastId: 'headerId',
          autoClose: 1500,
        });
      } else {
        navigate(`/error/${status}`);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenHandleDialog(null);
    setHandleIndex(-1);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let newSelectedArr = rows.map((row) => {
        if (row.id !== JWTManager.getUserId()) {
          return row.id;
        }
      });
      newSelectedArr = newSelectedArr.filter(selected => selected !== undefined);
      setSelectedArr(newSelectedArr);
      return;
    }
    setSelectedArr([]);
  };

  const handleRowClick = (_event, id) => {
    const selectedIndex = selectedArr.indexOf(id);
    let newSelectedArr = [];

    if (selectedIndex === -1) {
      newSelectedArr = newSelectedArr.concat(selectedArr, id);
    } else if (selectedIndex === 0) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(1));
    } else if (selectedIndex === selectedArr.length - 1) {
      newSelectedArr = newSelectedArr.concat(selectedArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedArr = newSelectedArr.concat(
        selectedArr.slice(0, selectedIndex),
        selectedArr.slice(selectedIndex + 1),
      );
    }
    setSelectedArr(newSelectedArr);
  };

  const isSelected = (id) => selectedArr.indexOf(id) !== -1;

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRowIndex = (index) => {
    setDeleteRowIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRow = async () => {
    setIsDeleteLoading(true);
    try {
      let res;
      if (deleteRowIndex === -1) {
        res = await UserApi.removeAny({ ids: selectedArr });
      } else {
        res = await UserApi.removeOne(rows[deleteRowIndex].id);
      }

      toast.success(res.detail, {
        theme: 'colored',
        toastId: 'headerId',
        autoClose: 1500,
      });

      setReload(!reload);
      setSelectedArr([]);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        toast.error(data.detail, { theme: 'colored', toastId: 'headerId', autoClose: 1500 });
      } else {
        navigate(`/error/${status}`);
      }
    }
    setIsDeleteLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => {
      setReload(!reload);
      setPage(0);
    }, 500);
  };

  return (
    <Box>
      <TitlePage title="EngQuizz - Quản lý tài khoản" />
      <Typography sx={{ marginBottom: '20px', fontSize: '18px' }}>Danh sách tài khoản</Typography>
      {/* list content */}
      <Box
        padding="20px"
        marginBottom="30px"
        sx={{
          bgcolor: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 3px',
          borderRadius: '5px',

          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              fontSize: '16px',
            },
          },
          '& label.Mui-focused': {
            fontSize: '16px',
          },
        }}
      >
        <Header searchTerm={searchTerm} handleSearchChange={handleSearchChange}
                filters={[{
                  value: roleFilter,
                  label: 'Vai trò',
                  handleChange: (e) => setRoleFilter(e.target.value),
                  options: [{ value: 'all', label: 'Tất cả' }, ...roles.map((role) => ({
                    value: role.code,
                    label: role.name,
                  }))],
                }, {
                  value: isVerifiedFilter,
                  label: 'Xác minh email',
                  handleChange: (e) => setIsVerifiedFilter(e.target.value),
                  options: [{ value: 'all', label: 'Tất cả' }, { value: 'true', label: 'Đã xác minh' }, {
                    value: 'false',
                    label: 'Chưa xác minh',
                  }],
                }]}
                selectedArr={selectedArr}
                handleOpenAddDialog={handleOpenAddDialog} handleDeleteRowIndex={handleDeleteRowIndex} />

        <TableContent rows={rows}
                      selectedArr={selectedArr}
                      handleSelectAllClick={handleSelectAllClick}
                      headCells={headCells}
                      isLoading={isLoading}
                      rowsPerPage={rowsPerPage}
                      isSelected={isSelected}
                      handleRowClick={handleRowClick}
                      handleOpenDetailDialog={handleOpenDetailDialog}
                      handleOpenEditDialog={handleOpenEditDialog}
                      handleDeleteRowIndex={handleDeleteRowIndex}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      total={total} page={page} />

        <DetailOrAddOrEditDialog form={form} openDialog={openHandleDialog} handleClose={handleDialogClose}
                                 handleSubmit={handleSubmit} />

        <RemoveDialog open={openDeleteDialog} onClose={handleDeleteDialogClose} title={'Xác nhận xóa tài khoản'}
                      content={`Bạn chắc chắn muốn xóa ${deleteRowIndex === -1 ? selectedArr.length + ' tài khoản này' : `tài khoản "${rows[deleteRowIndex]?.fullname}"`} hay không?`}
                      isLoading={isDeleteLoading} onConfirm={handleDeleteRow} />
      </Box>
      {/* list content */}
    </Box>
  );
};

export default AccountManager;