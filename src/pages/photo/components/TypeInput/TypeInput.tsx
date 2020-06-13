import React, { useState, useCallback, useEffect, useRef } from "react";

import Search from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import { Type } from "../../types";
import { getSuggestions, getLeafKey, categoriesArr } from "./utils";

import styles from "standard.scss";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    display: "flex",
    width: "200%",
    alignItems: "center",
    background: styles.lightGrey,
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    border: `${styles.mediumGrey} solid 1px`,
    marginBottom: theme.spacing(1),
    boxSizing: "border-box"
  },
  viewListIcon: {
    opacity: "50%",
    cursor: "pointer",
    "&:hover": {
      opacity: "100%"
    },
    height: "24px"
  },
  input: {
    border: "none",
    background: styles.lightGrey,
    color: "black",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
    boxSizing: "border-box",
    width: "100%",
    textOverflow: "ellipsis",
    "&:focus": {
      outline: "none"
    },
    "&::placeholder": {
      fontSize: 11
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
    flexWrap: "wrap",
    width: "200%"
  },
  customTypeWarning: {
    opacity: 0.5,
    marginBottom: theme.spacing(1)
  },
  suggestionList: {
    listStyleType: "none",
    paddingLeft: "0px",
    marginTop: "0px",
    marginBottom: "0px"
  },
  suggestionListItem: {
    padding: "6px",
    marginLeft: "0",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,.05)"
    },
    "&:first-child": {
      paddingTop: "0px"
    },
    "&:last-child": {
      paddingBottom: "0px"
    }
  }
}));

type Props = {
  setType: (type: Type) => void;
  className: string;
  initialType?: Type;
};

export default function TypeInput({ initialType, className, setType }: Props) {
  const styles = useStyles();
  const [label, setLabel] = useState(initialType?.label || "");
  const [focused, setFocused] = useState(false);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const outsideClickRef = useOnOutsideClick(() => setFocused(false));

  const suggestions = getSuggestions(label);
  const leafKey = getLeafKey(label);
  const onSuggestionClick = useCallback((suggestion: string) => {
    setLabel(suggestion);
    setShowSuggestionList(false);
    setFocused(false);
  }, []);

  const setTypeRef = useRef(setType);
  const labelRef = useRef(label);
  useEffect(() => {
    labelRef.current = label;
  }, [label]);
  useEffect(() => {
    setTypeRef.current = setType;
  }, [setType]);

  useEffect(() => {
    setTypeRef.current({ leafKey, label: labelRef.current });
  }, [leafKey, label]);

  const showMessage =
    (!focused && !leafKey) ||
    (focused && label.length >= 3 && suggestions.length === 0);

  return (
    //@ts-ignore
    <div ref={outsideClickRef} className={className}>
      <div className={styles.inputWrapper}>
        <Search />
        <input
          placeholder='Search for the type of litter e.g. "plastic bottle" or "crisp packet"'
          className={styles.input}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        {showMessage && (
          <div
            className={styles.viewListIcon}
            onClick={() => setShowSuggestionList(true)}
          >
            <VisibilityIcon />
          </div>
        )}
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
        {showMessage && (
          <div className={styles.customTypeWarning}>
            Sorry we don't have this type in our database at the moment. Once
            you submit your collection it will be manually approved.
          </div>
        )}
      </div>
      <Dialog
        open={showSuggestionList}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <ul className={styles.suggestionList}>
            {categoriesArr.map(({ label }) => (
              <li
                onClick={() => onSuggestionClick(label)}
                className={styles.suggestionListItem}
              >
                {label}
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              setShowSuggestionList(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
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
