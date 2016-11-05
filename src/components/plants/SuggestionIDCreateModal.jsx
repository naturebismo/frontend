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
import SuggestionIDSelectItem from './SuggestionIDSelectItem';
import SpeciesCreateMutation from './SpeciesCreate.mutation';

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const pageSize = 10;

class SuggestionIDCreate extends React.Component {
  state = {errors: [], showSuggestionModal: false,
            search: '', 'searched': false,
            lifeNodeCreate: false,
            species: '', genus: '', family: '', commonNames: '',
            createdSpecies: null}

  handleSearchChange = (e) => {
    this.setState({search: e.target.value});

    if(this.state.search.length > 2){
      this.props.relay.setVariables({
        search: this.state.search,
      });
      this.setState({searched: true});
    } else {
      this.setState({searched: false});
    }
  }

  openSuggestionModal = (e) => {
    e.preventDefault();
    this.setState({showSuggestionModal: true});
  }

  closeSuggestionModal = () => {
    this.setState({showSuggestionModal: false, search: '', searched: false});
  }

  startLifeNodeCreate = (e) => {
    this.setState({species: this.state.search});
    this.setState({lifeNodeCreate: true});
  }

  handleSpeciesChange = (e) => {
    this.setState({species: e.target.value});
  }

  handleGenusChange = (e) => {
    this.setState({genus: e.target.value});
  }

  handleFamilyChange = (e) => {
    this.setState({family: e.target.value});
  }

  handleCommonNamesChange = (e) => {
    this.setState({commonNames: e.target.value});
  }

  buildCommitCreateSpecies = () => {
    var that = this;

    return {
      commitUpdate: this.refs.loginRequired.refs.component.commitUpdate,
      mutation: new SpeciesCreateMutation({
          species: this.state.species,
          genus: this.state.genus,
          family: this.state.family,
          commonNames: this.state.commonNames,
          viewer: this.props.viewer}),
      onSuccess: (response) => {
        if(response.speciesCreate.errors && response.speciesCreate.errors.length > 0){
          that.setState({errors: response.speciesCreate.errors});
        } else {
          that.setState({species: '', genus: '', family: '', commonNames: '',
                         createdSpecies: response.speciesCreate.species});
        }
      }
    };
  }

  onSuccessSuggestionSelect = (response) => {
    this.closeSuggestionModal();
  }

  render() {
    var component;
    var viewer = this.props.viewer;
    var whatIsThis = this.props.whatIsThis;
    var onSuccessSuggestionSelect = this.onSuccessSuggestionSelect;

    if(this.state.lifeNodeCreate == false) {
      var searchResults;
      if(this.props.viewer.allLifeNode.edges.length > 0){
        var searchResultsList = this.props.viewer.allLifeNode.edges.map(function(edge, i){
          var life = edge.node;
          return (<SuggestionIDSelectItem
            key={life.id}
            lifeNode={life}
            viewer={viewer}
            whatIsThis={whatIsThis}
            onSuccess={onSuccessSuggestionSelect}
          />);
        });
        searchResults = (<ul className="list-group">{searchResultsList}</ul>);
      } else {
        if(this.state.searched){
          searchResults = (<div>
            <strong>{this.state.search}</strong> não encontrado. <Button bsStyle="primary" onClick={this.startLifeNodeCreate}>Adicionar espécie</Button>
          </div>);
        }
      }

      component = (<Modal.Body>
        <p>Você pode sugerir uma <u>espécie</u>, <u>gênero</u> ou <u>família</u>.
        Por favor, dê preferencia por <u>nomes cientificos</u>, mas também pode ser usado nomes comuns e locais.</p>
        <Form horizontal>
          <Errors errors={this.state.errors} />

          <FormGroupError errors={this.state.errors} fieldname="name">
            <Col sm={12}>
              <InputGroup>
                <InputGroup.Addon><i className="fa fa-search" aria-hidden="true"></i></InputGroup.Addon>
                <FormControl type="text"
                              value={this.state.search}
                              onChange={this.handleSearchChange}
                              placeholder="Mangifera indica, Mimosa pudica, Musa velutina, Banana..."
                />
                <HelpBlockError errors={this.state.errors} fieldname="name" />
              </InputGroup>
            </Col>
          </FormGroupError>
        </Form>

        {searchResults}
      </Modal.Body>);
    } else {
      if(!this.state.createdSpecies){
        component = (<Modal.Body>
          <Form>
            <p>Depois você poderá editar esta espécie para completar suas informações, por enquanto só precisamos
            dessas informações basicas:</p>

            <Errors errors={this.state.errors} />

            <FormGroupError errors={this.state.errors} fieldname="commonNames">
              <ControlLabel>Nome comum</ControlLabel>
              <FormControl type="text"
                            value={this.state.commonNames}
                            onChange={this.handleCommonNamesChange}
                            placeholder="Mangueira, Bananeira, Jaboticabeira..."
              />
              <HelpBlockError errors={this.state.errors} fieldname="commonNames" />
            </FormGroupError>

            <FormGroupError errors={this.state.errors} fieldname="species">
              <ControlLabel>Espécie</ControlLabel>
              <FormControl type="text"
                            value={this.state.species}
                            onChange={this.handleSpeciesChange}
                            placeholder="Mangifera indica, Mimosa pudica, Musa velutina, Banana..."
              />
              <HelpBlockError errors={this.state.errors} fieldname="species" />
            </FormGroupError>

            <FormGroupError errors={this.state.errors} fieldname="genus">
              <ControlLabel>Gênero</ControlLabel>
              <FormControl type="text"
                            value={this.state.genus}
                            onChange={this.handleGenusChange}
                            placeholder="Mangifera, Delonix, Phaseolus, Prunus..."
              />
              <HelpBlockError errors={this.state.errors} fieldname="genus" />
            </FormGroupError>

            <FormGroupError errors={this.state.errors} fieldname="family">
              <ControlLabel>Família</ControlLabel>
              <FormControl type="text"
                            value={this.state.family}
                            onChange={this.handleFamilyChange}
                            placeholder="Anacardiaceae, Fabaceae, Apiaceae..."
              />
              <HelpBlockError errors={this.state.errors} fieldname="family" />
            </FormGroupError>

            <LoadingButton
              type="submit"
              bsStyle="primary"
              buildCommit={this.buildCommitCreateSpecies}
              loadingText="salvando ..."
              ref="createSpeciesButton"
            >
              salvar
            </LoadingButton>
          </Form>
        </Modal.Body>);
      } else {
        component = (<Modal.Body><ul className="list-group">
          <SuggestionIDSelectItem
            lifeNode={this.state.createdSpecies}
            viewer={viewer}
            whatIsThis={whatIsThis}
            onSuccess={onSuccessSuggestionSelect}
          />
        </ul></Modal.Body>);
      }
    }

    var suggestionModal = (<Modal show={this.state.showSuggestionModal} onHide={this.closeSuggestionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sugerir Identificação</Modal.Title>
        </Modal.Header>
        {component}

        <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
      </Modal>);

    return suggestionModal;
  }
}


export default Relay.createContainer(SuggestionIDCreate, {
  initialVariables: {
    pageSize: pageSize,
    search: '',
  },
  fragments: {
    whatIsThis: () => Relay.QL`
      fragment on WhatIsThis {
        id,
        ${SuggestionIDSelectItem.getFragment('whatIsThis')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${LoginRequired.getFragment('viewer')},
        ${SuggestionIDSelectItem.getFragment('viewer')},
        allLifeNode(first: $pageSize, search: $search) {
          edges {
            node {
              id
              title
              rankDisplay
              commonNames
              parent {
                id
                title
                rankDisplay
              }
              ${SuggestionIDSelectItem.getFragment('lifeNode')}
            }
          }
        }
      }
    `,
  },
});

