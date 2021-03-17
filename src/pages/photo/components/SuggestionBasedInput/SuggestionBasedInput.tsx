import React, { useState, useCallback, useEffect, useMemo } from "react";

import Search from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";

import useOnOutsideClick from "hooks/useOnOutsideClick";

import { SuggestionBasedText } from "../../types";
import {
  getSuggestionsMatchingInput,
  getSuggestionId,
  getSortedSuggestions,
  SuggestionT
} from "./utils";

import styles from "standard.module.scss";
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
    "&:hover": {
      background: "#4e4e4e"
    },
    color: "white",
    textTransform: "none",
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
  sourceData: Object;
  inputPrompt: string;
  callback: (type: SuggestionBasedText) => void;
  className?: string;
  initialLabel?: string;
};

export default function SuggestionBasedInput({
  sourceData,
  inputPrompt,
  initialLabel,
  className,
  callback
}: Props) {
  const styles = useStyles();

  const [userInput, setUserInput] = useState(initialLabel || "");

  const [focused, setFocused] = useState(false);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const outsideClickRef = useOnOutsideClick(() => setFocused(false));

  const allSuggestions = useMemo(() => getSortedSuggestions(sourceData), [
    sourceData
  ]);

  const onSuggestionClick = useCallback((userInput: string) => {
    setUserInput(userInput);
    setShowSuggestionList(false);
    setFocused(false);
  }, []);

  const [suggestionsMatchingLabel, setMatchingSuggestions] = useState<
    SuggestionT[]
  >([]);
  useEffect(() => {
    const matches = getSuggestionsMatchingInput(allSuggestions, userInput);
    setMatchingSuggestions(matches);
  }, [allSuggestions, userInput]);

  useEffect(() => {
    callback({
      label: userInput,
      id: getSuggestionId(sourceData, userInput)
    });
  }, [userInput]);

  return (
    <div ref={outsideClickRef} className={className}>
      <div className={styles.inputWrapper}>
        <Search />
        <input
          placeholder={inputPrompt}
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onFocus={() => setFocused(true)}
        />

        <div
          className={styles.viewListIcon}
          onClick={() => setShowSuggestionList(true)}
        >
          <VisibilityIcon />
        </div>
      </div>
      <div className={styles.suggestionWrapper}>
        {focused &&
          suggestionsMatchingLabel.map(({ label }) => (
            <Button
              className={styles.suggestion}
              onClick={() => onSuggestionClick(label)}
              color="primary"
            >
              {label}
            </Button>
          ))}
      </div>
      <Dialog
        open={showSuggestionList}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <ul className={styles.suggestionList}>
            {allSuggestions.map(({ label }) => (
              <li
                key={label}
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
            onClick={() => {
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
