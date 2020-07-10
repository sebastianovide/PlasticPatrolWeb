import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { ClickAwayListener, IconButton } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const CustomTooltip = ({ tooltip }: { tooltip: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div style={{ display: "inline-block" }}>
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={() => setOpen(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={tooltip}
        >
          <IconButton
            onClick={() => setOpen(true)}
            style={{ padding: "0px 12px 0px 12px" }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default CustomTooltip;
