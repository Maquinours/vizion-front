import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline'],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      ['link', 'image', 'video'],
    ],
  },
};

type QuillProps = ReactQuillProps;
export default function Quill({ ...field }: QuillProps) {
  return <ReactQuill modules={modules} theme="snow" placeholder="Contenu" {...field} />;
}
