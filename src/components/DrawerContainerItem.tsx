import React from "react";
import { Link as ReactLink } from "react-router-dom";

import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import User from "types/User";
import Page from "types/Page";

type Props = {
  user: User | undefined;
  online: boolean;
  item: Page;
};

class DrawerContainerItem extends React.Component<Props, {}> {
  render() {
    const { user, online, item } = this.props;
    if (item.visible && !item.visible(user, online)) {
      return [];
    }

    if (item.path.startsWith("http")) {
      return (
        <ListItem button component={Link} href={item.path}>
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </ListItem>
      );
    } else {
      return (
        <ListItem button component={ReactLink} to={item.path}>
          {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </ListItem>
      );
    }
  }
}

export default DrawerContainerItem;
