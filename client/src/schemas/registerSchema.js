import * as yup from 'yup';

const registerSchema = yup.object().shape({
  last_name: yup.string().required('Vui lòng nhập họ!').min(2, 'Họ phải có ít nhất 2 ký tự!'),
  first_name: yup.string().required('Vui lòng nhập tên!').min(2, 'Họ phải có ít nhất 2 ký tự!'),
  email: yup.string().email().required('Vui lòng nhập email!'),
  password: yup.string().required('Vui lòng nhập mật khẩu!').min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
  confirm_password: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu!')
    .oneOf([yup.ref('password')], 'Không khớp mật khẩu!'),
});

export default registerSchema;