import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import { Col } from "react-bootstrap";

import RelativeDate from '../nodes/relativeDate';

function renderAction(action) {
  var icon_class;
  if(action.type == "create") {
    icon_class = "fa-plus";
  }
  if(action.type == "change") {
    icon_class = "fa-pencil";
  }
  if(action.type == "delete") {
    icon_class = "fa-trash";
  }

  return (<div key={action.id}>
    <i className={`fa ${icon_class}`} aria-hidden="true"></i> {action.type} -> <Link to={`/revisions/revision/${action.id}`}>
    {action.object.__typename}:{action.object.id}</Link> | <i className="fa fa-clock-o" aria-hidden="true"></i> <RelativeDate date={action.createdAt} />
  </div>);
}

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
            return renderAction(edge.node);
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
        actions(first: 200) {
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
