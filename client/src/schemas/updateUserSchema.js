import * as yup from 'yup';

const updateUserSchema = yup.object().shape({
  last_name: yup.string().required('Vui lòng nhập họ!').min(2, 'Họ phải có ít nhất 2 ký tự!'),
  first_name: yup.string().required('Vui lòng nhập tên!').min(2, 'Họ phải có ít nhất 2 ký tự!'),
  gender: yup.string().oneOf(['Nam', 'Nữ']),
  phone_number: yup.string(),
  avatar: yup.string(),
});

export default updateUserSchema;