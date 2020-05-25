import React, { useState, useCallback, useEffect } from "react";

import Search from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import { Type } from "../../types";
import { getSuggestions, getLeafKey } from "./utils";

import styles from "standard.scss";

const useStyles = makeStyles(theme => ({
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: styles.lightGrey,
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: `${styles.mediumGrey} solid 1px`,
    marginBottom: theme.spacing(1)
  },
  input: {
    border: "none",
    background: styles.lightGrey,
    color: "black",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    "&:focus": {
      outline: "none"
    }
  },
  suggestion: {
    display: "flex",
    alignItems: "center",
    background: "#4e4e4e",
    color: "white",
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    width: "max-content",
    margin: `${theme.spacing(0.5)}px ${theme.spacing(1)}px ${theme.spacing(
      0.5
    )}px 0`
  },
  suggestionWrapper: {
    display: "flex",
    flexWrap: "wrap"
  }
}));

type Props = {
  setType: (type: Type) => void;
  className: string;
  initialType?: Type;
};

export default function TypeInput(props: Props) {
  const styles = useStyles();
  const [label, setLabel] = useState(props.initialType?.label || "");
  const [focused, setFocused] = useState(false);
  const outsideClickRef = useOnOutsideClick(() => setFocused(false));

  const suggestions = getSuggestions(label);
  const leafKey = getLeafKey(label);
  const onSuggestionClick = useCallback((suggestion: string) => {
    setLabel(suggestion);
    setFocused(false);
  }, []);

  useEffect(() => {
    props.setType({ leafKey, label });
  }, [leafKey]);

  const showMessage =
    (!focused && !leafKey) ||
    (focused && label.length >= 3 && suggestions.length === 0);

  return (
    //@ts-ignore
    <div ref={outsideClickRef} className={props.className}>
      <div className={styles.inputWrapper}>
        <Search />
        <input
          placeholder="    Search for litter ..."
          className={styles.input}
          value={label}
          onChange={e => setLabel(e.target.value)}
          onFocus={() => setFocused(true)}
        />
      </div>
      <div className={styles.suggestionWrapper}>
        {focused &&
          suggestions.map(({ label, key }) => (
            <Suggestion
              label={label}
              Key={key}
              key={`${label}-${key}`}
              className={styles.suggestion}
              onClick={onSuggestionClick}
            />
          ))}
        {showMessage && "Sorry, we don't this have this type in our database"}
      </div>
    </div>
  );
}

type SuggestionProps = {
  label: string;
  Key: string;
  className: string;
  onClick: (suggestion: string) => void;
};

function Suggestion({ label, className, onClick }: SuggestionProps) {
  return (
    <div className={className} onClick={() => onClick(label)}>
      {label}
    </div>
  );
}
