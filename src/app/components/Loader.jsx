// @ts-nocheck
"use client"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({loading, message}) => {
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
                className="flex-col"
            >
                <CircularProgress color="inherit" />
                <br/><br/>
                <p>{message}</p>
            </Backdrop>
        </div>
    );
}

export default Loader;