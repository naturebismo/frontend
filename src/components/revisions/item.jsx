import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";
import Markdown from 'react-remarkable';

import ProfileLink from '../accounts/ProfileLink';
import {markdownOptions} from "../blog/Post";

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const PostDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class RevisionItem extends React.Component {

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
          
          <i className="fa fa-clock-o" aria-hidden="true"></i> <PostDate date={post.publishedAt} />
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
            aria-hidden="true"></i> <PostDate date={comment.revisionCreated.createdAt} />
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

    return (<div>
      <p>Alteração <strong>{revision.id}</strong> feita por {revision.author.username} <PostDate date={revision.createdAt} /></p>
     
      {after}
      {before}

      {revision_body}
    </div>);
  }
}

export default Relay.createContainer(RevisionItem, {
  fragments: {
    revision: () => Relay.QL`
      fragment on Revision {
        id
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
                avatar {
                  x140x140
                }
              },
              createdAt
            },
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
