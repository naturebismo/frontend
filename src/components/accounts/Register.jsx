import React from 'react';
import Relay from 'react-relay';
import RegisterMutation from './Register.mutation';
import { Form, FormGroup, FormControl, Col, ControlLabel, Button } from "react-bootstrap";
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';

class Register extends React.Component {
  state = {username: '', first_name: '', email: '', password1: '', password2: '', errors: []}

  handleEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  handleUsernameChange = (e) => {
    this.setState({username: e.target.value});
  }

  handleFirstNameChange = (e) => {
    this.setState({first_name: e.target.value});
  }

  handlePassword1Change = (e) => {
    this.setState({password1: e.target.value});
  }

  handlePassword2Change = (e) => {
    this.setState({password2: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new RegisterMutation({
          username: this.state.username,
          first_name: this.state.first_name,
          email: this.state.email,
          password1: this.state.password1,
          password2: this.state.password2,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          if(response.registerAndAuthenticate.errors.length > 0){
            this.setState({errors: response.registerAndAuthenticate.errors});
          } else {
            if(typeof this.props.callback === 'function'){
              this.props.callback();
            }
          }
        },
      }
    );
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} horizontal>
        <Errors errors={this.state.errors} />

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

        <FormGroupError errors={this.state.errors} fieldname="password1">
          <Col componentClass={ControlLabel} sm={2}>
            Senha
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Senha"
                          value={this.state.password1}
                          onChange={this.handlePassword1Change} />
            <HelpBlockError errors={this.state.errors} fieldname="password1" />
          </Col>
        </FormGroupError>

        <FormGroupError errors={this.state.errors} fieldname="password2">
          <Col componentClass={ControlLabel} sm={2}>
            Senha
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Repita sua senha"
                          value={this.state.password2}
                          onChange={this.handlePassword2Change} />
            <HelpBlockError errors={this.state.errors} fieldname="password2" />
          </Col>
        </FormGroupError>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit" bsStyle="primary">
              Criar conta
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default Relay.createContainer(Register, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        ${RegisterMutation.getFragment('viewer')},
      }
    `,
  },
});
