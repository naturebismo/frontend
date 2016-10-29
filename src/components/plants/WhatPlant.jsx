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

import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const ProfileDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

class SuggestID extends React.Component {
  render() {
    return (<div>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          One fine body...
        </Modal.Body>

        <Modal.Footer>
          <Button>Close</Button>
          <Button bsStyle="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>);
  }
}

const pageSize = 10;

class Plant extends React.Component {
  state = {errors: [], when: '', where: '', notes: '',
           showSuggestionModal: false, search: '', 'searched': false}

  handleWhenChange = (e) => {
    this.setState({when: e.target.value});
  }
  handleWhereChange = (e) => {
    this.setState({where: e.target.value});
  }
  handleNotesChange = (e) => {
    this.setState({notes: e.target.value});
  }

  handleSearchChange = (e) => {
    this.setState({search: e.target.value});

    if(this.state.search.length > 2){
      this.props.relay.setVariables({
        search: this.state.search,
        searchSize: 10
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
    this.setState({showSuggestionModal: false});
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
        if(response.whatIsThisCreate.errors.length > 0){
          this.setState({errors: response.whatIsThisCreate.errors});
        } else {
          this.setState({when: '', where: '', notes: ''});
        }
      }
    };
  }

  render() {
    var searchResults;
    if(this.props.viewer.allLifeNode.edges.length > 0){
      searchResults = this.props.viewer.allLifeNode.edges.map(function(edge, i){
        var life = edge.node;
        return (<div key={life.id}>{life.title}</div>);
      });
    } else {
      if(this.state.searched){
        searchResults = (<div>
          Nada encontrado
          <Button bsStyle="primary">Adicionar Espécie</Button> com o nome "{this.state.search}"
        </div>);
      }
    }

    var suggestionModal = (<Modal show={this.state.showSuggestionModal} onHide={this.closeSuggestionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sugerir Identificação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você pode sugerir uma Espécie, Gênero ou Família.
          Por favor, dê preferencia por nomes cientificos mas também pode ser usado nomes comuns e locais.
          Caso a Espécie não for encontrada ela poderá ser cadastrada.</p>
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
        </Modal.Body>
      </Modal>);

    var that = this;

    var what_are_those = this.props.viewer.allWhatIsThis.edges.map(function(edge, i){
      var what = edge.node;

      var images = what.images.edges.map(function(edge, i){
        var image = edge.node;
        return (<img key={image.id} src={image.image.url} className="img-thumbnail" width="100" height="100" />);
      });

      return (<div key={what.id} className="panel panel-default">
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
          </ul>
          <Button onClick={that.openSuggestionModal}>
            Sugerir Indentificação
          </Button>
        </div>
      </div>);
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
                  Imagem de exibição
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

            {suggestionModal}
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Plant, {
  initialVariables: {
    pageSize: pageSize,
    searchSize: 1,
    search: '',
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
            }
          }
        }
        ${WhatIsThisCreateMutation.getFragment('viewer')},
        ${LoginRequired.getFragment('viewer')},
        allLifeNode(first: $searchSize, search: $search) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `,
  },
});
