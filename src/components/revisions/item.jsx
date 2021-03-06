import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";
import Markdown from 'react-remarkable';

import LoginRequired from '../accounts/LoginRequired';
import ProfileLink from '../accounts/ProfileLink';
import {markdownOptions} from "../blog/Post";
import RevisionRevertMutation from './RevisionRevert.mutation';
import RelativeDate from '../nodes/relativeDate';

class RevisionItem extends React.Component {
  state = {}

  handleRevisionRevert = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new RevisionRevertMutation({
          revision: this.props.revision,
          node: this.props.revision.object}),
      {
        onSuccess: (response) => {
          window.location.reload(false);
        }
      }
    );
  }

  render() {
    var revision = this.props.revision;
    var object = revision.object;

    var revision_body;
    if(object.__typename === 'Post') {
      var post = object;
      var publishedAt = new Date(post.publishedAt);
      var publishedAt_str = publishedAt.toDateString() + ' ' + publishedAt.toTimeString();

      revision_body = (<div>
        <div className="page-header" style={{marginTop: 0}}>
          <h1 style={{marginTop: 0}}>{post.title}</h1>

          {post.tags.edges.map(function(edge, i){
            var tag = edge.node;
            return (<Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link>);
          })}<br/>
          
          <i className="fa fa-clock-o" aria-hidden="true"></i> <RelativeDate date={post.publishedAt} />
        </div>

        <div id="postBody">
          <Markdown options={markdownOptions} container="div">{post.body}</Markdown>
        </div>
      </div>);
    }

    if(object.__typename === 'Comment') {
      var comment = object;

      revision_body = (<div>
        <div className="page-header" style={{marginTop: 0}}>
          <h1 style={{marginTop: 0}}>Comentário: {comment.id}</h1>
          
          <ProfileLink user={comment.revisionCreated.author} /> . <i className="fa fa-clock-o"
            aria-hidden="true"></i> <RelativeDate date={comment.revisionCreated.createdAt} />
        </div>

        <div id="postBody">
          <Markdown options={markdownOptions} container="div">{comment.body}</Markdown>
        </div>
      </div>);
    }

    if(revision.before !== null) {
      var before = (<p>Alteração anterior: <Link to={`/revisions/revision/${revision.before.id}`}>{revision.before.id}</Link></p>);
    } else {
      var before = null;
    }

    if(revision.after.edges.length > 0) {
      var after = ( <p>Próxima alteração: {revision.after.edges.map(function(edge, i){
        var after_rev = edge.node;
        return (<span key={i}>{ i !== 0 ? ', ' : '' }<Link to={`/revisions/revision/${after_rev.id}`}>{after_rev.id}</Link></span>);
      })}</p>);
    } else {
      var after = null;
    }

    var current;
    if(revision.isTip) {
      current = (<p>
        <span className="label label-success">
          <i className="fa fa-check" aria-hidden="true"></i> atual
        </span>
      </p>);
    } else {
      current = (<p>
        <button className="btn btn-primary" onClick={this.handleRevisionRevert}>reverter para esta versão</button>
        <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
      </p>);
    }

    return (<div className="col-xs-12">
      <p>Alteração <strong>{revision.id}</strong> feita por <ProfileLink user={revision.author} /> <RelativeDate date={revision.createdAt} /></p>

      {after}
      {before}

      {current}

      {revision_body}
    </div>);
  }
}

export default Relay.createContainer(RevisionItem, {
  fragments: {
    revision: () => Relay.QL`
      fragment on Revision {
        id
        isTip
        author {
          ${ProfileLink.getFragment('user')}
        }
        createdAt
        after(first: 50) {
          edges {
            node {
              id
            }
          }
        }
        before {
          id
        }
        object {
          id
          __typename

          ... on Post {
            title,
            body,
            publishedAt,
            tags(first: 50) {
              edges {
                node {
                  slug,
                  title,
                }
              }
            }
          }

          ... on Comment {
            body,
            revisionCreated {
              author {
                username
                avatar(width: 60, height: 60) {
                  url
                }
              },
              createdAt
            },
          }
          ${RevisionRevertMutation.getFragment('node')}
        }
        ${RevisionRevertMutation.getFragment('revision')}
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        ${LoginRequired.getFragment('viewer')},
      }
    `,
  },
});
