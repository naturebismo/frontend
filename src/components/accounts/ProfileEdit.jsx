import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Markdown from 'react-remarkable';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import ProfileEditMutation from './ProfileEdit.mutation';
import ProfileChangePassword from './ProfileChangePassword';
import { Form, FormGroup, FormControl, Col, ControlLabel, Button, Alert } from "react-bootstrap";
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';


class ProfileEdit extends React.Component {
  state = {username: '', first_name: '', email: '', errors: [], success: false}

  handleEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  handleUsernameChange = (e) => {
    this.setState({username: e.target.value});
  }

  handleFirstNameChange = (e) => {
    this.setState({first_name: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new ProfileEditMutation({
          username: this.state.username,
          first_name: this.state.first_name,
          email: this.state.email,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          if(response.meProfileEdit.errors.length > 0){
            this.setState({errors: response.meProfileEdit.errors});
          } else {
            this.setState({success: true});
          }
        },
      }
    );
  }

  componentWillMount() {
    var user = this.props.viewer.me;

    this.setState({
      username: user.username,
      first_name: user.firstName,
      email: user.email
    });
  }

  render() {
    var user = this.props.viewer.me;

    var success;
    if(this.state.success) {
      success = (<Alert bsStyle="success">Senha alterada com sucesso</Alert>);
    }
    
    return (
      <div className="profile-component">
        <Helmet
          title={user.username}
        />

        <div className="page-header" style={{marginTop: 0}}>
            <h1 style={{marginTop: 0}}>{user.username}</h1>
        </div>

        <Form onSubmit={this.handleSubmit} horizontal>
          <Errors errors={this.state.errors} />
          {success}

          <FormGroupError errors={this.state.errors} fieldname="username">
            <Col componentClass={ControlLabel} sm={2}>
              Usuário
            </Col>
            <Col sm={10}>
              <FormControl type="text"
                            placeholder="Nome de usuário unico na rede"
                            value={this.state.username}
                            onChange={this.handleUsernameChange} />
              <HelpBlockError errors={this.state.errors} fieldname="username" />
            </Col>
          </FormGroupError>

          <FormGroupError errors={this.state.errors} fieldname="first_name">
            <Col componentClass={ControlLabel} sm={2}>
              Nome
            </Col>
            <Col sm={10}>
              <FormControl type="text"
                            placeholder="Como gosta de ser chamado"
                            value={this.state.first_name}
                            onChange={this.handleFirstNameChange} />
              <HelpBlockError errors={this.state.errors} fieldname="first_name" />
            </Col>
          </FormGroupError>

          <FormGroupError errors={this.state.errors} fieldname="email">
            <Col componentClass={ControlLabel} sm={2}>
              E-mail
            </Col>
            <Col sm={10}>
              <FormControl type="email"
                            placeholder="E-mail"
                            value={this.state.email}
                            onChange={this.handleEmailChange} />
              <HelpBlockError errors={this.state.errors} fieldname="email" />
            </Col>
          </FormGroupError>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type="submit" bsStyle="primary">
                Alterar
              </Button>
            </Col>
          </FormGroup>
        </Form>

        <ProfileChangePassword viewer={this.props.viewer} />
      </div>
    );
  }
}

export default Relay.createContainer(ProfileEdit, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          id
          username
          firstName
          email
          isAuthenticated
        },
        ${ProfileEditMutation.getFragment('viewer')},
        ${ProfileChangePassword.getFragment('viewer')},
      }
    `,
  },
});
