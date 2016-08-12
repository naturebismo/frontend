import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import { Col } from "react-bootstrap";

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const ProfileDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class Profile extends React.Component {
  render() {
    var user = this.props.user;
    
    return (
      <div className="profile-component">
        <Helmet
          title={user.username}
        />

        <Col sm={2}>
          <img src={user.avatar.x140x140} width="160" className="img-thumbnail" />
        </Col>
        <Col sm={10}>
          <div className="page-header" style={{marginTop: 0}}>
              <h1 style={{marginTop: 0}}>{user.username}</h1>
          </div>

          <h2>Últimas atividades</h2>
          {user.actions.edges.map(function(edge, i){
            var action = edge.node;
            return (<div>
              {action.type} -> {action.object.__typename}:{action.object.id} | <ProfileDate date={action.createdAt} />
            </div>);
          })}
        </Col>
      </div>
    );
  }
}

export default Relay.createContainer(Profile, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username
        firstName
        avatar {
          x140x140
        }
        actions(first: 10) {
          edges {
            node {
              id
              type
              createdAt
              object {
                id
                __typename
                
                ... on Vote {
                  value
                }
                
                ... on Comment {
                  body
                }
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
