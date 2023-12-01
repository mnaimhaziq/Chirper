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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface Props {
  id: string;
  content: string;
}

export default function ShareButton(props: Props) {
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
  const [snack, setSnack] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const snackOff = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  //Building link
  const hostname = window.location.hostname; // Only includes hostname
  const linkToCopy = `${window.location.protocol}//${hostname}/thread/${props.id}`;

  const clickCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setSnack(true);
    } catch (err) {
      console.log(err);
    }
  };

  //Building data to share
  const shareObject = {
    text: `"${props.content}"`,
    url: linkToCopy,
  };

  const clickShareLink = async () => {
    try {
      await navigator.share(shareObject);
    } catch (err) {
      console.log(err);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div>
      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={snackOff}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">Copied to clipboard</Alert>
      </Snackbar>
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
                  <ListItem disablePadding onClick={clickCopyLink}>
                    <ListItemButton sx={{ borderRadius: "12px 12px 0 0" }}>
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Copy link"
                        primaryTypographyProps={{ fontSize: "14px" }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={clickShareLink}>
                    <ListItemButton sx={{ borderRadius: "0 0 12px 12px" }}>
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
    </div>
  );
}
