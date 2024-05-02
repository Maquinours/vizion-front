import ReactSelect, { GroupBase, Props } from 'react-select';

type CustomSelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Readonly<Props<Option, IsMulti, Group>>;
export default function CustomSelect<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(
  props: CustomSelectProps<Option, IsMulti, Group>,
) {
  return (
    <ReactSelect
      {...props}
      loadingMessage={() => 'Chargement...'}
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
