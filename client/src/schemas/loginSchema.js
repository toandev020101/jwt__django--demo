import * as yup from 'yup';

const loginSchema = yup.object().shape({
    email: yup.string().required('Vui lòng nhập email!'),
    password: yup.string().required('Vui lòng nhập mật khẩu!'),
  });

export default loginSchema