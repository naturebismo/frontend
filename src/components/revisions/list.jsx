import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Table } from "react-bootstrap";

import ProfileLink from '../accounts/ProfileLink';

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

class RevisionsList extends React.Component {

  render() {
    var node = this.props.node;

    if(node.__typename === 'Post') {
      var title = node.title;
    }

    if(node.__typename === 'Comment') {
      var title = "Comentário " + node.id;
    }

    return (<div>
      <h1>{`Historico de alterações: ${title}`}</h1>
      <Table responsive>
        <Helmet
           title={`Historico de alterações: ${title}`}
        />
        <thead>
          <tr>
            <th>Alteração</th>
            <th>Autor</th>
            <th>Quando</th>
          </tr>
        </thead>
        <tbody>
          {node.revisions.edges.map(function(edge, i){
            var revision = edge.node;

            var current;
            if(revision.isTip) {
              current = (<span className="label label-success"><i className="fa fa-check" aria-hidden="true"></i> atual</span>);
            }
    
            return (<tr key={i}>
                <td><Link to={`/revisions/revision/${revision.id}`}>{revision.id}</Link> {current}</td>
                <td><ProfileLink user={revision.author} /></td>
                <td><PostDate date={revision.createdAt} /></td>
              </tr>);
          })}
        </tbody>
      </Table>
    </div>);
  }
}

export default Relay.createContainer(RevisionsList, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    node: () => Relay.QL`
      fragment on Node {
        id

        ... on Post {
          title
          __typename
          revisions(first: $pageSize) {
            edges {
              node {
                id
                isTip
                author {
                  ${ProfileLink.getFragment('user')}
                }
                createdAt
              }
            }
          }
        }

        ... on Comment {
          __typename
          revisions(first: $pageSize) {
            edges {
              node {
                id
                isTip
                author {
                  ${ProfileLink.getFragment('user')}
                }
                createdAt
              }
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  },
});
