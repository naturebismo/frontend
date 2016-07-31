import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";
import Markdown from 'react-remarkable';

import {markdownOptions} from "./Post";

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const PostDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class PostRevision extends React.Component {

  render() {
    var post = this.props.post;
    var revision = post.revision;
    var publishedAt = new Date(post.publishedAt);
    var publishedAt_str = publishedAt.toDateString() + ' ' + publishedAt.toTimeString();

    if(revision.before !== null) {
      var before = (<p>Alteração anterior: <Link to={`/revisions/post/revision/${revision.before.id}`}>{revision.before.id}</Link></p>);
    } else {
      var before = null;
    }

    if(revision.after.edges.length > 0) {
      var after = ( <p>Próxima alteração: {revision.after.edges.map(function(edge, i){
        var after_rev = edge.node;
        return (<span key={i}>{ i !== 0 ? ', ' : '' }<Link to={`/revisions/post/revision/${after_rev.id}`}>{after_rev.id}</Link></span>);
      })}</p>);
    } else {
      var after = null;
    }

    return (<div>
      <p>Alteração <strong>{revision.id}</strong> feita por {revision.author.username} <PostDate date={revision.createdAt} /></p>
     
      {after}
      {before}

      <div className="page-header" style={{marginTop: 0}}>
        <h1 style={{marginTop: 0}}>{post.title}</h1>

        {post.tags.edges.map(function(edge, i){
          var tag = edge.node;
          return (<Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link>);
        })}<br/>
        
        <i className="fa fa-clock-o" aria-hidden="true"></i> <PostDate date={post.publishedAt} />
      </div>

      <div id="postBody">
        <Markdown options={markdownOptions} container="div">{post.body}</Markdown>
      </div>
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
