import * as yup from 'yup';

const changePasswordSchema = yup.object().shape({
  password: yup.string().required('Vui lòng nhập mật khẩu cũ!'),
  new_password: yup.string().required('Vui lòng nhập mật khẩu mới!'),
  confirm_new_password: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu mới!')
    .oneOf([yup.ref('newPassword')], 'Không khớp mật khẩu!'),
});

export default changePasswordSchema;