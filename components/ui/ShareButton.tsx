"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Image from "next/image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ShareButton() {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiListItemIcon: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            minWidth: 40,
          },
        },
      },
    },
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Image
          src="/assets/share.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
          onClick={handleClick}
        />

        <ThemeProvider theme={theme}>
          <Popper id={id} open={open} anchorEl={anchorEl} sx={{ width: 250 }}>
            <Box sx={{ bgcolor: "background.paper", marginTop: "10px" }}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Copy link" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DraftsIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="Share post via..." />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Popper>
        </ThemeProvider>
      </div>
    </ClickAwayListener>
  );
}
