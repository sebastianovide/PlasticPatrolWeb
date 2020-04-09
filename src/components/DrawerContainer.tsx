import React, { Component } from "react";
import { Link } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { tAndCLink, privatePolicyLink } from "static/info";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "utils";
import User from "types/User";
import Page from "types/Page";
import config from "custom/config";

const placeholderImage =
  process.env.PUBLIC_URL + "/images/geovation-banner.svg";
const drawerWidth = "80%";
const drawerMaxWidth = 360;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerMaxWidth,
  },
  stats: {
    bottom: theme.spacing(5),
  },
  links: {
    paddingBottom: theme.spacing(1),
    fontSize: "12px",
  },
  sponsoredByContainer: {
    height: "25px",
    width: "100%",
    display: "block",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const PAGES = config.PAGES;

type Props = {
  user: User | undefined;
  online: boolean;
  leftDrawerOpen: boolean;
  stats: number;
  sponsorImage: string;
  toggleLeftDrawer: (open: boolean) => () => void;
  handleClickLoginLogout: () => void;
};

function renderListItem(
  user: User | undefined,
  online: boolean,
  item: Page,
  index: number
): React.ReactNode {
  if (item.visible && !item.visible(user, online)) {
    return [];
  }

  if (typeof item.target === "string") {
    return (
      <ListItem button key={index} component={Link} to={item.target}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
      </ListItem>
    );
  } else {
    return (
      <ListItem button key={index} onClick={item.target}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
      </ListItem>
    );
  }
}

export default function DrawerContainer({
  user,
  online,
  leftDrawerOpen,
  stats,
  sponsorImage,
  toggleLeftDrawer,
  handleClickLoginLogout,
}: Props) {
  const theme = useTheme();
  const classes = useStyles();
  const logInLogOut: Page = {
    visible: (user: User | undefined, online: boolean) => online,
    icon: <ExitToAppIcon />,
    label: user ? "Logout" : "Login",
    target: handleClickLoginLogout,
  };
  const listItemsTop: Page[] = [PAGES.account, PAGES.moderator];
  const listItemsTopUnderBreak: Page[] = [
    PAGES.feedbackReports,
    PAGES.leaderboard,
    PAGES.cleanUps,
  ];
  const listItemsBottom: Page[] = [
    PAGES.tutorial,
    PAGES.about,
    PAGES.writeFeedback,
    logInLogOut,
  ];
  return (
    <Drawer
      className="geovation-drawercontainer"
      open={leftDrawerOpen}
      onClose={toggleLeftDrawer(false)}
      classes={{ paper: classes.drawerPaper }}
    >
      <div
        style={{
          paddingTop: isIphoneWithNotchAndCordova()
            ? "env(safe-area-inset-top)"
            : isIphoneAndCordova
            ? theme.spacing(1.5)
            : undefined,
        }}
      />
      <div
        tabIndex={0}
        role="button"
        onClick={toggleLeftDrawer(false)}
        className={classes.container}
      >
        <div>
          <List>
            {listItemsTop.map((item, idx) =>
              renderListItem(user, online, item, idx)
            )}
            <Divider />
            {listItemsTopUnderBreak.map((item, idx) =>
              renderListItem(user, online, item, idx)
            )}
          </List>
        </div>
        <div>
          <List>
            {listItemsBottom.map((item, idx) =>
              renderListItem(user, online, item, idx)
            )}
          </List>

          <div className={classes.info}>
            <Typography className={classes.stats} color={"secondary"}>
              {`${stats | 0} pieces found so far!`}
            </Typography>
            {sponsorImage && (
              <span
                className={classes.sponsoredByContainer}
                style={{ backgroundImage: "url(" + sponsorImage + ")" }}
              />
            )}

            <Typography className={classes.links}>
              <a href={tAndCLink}>Terms and Conditions</a>
              {" / "}
              <a href={privatePolicyLink}>Privacy Policy</a>
            </Typography>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
