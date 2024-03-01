import * as yup from 'yup';

const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

const registerSchema = yup.object().shape({
  fullname: yup.string().required('Vui lòng nhập họ và tên!').min(4, 'Họ và tên phải có ít nhất 4 ký tự!'),
  gender: yup.string().required('Vui lòng nhập giới tính!'),
  birth_day: yup
    .date()
    .max(maxDate, 'Bạn phải đủ 18 tuổi trở lên để đăng ký.')
    .required('Vui lòng nhập ngày sinh!'),
  email: yup.string().email().required('Vui lòng nhập email!'),
  password: yup.string().required('Vui lòng nhập mật khẩu!').min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu!')
    .oneOf([yup.ref('password')], 'Không khớp mật khẩu!'),
});

export default registerSchema;