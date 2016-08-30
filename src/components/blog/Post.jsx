import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';

import ProfileLink from '../accounts/ProfileLink';
import VotingButtons from '../voting/buttons';
import CommentsList from '../comments/list';
import PostDelete from './PostDelete';
import RelativeDate from '../nodes/relativeDate';

var markdownOptions = {
  html: false,
};

class Post extends React.Component {
  render() {
    var post = this.props.post;
    var publishedAt = new Date(post.publishedAt);
    var publishedAt_str = publishedAt.toDateString() + ' ' + publishedAt.toTimeString();

    var postEditorActions = null;
    if(this.props.viewer.me !== null) { 
      if(this.props.viewer.me.isAuthenticated === true) {
        var editButton;
        if(post.myPerms.indexOf('edit') >= 0) {
          editButton = (<Link to={`/blog/edit/${post.id}`}>
            <i className="fa fa-pencil" aria-hidden="true"></i> editar
          </Link>);
        }

        var deleteButton;
        if(post.myPerms.indexOf('delete') >= 0) {
          deleteButton = (<PostDelete viewer={this.props.viewer} post={this.props.post} />);
        }

        var postEditorActions = (<span>
            {editButton}<span> . </span>
            {deleteButton}
          </span>);
      }
    }

    return (
      <div className="post-component">
        <article role="article">
          <Helmet
            title={post.title}
          />
          
          <div className="page-header" style={{marginTop: 0}}>
            <h1 style={{marginTop: 0}}>{post.title}</h1>
            <p>{post.tags.edges.map(function(edge, i){
              var tag = edge.node;
              return (<span key={tag.id}><Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link> </span>);
            })}</p>
            Enviada por <ProfileLink user={post.revisionCreated.author} /> <i className="fa fa-clock-o"
              aria-hidden="true"></i> <RelativeDate date={post.publishedAt} /><span> . </span>
            <Link to={`/revisions/${post.id}`}>{post.document.revisionsCount} alterações</Link><span> . </span>
            {postEditorActions}
          </div>
          
          <div id="postBody">
            <Markdown options={markdownOptions} container="div">{post.body}</Markdown>
          </div>

          <VotingButtons viewer={this.props.viewer} voting={this.props.post.voting} />
        </article>

        <CommentsList
          viewer={this.props.viewer}
          commenting={this.props.post.commenting}
          expanded={true}
          replyFormExpanded={true}
        />
      </div>
    );
  }
}

export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id,
        url,
        title,
        body,
        publishedAt,
        myPerms,
        document {
          revisionsCount
        },
        tags(first: 50) {
          edges {
            node {
              id,
              slug,
              title,
            }
          }
        },
        revisionCreated {
          author {
            ${ProfileLink.getFragment('user')}
          }
        }
        commenting {
          count,
          ${CommentsList.getFragment('commenting', {replyFormExpanded: true, expanded: true})},
        },
        voting {
          ${VotingButtons.getFragment('voting')},
        }
        ${PostDelete.getFragment('post')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentsList.getFragment('viewer', {replyFormExpanded: true, expanded: true})},
        ${PostDelete.getFragment('viewer')},
        ${VotingButtons.getFragment('viewer')},
      }
    `,
  },
});
