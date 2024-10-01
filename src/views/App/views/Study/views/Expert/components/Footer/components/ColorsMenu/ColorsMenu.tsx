import { Button, Fade, FormControl, FormControlLabel, Menu, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import { RiArrowUpSLine } from 'react-icons/ri';
import { useShallow } from 'zustand/react/shallow';
import DensityColors from '../../../Flow/utils/enums/DensityColors';
import useStore, { RFState } from '../../../Flow/utils/store';

const selector = (state: RFState) => {
  const page = state.pages.at(state.currentPage);
  return {
    setPageColors: state.setPageColors,
    pageColors: page?.type === 'density' ? page.colors : undefined,
  };
};

export default function AppViewStudyViewExpertViewFooterComponentColorsMenuComponent() {
  const { setPageColors, pageColors } = useStore(useShallow(selector));

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setPageColors(Number(value) as DensityColors);
  };

  return (
    <>
      <Button
        id="colors-button"
        aria-controls={open ? 'colors-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="btn btn-primary flex gap-1"
      >
        <span className="normal-case">Couleurs de densité</span>
        <RiArrowUpSLine size={15} />
      </Button>
      <Menu
        id="colors-menu"
        MenuListProps={{
          'aria-labelledby': 'colors-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={pageColors ?? DensityColors.DEFAULT}
            onChange={handleChange}
          >
            <FormControlLabel value={DensityColors.DEFAULT} control={<Radio />} label="Défaut" style={{ marginLeft: 0 }} />
            <FormControlLabel value={DensityColors.COLORED} control={<Radio />} label="Coloré" style={{ marginLeft: 0 }} />
          </RadioGroup>
        </FormControl>
      </Menu>
    </>
  );
}
