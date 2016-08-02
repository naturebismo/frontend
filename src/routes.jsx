import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ViewerQueries from './components/Viewer.queries';

import App from './components/App';

import Home from './components/Home';

import Post from './components/blog/Post';
import PostQueries from './components/blog/Post.queries';
import {PostIDQueries, PostRevisionIDQueries} from './components/blog/PostID.queries';
import PostCreate from './components/blog/PostCreate';
import PostEdit from './components/blog/PostEdit';
import PostRevision from './components/blog/PostRevision';
import PostRevisions from './components/blog/PostRevisions';

import Tag from './components/tags/Tag';
import {TagSlugQueries, TagIDQueries} from './components/tags/Tag.queries';
import TagEdit from './components/tags/TagEdit';
import Profile from './components/accounts/Profile';
import ProfileQueries from './components/accounts/Profile.queries';

import Logout from './components/accounts/Logout';

function preparePostParams(params, route) {
  return {
    postURL: params.splat
  }
}

export default (
  <Route
    path="/" component={App}
    queries={ViewerQueries}
  >
    <IndexRoute component={Home} queries={ViewerQueries} />
    <Route
      path="u/:username" component={Profile} queries={ProfileQueries} />
    <Route
      path="blog/new" component={PostCreate} queries={ViewerQueries} />
    <Route
      path="blog/edit/:postID" component={PostEdit}
      queries={PostIDQueries} />
    <Route
      path="blog/*" component={Post}
      queries={PostQueries}
      prepareParams={preparePostParams} />
    <Route
      path="revisions/post/revision/:revisionID" component={PostRevision}
      queries={PostRevisionIDQueries} />
    <Route
      path="revisions/post/:postID" component={PostRevisions}
      queries={PostIDQueries} />
    <Route
      path="tag/:tagSlug" component={Tag}
      queries={TagSlugQueries} />
    <Route
      path="tag/edit/:tagID" component={TagEdit}
      queries={TagIDQueries} />
    <Route
      path="logout" component={Logout} />
  </Route>
);