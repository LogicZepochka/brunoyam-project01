"use client"

import { TextField, IconButton, Drawer, Box, Stack, Typography, Paper } from "@mui/material";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { useState } from "react";

interface FilterDrawerProps {
    open: boolean
    onClose: () => void
}


function FilterDrawer(props: FilterDrawerProps) {

    return (
        <Drawer 
            open={props.open}
            anchor="top"
            onClose={props.onClose}
        >
            <Box padding={3}>
                <Stack spacing={1}>
                    <Typography>Фильтры</Typography>
                    <Paper variant="outlined">
                        <Stack padding={1} spacing={1}>
                            dsds
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </Drawer>
    )
}

export default function SearchField() {
    
    const [openFilter,setOpenFilter] = useState(false);


    const closeFilter = () => {
        setOpenFilter(false)
    }

    return (
        <>
        <TextField color="info" size="small" fullWidth type="search" slotProps={{
            input: {
                endAdornment: (
                    <IconButton size="small" disableRipple onClick={() => {setOpenFilter(true)}}>
                        <TuneOutlinedIcon />
                    </IconButton>
                )
            }
        }} />
        <FilterDrawer open={openFilter} onClose={closeFilter} />
        </>
    )
}