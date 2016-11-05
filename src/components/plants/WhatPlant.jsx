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
import WhatIsThis from './WhatIsThis';
import SuggestionIDCreate from './SuggestionIDCreateModal';

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const pageSize = 10;

class Plant extends React.Component {
  state = {errors: [], when: '', where: '', notes: ''}

  handleWhenChange = (e) => {
    this.setState({when: e.target.value});
  }
  handleWhereChange = (e) => {
    this.setState({where: e.target.value});
  }
  handleNotesChange = (e) => {
    this.setState({notes: e.target.value});
  }

  buildCommit = () => {
    return {
      commitUpdate: this.refs.loginRequired.refs.component.commitUpdate,
      mutation: new WhatIsThisCreateMutation({
          when: this.state.when,
          where: this.state.where,
          notes: this.state.notes,
          images: this.refs.fileInput.files,
          viewer: this.props.viewer}),
      onSuccess: (response) => {
        if(response.whatIsThisCreate.errors && response.whatIsThisCreate.errors.length > 0){
          this.setState({errors: response.whatIsThisCreate.errors});
        } else {
          this.setState({when: '', where: '', notes: ''});
        }
      }
    };
  }

  render() {
    var viewer = this.props.viewer;

    var what_are_those = this.props.viewer.allWhatIsThis.edges.map(function(edge, i){
      var what = edge.node;
      return (<WhatIsThis key={what.id} whatIsThis={what} viewer={viewer} />);
    });
    
    return (
      <div className="col-xs-12">
        <Helmet
          title="Que Planta?"
        />

        <div className="page-header" style={{marginTop: 0}}>
          <h1 style={{marginTop: 0}}>Últimas identificações</h1>
        </div>

        <div className="row">
          <div className="col-md-12">

            <h1>Que planta é essa?</h1>

            <Form horizontal>
              <Errors errors={this.state.errors} />

              <FormGroupError errors={this.state.errors} fieldname="images">
                <Col componentClass={ControlLabel} sm={2}>
                  Imagens
                </Col>
                <Col sm={10}>
                  <input type="file" ref="fileInput" className="form-control" multiple />
                  <HelpBlockError errors={this.state.errors} fieldname="images" />
                </Col>
              </FormGroupError>

              <FormGroupError errors={this.state.errors} fieldname="when">
                <Col componentClass={ControlLabel} sm={2}>
                  Quando?
                </Col>
                <Col sm={10}>
                  <FormControl type="text"
                                value={this.state.when}
                                onChange={this.handleWhenChange}
                                placeholder="agora, hoje, ontem, 21/06/2010..." />
                  <HelpBlockError errors={this.state.errors} fieldname="when" />
                </Col>
              </FormGroupError>

              <FormGroupError errors={this.state.errors} fieldname="location">
                <Col componentClass={ControlLabel} sm={2}>
                  Onde?
                </Col>
                <Col sm={10}>
                  <FormControl type="text"
                                value={this.state.where}
                                onChange={this.handleWhereChange}
                                placeholder="Rua Jatoba, Mariana, MG" />
                  <HelpBlockError errors={this.state.errors} fieldname="location" />
                </Col>
              </FormGroupError>

              <FormGroupError errors={this.state.errors} fieldname="notes">
                <Col componentClass={ControlLabel} sm={2}>
                  Informações adicinais
                </Col>
                <Col sm={10}>
                  <FormControl componentClass="textarea"
                                value={this.state.notes}
                                onChange={this.handleNotesChange}
                                placeholder="O que mais você pode dizer sobre essa observação?"
                                />
                  <HelpBlockError errors={this.state.errors} fieldname="notes" />
                </Col>
              </FormGroupError>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <LoadingButton
                    type="submit"
                    bsStyle="primary"
                    buildCommit={this.buildCommit}
                    loadingText="enviando ..."
                  >
                    enviar
                  </LoadingButton>

                  <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
                </Col>
              </FormGroup>
            </Form>

            {what_are_those}
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Plant, {
  initialVariables: {
    pageSize: pageSize,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
          isAuthenticated
        },
        allWhatIsThis(first: $pageSize) {
          edges {
            node {
              id
              ${WhatIsThis.getFragment('whatIsThis')}
            }
          }
        }
        ${WhatIsThisCreateMutation.getFragment('viewer')},
        ${LoginRequired.getFragment('viewer')},
        ${WhatIsThis.getFragment('viewer')},
      }
    `,
  },
});
