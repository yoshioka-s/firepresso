import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUILink from '@material-ui/core/link';
import { Grid, Paper } from '@material-ui/core';
import "firebase/auth";
import { yellow, lightBlue } from '@material-ui/core/colors';

const styles = {
  root: {
    flexGrow: 0.3,
    background: yellow[200],
    paddingTop: '20px',
    paddingBottom: '50px',
    color: lightBlue[900]
  },
};

function MySideBar(props) {
  const { user, classes, db } = props;
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if (!user) {
      setList([])
      return
    }
    let query = db.collection(`users/${user.uid}/articles`).orderBy("created", "desc");
    const detacher = query.onSnapshot((snapshot) => {
      const list = [];
      snapshot.forEach((doc)=>{
        const article = doc.data();
        article.articleId = doc.id;
        list.push(article);
      });
      setList(list);
    }, (e) => {
      setError(e);
    });
    return detacher;
  }, [db, user]);

  return (
    <div className={classes.root}>
      新着記事
      {
        list.map(article => {
          return (
            <Paper key={article.articleId}>
              <MUILink
                to={`/article/${user.uid}/${article.articleId}`}>
                  <Grid container>
                    {article.title}
                  </Grid>
              </MUILink>
            </Paper>
          )

        })
      }
    </div>
  );
}

MySideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MySideBar);
