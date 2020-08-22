import React from "react";
import {makeStyles} from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";
import 'react-circular-progressbar/dist/styles.css';
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexFlow: "column",
        padding: "5%",
    },
}));

type Props = {};

export default function CreateChallenge({}: Props) {
    const classes = useStyles();
    const history = useHistory();
    const handleBack = {handleBack: () => history.goBack(), confirm: true};
    return (
        <PageWrapper label={"Create a challenge"}
                     navigationHandler={handleBack}
                     className={classes.wrapper}>
            {"create page"}
        </PageWrapper>
    );
}
