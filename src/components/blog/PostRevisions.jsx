import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const PostDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));


const pageSize = 30;

class PostRevisions extends React.Component {

  render() {
    var post = this.props.post;
    return (<div>
      <h1>{`Historico de alterações: ${post.title}`}</h1>
      <Table responsive>
        <Helmet
           title={`Historico de alterações: ${post.title}`}
        />
        <thead>
          <tr>
            <th>Alteração</th>
            <th>Autor</th>
            <th>Quando</th>
          </tr>
        </thead>
        <tbody>
          {post.revisions.edges.map(function(edge, i){
            var revision = edge.node;
            return (<tr key={i}>
                <td><Link to={`/revisions/post/revision/${revision.id}`}>{revision.id}</Link></td>
                <td>{revision.author.username}</td>
                <td><PostDate date={revision.createdAt} /></td>
              </tr>);
          })}
        </tbody>
      </Table>
    </div>);
  }
}

PostRevisions.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(PostRevisions, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        title
        revisions(first: $pageSize) {
          edges {
            node {
              id,
              author {
                username
              }
              parent {
                id
              }
              createdAt
            }
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
