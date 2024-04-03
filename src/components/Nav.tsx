import React from "react";
import { AppBar, Toolbar, Typography, Box, Paper, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import drLogo from '../Images/dr-icon-2.png';

const styles = {
  // this group of buttons will be aligned to the right side
  toolbarButtons: {
    marginLeft: 'auto',
  },
};

export default function Nav({ }) {
  return (
    <>
      <AppBar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "left"
        }}
        position="relative"
        variant="elevation"
      >
        <Toolbar>
          {/* <GitHubIcon sx={{ mr: 2 }} fontSize="large" /> */}
          <Box display='flex' flexGrow={1}>
          <Box sx={{ mr: 2, width: '10%' }}
            component="img"
            alt="logo"
            src={drLogo}
          />
          <Stack direction="row" justifyContent="center" alignItems="center" >
            <Typography color="inherit" variant="h4"  noWrap sx={{ fontFamily: 'Quicksand'}}>
              DR Severity Predictor
            </Typography>
          </Stack>
          </Box>
          <Typography sx={{ mr: 3}}>Home</Typography>
          <Typography  sx={{ mr: 3 }}>About</Typography>
          <Typography  sx={{ mr: 3 }}>Bio</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
