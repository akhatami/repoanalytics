import React from 'react';
import { SvgIcon } from '@mui/material';
import { ReactComponent as MySvg } from '../assets/coveralls.svg';


function CoverallsIcon() {

    return(
        <SvgIcon>
            <MySvg/>
        </SvgIcon>
    )
}

export default CoverallsIcon;
