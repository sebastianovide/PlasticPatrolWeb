import React, { Fragment } from "react";
import { Link as ReactLink } from "react-router-dom";

import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import User from "types/User";
import Page from "types/Page";
import { useTranslation } from "react-i18next";

type Props = {
  user: User | undefined;
  online: boolean;
  item: Page;
};

const DrawerContainerItem = (props: Props): JSX.Element => {
  const { user, online, item } = props;
  const { t } = useTranslation();

  if (item.visible && !item.visible(user, online)) {
    return <Fragment></Fragment>;
  }

  if (item.path.startsWith("http")) {
    return (
      <ListItem button component={Link} href={item.path}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={t(item.label)} />
      </ListItem>
    );
  } else {
    return (
      <ListItem button component={ReactLink} to={item.path}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={t(item.label)} />
      </ListItem>
    );
  }
};

export default DrawerContainerItem;
