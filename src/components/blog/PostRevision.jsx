import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";

class PostRevision extends React.Component {

  render() {
    var post = this.props.post;
    var revision = post.revision;
    var publishedAt = new Date(post.publishedAt);
    var publishedAt_str = publishedAt.toDateString() + ' ' + publishedAt.toTimeString();

    if(revision.before !== null) {
      var before = (<p>Before: <Link to={`/revisions/post/revision/${revision.before.id}`}>{revision.before.id}</Link></p>);
    } else {
      var before = null;
    }

    if(revision.after.edges.length > 0) {
      var after = ( <p>After: {revision.after.edges.map(function(edge, i){
        var after_rev = edge.node;
        return (<span key={i}>{ i !== 0 ? ', ' : '' }<Link to={`/revisions/post/revision/${after_rev.id}`}>{after_rev.id}</Link></span>);
      })}</p>);
    } else {
      var after = null;
    }

    return (<div>
      <p>Revision {revision.id} by {revision.author.username} at {revision.createdAt}</p>
     
      {after}
      {before}

      <h1>{post.title}</h1>
      <div id="postBody">
        <div>{post.body}</div>
      </div>

      <p><i className="fa fa-clock-o" aria-hidden="true"></i> Published at {publishedAt_str}</p>
        
      <p>{post.tags.edges.map(function(edge, i){
        var tag = edge.node;
        return (<span key={i}>{ i !== 0 ? ', ' : '' }<Link to={`/tag/${tag.slug}`}>{tag.title}</Link></span>);
      })}</p>
    </div>);
  }
}

PostRevision.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(PostRevision, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
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
        },
        revision {
          id
          author {
            username
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
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
      }
    `,
  },
});
