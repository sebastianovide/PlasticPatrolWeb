import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
const { App: CapApp } = Plugins;

const AppUrlListener: React.FC<any> = () => {
  let history = useHistory();
  useEffect(() => {
    CapApp.addListener("appUrlOpen", (data: any) => {
      // Example url: https://app.plasticpatrol.co.uk/#/missions/o5yLf4RokBn1GXm07BDu
      // slug = /missions/o5yLf4RokBn1GXm07BDu
      const slug = data.url.split("#").pop();
      if (slug) {
        history.push(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, [history]);

  return null;
};

export default AppUrlListener;
