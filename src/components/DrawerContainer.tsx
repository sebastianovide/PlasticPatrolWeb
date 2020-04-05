import React, { Component } from "react";
import { Link } from "react-router-dom";

import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { tAndCLink, privatePolicyLink } from "static/info";

import { isIphoneWithNotchAndCordova, isIphoneAndCordova } from "utils";
import User from "types/User";
import Page from "types/Page";
import Stats from "types/Stats";
import config from "custom/config";

import "./DrawerContainer.scss";

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
    position: "absolute",
    bottom: theme.spacing(5),
    alignSelf: "center",
    paddingBottom: theme.spacing(2),
  },
  links: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.spacing(1),
    fontSize: "12px",
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

type NavBarItemBase = {
  visible: (user: User | undefined, online: boolean) => boolean;
  icon: React.ReactElement;
  label: string;
  click?: () => void;
};

type NavBarItemClick = NavBarItemBase & {
  onClick: () => void;
};

type NavBarItemPath = NavBarItemBase & {
  path: string;
};

type NavBarItem = NavBarItemPath | NavBarItemClick;

function isNavBarItemPath(
  item: NavBarItemPath | NavBarItemClick
): item is NavBarItemPath {
  return (item as NavBarItemPath).path !== undefined;
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
  const ListItemsTop: NavBarItem[] = [
    PAGES.account,
    PAGES.moderator,
    PAGES.feedbackReports,
    PAGES.tutorial,
    PAGES.leaderboard,
  ];
  const ListItemsConfigurable: NavBarItem = config.CUSTOM_PAGES;
  const LogInLogOut: NavBarItem = {
    visible: (user: User | undefined, online: boolean) => online,
    icon: <ExitToAppIcon />,
    label: user ? "Logout" : "Login",
    onClick: handleClickLoginLogout,
  };
  const ListItemsBottom: NavBarItem[] = [
    PAGES.about,
    PAGES.writeFeedback,
    LogInLogOut,
  ];
  const ListItems: NavBarItem[] = ListItemsTop.concat(
    ListItemsConfigurable,
    ListItemsBottom
  );
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
      {user && (
        <div>
          <div className="drawer-user">
            <Avatar
              alt="profile-image"
              src={user.photoURL}
              className="avatar"
              component={Link}
              to={PAGES.account.path}
              onClick={toggleLeftDrawer(false)}
            />
            <Typography className={"drawer-typography"}>
              {user.displayName}
            </Typography>
            {user.isModerator && <Typography>Admin</Typography>}
          </div>
          <Divider />
        </div>
      )}

      <div tabIndex={0} role="button" onClick={toggleLeftDrawer(false)}>
        <List>
          {ListItems.map((item: NavBarItem, index: number) => {
            if (!item.visible(user, online)) {
              return [];
            }

            if (isNavBarItemPath(item)) {
              return (
                <ListItem button key={index} component={Link} to={item.path}>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItem>
              );
            } else {
              return (
                <ListItem button key={index} onClick={item.onClick}>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItem>
              );
            }
          })}
        </List>
      </div>

      <Typography className={classes.stats} color={"secondary"}>
        {`${stats | 0} pieces found so far!`}
        {sponsorImage && (
          <span className="sponsored-by-container">
            <span
              className="sponsored-by-image"
              style={{ backgroundImage: "url(" + sponsorImage + ")" }}
            ></span>
          </span>
        )}
      </Typography>

      <div className="built-by-geovation">
        <Typography className="built-by-text">Built by</Typography>
        <img src={placeholderImage} className="built-by-img" alt={""} />
      </div>

      <Typography className={classes.links}>
        <a href={tAndCLink}>Terms and Conditions</a>
        {" / "}
        <a href={privatePolicyLink}>Privacy Policy</a>
      </Typography>
    </Drawer>
  );
}
