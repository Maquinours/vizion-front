import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline'],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      ['link'],
      [
        {
          color: [
            '', // Default
            '#5dc896', // Green
            '#f08c62', // Orange
            '#e26868', // Red
            '#16204e', // Grey
          ],
        },
      ],
    ],
  },
};

type QuillProps = Readonly<ReactQuill.ReactQuillProps>;
export default function Quill({ ...field }: QuillProps) {
  return <ReactQuill modules={modules} theme="snow" placeholder="Contenu" {...field} />;
}
