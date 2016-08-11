import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';

import VotingButtons from '../voting/buttons';
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
        var postEditorActions = (<span>
            <Link to={`/blog/edit/${post.id}`}>editar</Link><span> . </span>
            <PostDelete viewer={this.props.viewer} post={this.props.post} />
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
            {post.tags.edges.map(function(edge, i){
              var tag = edge.node;
              return (<Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link>);
            })}<br/>
            <a href="#">9 gostaram</a> . <a href="#">1 não gostou</a><span> . </span>
            <a href="#">{post.commenting.count} comentarios</a><span> . </span>
            enviada por <a href="#">{ post.revisionCreated.author.username }</a> <i className="fa fa-clock-o"
              aria-hidden="true"></i> <PostDate date={post.publishedAt} /><span> . </span>
            <Link to={`/revisions/post/${post.id}`}>{post.document.revisionsCount} alterações</Link><span> . </span>
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
