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
import LinkIcon from "@mui/icons-material/Link";
import IosShareIcon from "@mui/icons-material/IosShare";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function ShareButton() {
  const theme = createTheme({
    components: {
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#FFFFFF",
            fontSize: 20,
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
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            sx={{ width: 200 }}
            placement="right"
            disablePortal={true}
          >
            <Box className="rounded-xl shadow-[0_0_10px_-5px_rgba(0,0,0,0.1)] shadow-white bg-dark-2 text-white ml-[-20px]">
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Copy link"
                      primaryTypographyProps={{ fontSize: "14px" }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <IosShareIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Share post via..."
                      primaryTypographyProps={{ fontSize: "14px" }}
                    />
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
