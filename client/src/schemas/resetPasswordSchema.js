import * as yup from 'yup';

const resetPasswordSchema = yup.object().shape({
  new_password: yup.string().required('Vui lòng nhập mật khẩu!').min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
  new_password_confirm: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu!')
    .oneOf([yup.ref('new_password')], 'Không khớp mật khẩu!'),
});

export default resetPasswordSchema;