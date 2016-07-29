import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';

import VotingButtons from '../voting/buttons';
import CommentCreate from '../comments/add';
import CommentsList from '../comments/list';
import PostDelete from './PostDelete';

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const PostDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

var markdownOptions = {
  html: true,
};

class Post extends React.Component {
  render() {
    var post = this.props.post;
    var publishedAt = new Date(post.publishedAt);
    var publishedAt_str = publishedAt.toDateString() + ' ' + publishedAt.toTimeString();

    var postEditorActions = null;
    if(this.props.viewer.me !== null) { 
      if(this.props.viewer.me.isAuthenticated === true) {
        var postEditorActions = (<p>
            <Link to={`/blog/edit/${post.id}`}>
              Editar
            </Link> <PostDelete viewer={this.props.viewer} post={this.props.post} /> </p>);
      }
    }

    return (
      <div>
        <article role="article">
          <Helmet
            title={post.title}
          />
          
          <div className="page-header" style={{marginTop: 0}}>
            <h1 style={{marginTop: 0}}>{post.title}</h1>
            {post.tags.edges.map(function(edge, i){
              var tag = edge.node;
              return (<Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link>);
            })}<br/>
            <a href="#">9 gostaram</a> . <a href="#">1 não gostou</a> . <a href="#">{post.numComments} comentarios</a> . enviada por <a href="#">{ post.revisionCreated.author.username }</a> <i className="fa fa-clock-o" aria-hidden="true"></i> <PostDate date={post.publishedAt} />
          </div>
          
          <div id="postBody">
            <Markdown options={markdownOptions} container="div">{post.body}</Markdown>
          </div>

          <VotingButtons viewer={this.props.viewer} parent={this.props.post} votes={this.props.post.votes} />

          {postEditorActions}

          <p><Link to={`/revisions/post/${post.id}`}>{post.document.revisionsCount} revisions</Link></p>
        </article>

        <div className="list-group comments-list">
          <CommentCreate viewer={this.props.viewer} parent={this.props.post} />
          <CommentsList viewer={this.props.viewer} parent={this.props.post} />
        </div>
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
        document {
          revisionsCount
        },
        tags(first: 50) {
          edges {
            node {
              slug,
              title,
            }
          }
        },
        revisionCreated {
          author {
            username
          }
        }
        numComments,
        votes {
          ${VotingButtons.getFragment('votes')},
        }
        ${PostDelete.getFragment('post')},
        ${CommentsList.getFragment('parent')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentCreate.getFragment('viewer')},
        ${CommentsList.getFragment('viewer')},
        ${PostDelete.getFragment('viewer')},
        ${VotingButtons.getFragment('viewer')},
      }
    `,
  },
});
