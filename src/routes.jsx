import React from 'react';
import { Route, IndexRoute } from 'react-router';

import loadingRender from './routeLoadingRender';

import ViewerQueries from './components/Viewer.queries';

import App from './components/App';

import Home from './components/Home';

import Post from './components/blog/Post';
import PostQueries from './components/blog/Post.queries';
import PostIDQueries from './components/blog/PostID.queries';
import PostCreate from './components/blog/PostCreate';
import PostEdit from './components/blog/PostEdit';

import RevisionsList from './components/revisions/list';
import RevisionItem from './components/revisions/item';
import RevisionIDQueries from './components/revisions/RevisionID.queries';
import NodeIDQueries from './components/nodes/NodeID.queries';

import Tag from './components/tags/Tag';
import {TagSlugQueries, TagIDQueries} from './components/tags/Tag.queries';
import TagEdit from './components/tags/TagEdit';
import Profile from './components/accounts/Profile';
import ProfileQueries from './components/accounts/Profile.queries';
import ProfileEdit from './components/accounts/ProfileEdit';

import Plant from './components/plants/Plant';
import WhatPlant from './components/plants/WhatPlant';

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
    <IndexRoute component={Home} queries={ViewerQueries} render={loadingRender} />
    <Route
      path="u/:username"
        component={Profile}
        queries={ProfileQueries}
        render={loadingRender} />
    <Route
      path="me/edit"
        component={ProfileEdit}
        queries={ViewerQueries}
        render={loadingRender} />
    <Route
      path="plant"
        component={Plant}
        queries={ViewerQueries}
        render={loadingRender} />
    <Route
      path="whatplant"
        component={WhatPlant}
        queries={ViewerQueries}
        render={loadingRender} />
    <Route
      path="blog/new"
        component={PostCreate}
        queries={ViewerQueries}
        render={loadingRender} />
    <Route
      path="blog/edit/:postID"
        component={PostEdit}
        queries={PostIDQueries}
        render={loadingRender} />
    <Route
      path="revisions/:nodeID"
        component={RevisionsList}
        queries={NodeIDQueries}
        render={loadingRender} />
    <Route
      path="revisions/revision/:revisionID"
        component={RevisionItem}
        queries={RevisionIDQueries}
        render={loadingRender} />
    <Route
      path="tag/:tagSlug"
        component={Tag}
        queries={TagSlugQueries}
        render={loadingRender} />
    <Route
      path="tag/edit/:tagID"
        component={TagEdit}
        queries={TagIDQueries}
        render={loadingRender} />
    <Route
      path="logout"
        component={Logout}
        render={loadingRender} />

    <Route
      path="*"
        component={Post}
        queries={PostQueries}
        prepareParams={preparePostParams}
        render={loadingRender} />
  </Route>
);