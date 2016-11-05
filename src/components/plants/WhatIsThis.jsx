import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import ReactList from "react-list";
import {FormattedMessage} from 'react-intl';
import { Media, Button, Col, Form, FormGroup, FormControl, ControlLabel, Modal, InputGroup } from "react-bootstrap";

import LoginRequired from '../accounts/LoginRequired';
import LoadingButton from '../forms/RelayLoadingButton';
import ProfileLink from '../accounts/ProfileLink';
import RelativeDate from '../nodes/relativeDate';
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';
import WhatIsThisCreateMutation from './WhatIsThisCreate.mutation';
import SuggestionIDCreate from './SuggestionIDCreateModal';

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const pageSize = 10;

class WhatIsThis extends React.Component {
  state = {}

  openSuggestionModal = (e) => {
    this.refs.suggestionIDCreate.refs.component.openSuggestionModal(e);
  }

  render() {
    var what = this.props.whatIsThis;

    var images = what.images.edges.map(function(edge, i){
      var image = edge.node;
      return (<img key={image.id} src={image.image.url} className="img-thumbnail" width="100" height="100" />);
    });

    var suggestions = what.suggestions.edges.map(function(edge, i){
      var suggestion = edge.node;
      return (<li key={suggestion.id}>{suggestion.identification.title} por <ProfileLink user={suggestion.author} /></li>);
    });


    return (<div className="panel panel-default">
      <div className="panel-heading clearfix">
        <img width={40} height={40} className="img-thumbnail pull-left" style={{maxWidth: "60px", marginRight: "15px"}}
          src="https://naturebismo.com/public/cache/af/25/af25ee2e295e4c43021eeeee98f38b18.jpg"
          alt="username" />
        <span>
          <ProfileLink user={what.revisionCreated.author} />
          <br />
          <i className="fa fa-clock-o"
            aria-hidden="true"></i> <RelativeDate date={what.revisionCreated.createdAt} />
        </span>
      </div>
      <div className="panel-body">
        {images}

        <p>{what.when}</p>
        <p>{what.where}</p>
        <p>{what.notes}</p>
        
        <ul>
          <li>Manga <a href="#">correta</a>, <a href="#">errada</a> (poder anexar motivo do voto</li>
          {suggestions}
        </ul>

        <SuggestionIDCreate whatIsThis={what} viewer={this.props.viewer} ref="suggestionIDCreate" />

        <Button onClick={this.openSuggestionModal} >
          Sugerir Indentificação
        </Button>
      </div>
    </div>);
  }
}

export default Relay.createContainer(WhatIsThis, {
  fragments: {
    whatIsThis: () => Relay.QL`
      fragment on WhatIsThis {
        id
        when
        where
        notes
        revisionCreated {
          author {
            avatar(width: 60, height: 60) {
              url
            }
            ${ProfileLink.getFragment('user')}
          },
          createdAt
        }
        images(first: 20) {
          edges {
            node {
              id
              image(width: 100, height: 100) {
                url
              }
            }
          }
        }
        suggestions(first: 100) {
          edges {
            node {
              id
              author {
                ${ProfileLink.getFragment('user')}
              }
              identification {
                id
                title
              }
            }
          }
        }
        ${SuggestionIDCreate.getFragment('whatIsThis')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${SuggestionIDCreate.getFragment('viewer')},
      }
    `,
  },

});
