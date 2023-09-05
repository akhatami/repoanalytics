import React from 'react';
import { SvgIcon } from '@mui/material';
import { ReactComponent as MySvg } from '../assets/codecov.svg';


function CodecovIcon() {

    return(
        <SvgIcon>
            <MySvg/>
        </SvgIcon>
    )
}

export default CodecovIcon;
