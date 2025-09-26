
import { AppBar, Box, Container, IconButton, Stack, TextField, Toolbar } from "@mui/material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SearchField from "../SearchField/SearchField";




export default function AppBarComponent() {

    

    return (
        <AppBar color="inherit" variant="outlined" sx={{
            border: "1px"
        }} position="sticky">
            <Toolbar>
                    <Stack width="100%" padding={0.5} spacing={0.5} direction="row" alignItems="center" justifyContent="space-between">
                        <SearchField />
                        <IconButton size="medium">
                            <Person2OutlinedIcon />
                        </IconButton>
                    </Stack>
            </Toolbar>
        </AppBar>
    )
}