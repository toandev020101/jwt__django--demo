import * as yup from 'yup';

const roleSchema = yup.object().shape({
  code: yup.string().required('Vui lòng nhập mã!'),
  name: yup.string().required('Vui lòng nhập tên!'),
});

export default roleSchema;