import ReactSelect, { Props } from 'react-select';

type CustomSelectProps<T> = Readonly<Props<T>>;
export default function CustomSelect<T>({ ...props }: CustomSelectProps<T>) {
  return (
    <ReactSelect
      {...props}
      theme={(theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
          ...theme.colors,
          primary: '#31385A',
        },
      })}
    />
  );
}
