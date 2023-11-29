"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Image from "next/image";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

export default function ShareButton() {
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

        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
            Sharing Tiles
          </Box>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
