import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {FormattedMessage} from 'react-intl';
import { Media, Button, Col, Form, FormGroup, FormControl, ControlLabel, Modal } from "react-bootstrap";
import ProfileLink from '../accounts/ProfileLink';
import RelativeDate from '../nodes/relativeDate';
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';

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

class Plant extends React.Component {
  state = {errors: []}

  render() {
    var user = this.props.user;

    var plant = {
      name: 'Mangifera indica',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Mangoes_pic.jpg/220px-Mangoes_pic.jpg',
    }
    
    return (
      <div className="col-xs-12">
        <Helmet
          title={plant.name}
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

              <FormGroupError errors={this.state.errors} fieldname="location">
                <Col componentClass={ControlLabel} sm={2}>
                  Quando?
                </Col>
                <Col sm={10}>
                  <FormControl type="text"
                                placeholder="agora, hoje, ontem, 21/06/2010..." />
                  <HelpBlockError errors={this.state.errors} fieldname="location" />
                </Col>
              </FormGroupError>

              <FormGroupError errors={this.state.errors} fieldname="location">
                <Col componentClass={ControlLabel} sm={2}>
                  Onde?
                </Col>
                <Col sm={10}>
                  <FormControl type="text"
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
                                placeholder="O que mais você pode dizer sobre essa observação?"
                                />
                  <HelpBlockError errors={this.state.errors} fieldname="notes" />
                </Col>
              </FormGroupError>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit" bsStyle="primary">
                    Alterar imagem
                  </Button>
                </Col>
              </FormGroup>
            </Form>

            <div className="panel panel-default">
              <div className="panel-heading">
                    <img width={40} height={40} className="img-thumbnail pull-left" style={{maxWidth: "60px", marginRight: "15px"}}
                         src="https://naturebismo.com/public/cache/af/25/af25ee2e295e4c43021eeeee98f38b18.jpg"
                         alt="username" />
                    <span>
                    <a href="#">alisson</a>
                    <br />
                    <i className="fa fa-clock-o"
                      aria-hidden="true"></i> <RelativeDate date="2011-01-05T20:26:37" />
                    </span>
              </div>
              <div className="panel-body">
                <img src={plant.image} alt={plant.name} className="img-responsive" style={{width: '100px'}} />
                <p>Espécie, Genero ou Familia</p>
                <ul>
                  <li>Manga <a href="#">correta</a>, <a href="#">errada</a> (poder anexar motivo do voto</li>

                </ul>
                <Button>
                  Sugerir Indentificação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Plant, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username
          isAuthenticated
        },
      }
    `,
  },
});
