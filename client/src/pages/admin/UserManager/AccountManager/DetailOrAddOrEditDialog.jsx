import { Box, Button, Dialog, DialogContent, DialogTitle, styled, Tab, Typography, useTheme } from '@mui/material';
import InputField from '../../../../components/InputField';
import React, { useEffect, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { FaCloudArrowUp } from 'react-icons/fa6';
import FileTableContent from '../../../../components/FileTableContent';
import RemoveDialog from '../../../../components/RemoveDialog';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { deSerialDate } from '../../../../utils/format';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DetailOrAddOrEditDialog = ({ form, openDialog, handleClose, handleSubmit }) => {
  const theme = useTheme();
  const [text, setText] = useState(null);
  const [tab, setTab] = useState('1');
  const [rows, setRows] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(-1);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const headCells = [
    // các thành phần trên header
    {
      label: 'STT', // chữ hiển thị
      key: 'stt',
      numeric: false, // là chữ số
      width: 60, // độ rộng của cột
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
      label: 'Giới tính',
      key: 'gender',
      numeric: false,
      width: 150,
    },
    {
      label: 'Ngày sinh',
      key: 'birth_day',
      numeric: false,
      width: 150,
    },
    {
      label: 'Địa chỉ',
      key: 'address',
      numeric: false,
      width: 150,
    },
    {
      label: 'Vai trò',
      key: 'role',
      numeric: false,
      width: 120,
    },
    {
      label: 'Thao tác',
      numeric: false,
    },
  ];

  useEffect(() => {
    let newText = text;
    if (openDialog === 'add') {
      newText = 'Thêm mới';
    } else if (openDialog === 'edit') {
      newText = 'Chỉnh sửa';
    } else if (openDialog === 'detail') {
      newText = 'Xem chi tiết';
    }

    setText(newText);
  }, [openDialog]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Xử lý dữ liệu ở đây
          let newRows = [];
          jsonData.map((row, index) => {
            if (index > 0) {
              if (!row[1] || !row[2] || !row[3] || !row[4] || !row[6]) {
                toast.error('Vui lòng nhập các trường cần thiết!', {
                  theme: 'colored',
                  toastId: 'headerId',
                  autoClose: 1500,
                });
                return;
              }

              const newRow = {
                stt: row[0],
                fullname: row[1],
                email: row[2],
                gender: row[3],
                birth_day: deSerialDate(row[4]),
                address: row[5],
                role: row[6],
              };
              newRows.push(newRow);
            }
          });

          setRows(newRows);
        } catch (error) {
          toast.error('Tệp excel không hợp lệ!', {
            theme: 'colored',
            toastId: 'headerId',
            autoClose: 1500,
          });
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleDeleteRowIndex = (index) => {
    setOpenDeleteDialog(true);
    setDeleteRowIndex(index);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteRow = (index) => {
    setIsDeleteLoading(true);
    const newRows = rows.splice(index, 1);
    setRows(newRows);
    setIsDeleteLoading(false);
  };

  return <Box width={'100%'}>
    <Dialog
      open={!!openDialog}
      onClose={() => {
        handleClose();
        setRows([]);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px' }}>
        {text} tài khoản
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} margin="10px 0">
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(e, newTab) => setTab(newTab)} centered>
                <Tab label="Thêm thủ công" value="1" sx={{ textTransform: 'inherit', fontSize: '15px' }} />
                <Tab label="Thêm bằng tệp Excel" value="2" sx={{ textTransform: 'inherit', fontSize: '15px' }} />
              </TabList>
            </Box>

            <TabPanel value="1">
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
            </TabPanel>

            <TabPanel value="2">
              <InputField
                form={form}
                name="password"
                label="Mật khẩu"
                required
              />

              <Typography marginTop={'20px'}>Danh sách tài khoản</Typography>
              {rows.length > 0 ?
                <FileTableContent headCells={headCells} rows={rows} handleDeleteRowIndex={handleDeleteRowIndex} /> :
                <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}
                     marginTop={'10px'}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<FaCloudArrowUp
                      style={{ color: theme.palette.common.white, fontSize: '24px', marginTop: '-3px' }} />}
                    sx={{ textTransform: 'inherit' }}
                  >
                    Tải lên từ tệp
                    <VisuallyHiddenInput type="file"
                                         accept=".xlsx"
                                         onChange={handleFileUpload} />
                  </Button>

                  <Typography marginTop={'20px'} fontStyle={'italic'} fontSize={'15px'}>Vui lòng soạn tài khoản theo
                    đúng
                    định dạng. <a href={'/templates/user_template.xlsx'}
                                  style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Tải về tệp mẫu
                      Excel</a></Typography>
                </Box>}
            </TabPanel>
          </TabContext>

          <Box display="flex" justifyContent="center" gap="10px" marginTop="20px">
            {openDialog !== 'detail' ?
              <Button variant="contained" type="submit" sx={{ textTransform: 'inherit' }}>
                {text}
              </Button> : null}
            <Button variant="contained" onClick={() => {
              handleClose();
              setRows([]);
            }} color="error"
                    sx={{ textTransform: 'inherit' }}>
              {openDialog === 'detail' ? 'Đóng' : 'Hủy'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>;

    <RemoveDialog open={openDeleteDialog} onClose={handleDeleteDialogClose} title={'Xác nhận xóa tài khoản'}
                  content={`Bạn chắc chắn muốn xóa tài khoản ${rows[deleteRowIndex]?.fullname} hay không?`}
                  isLoading={isDeleteLoading} onConfirm={handleDeleteRow} />
  </Box>;
};

export default DetailOrAddOrEditDialog;