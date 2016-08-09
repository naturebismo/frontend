import React from 'react';
import Relay from 'react-relay';
import ProfileChangePasswordMutation from './ProfileChangePassword.mutation';
import { Form, FormGroup, FormControl, Col, ControlLabel, Button, Alert } from "react-bootstrap";
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';

class ProfileChangePassword extends React.Component {
  state = {old_password: '', new_password1: '', new_password2: '', errors: [], success: false}

  handleOldPasswordChange = (e) => {
    this.setState({old_password: e.target.value});
  }

  handleNewPassword1Change = (e) => {
    this.setState({new_password1: e.target.value});
  }

  handleNewPassword2Change = (e) => {
    this.setState({new_password2: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new ProfileChangePasswordMutation({
          old_password: this.state.old_password,
          new_password1: this.state.new_password1,
          new_password2: this.state.new_password2,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          if(response.mePasswordChange.errors.length > 0){
            this.setState({errors: response.mePasswordChange.errors});
          } else {
            this.setState({success: true});
            this.setState({old_password: ''});
            this.setState({new_password1: ''});
            this.setState({new_password2: ''});
          }
        },
      }
    );
  }

  render() {
    var success;
    if(this.state.success) {
      success = (<Alert bsStyle="success">Senha alterada com sucesso</Alert>);
    }

    return (
      <Form onSubmit={this.handleSubmit} horizontal>
        <Errors errors={this.state.errors} />
        {success}

        <FormGroupError errors={this.state.errors} fieldname="old_password">
          <Col componentClass={ControlLabel} sm={2}>
            Senha antiga
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Senha"
                          value={this.state.old_password}
                          onChange={this.handleOldPasswordChange} />
            <HelpBlockError errors={this.state.errors} fieldname="old_password" />
          </Col>
        </FormGroupError>

        <FormGroupError errors={this.state.errors} fieldname="new_password1">
          <Col componentClass={ControlLabel} sm={2}>
            Nova senha
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Senha"
                          value={this.state.new_password1}
                          onChange={this.handleNewPassword1Change} />
            <HelpBlockError errors={this.state.errors} fieldname="new_password1" />
          </Col>
        </FormGroupError>

        <FormGroupError errors={this.state.errors} fieldname="new_password2">
          <Col componentClass={ControlLabel} sm={2}>
            Repetir nova senha
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Repita sua senha"
                          value={this.state.new_password2}
                          onChange={this.handleNewPassword2Change} />
            <HelpBlockError errors={this.state.errors} fieldname="new_password2" />
          </Col>
        </FormGroupError>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit" bsStyle="primary">
              Alterar senha
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default Relay.createContainer(ProfileChangePassword, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        ${ProfileChangePasswordMutation.getFragment('viewer')},
      }
    `,
  },
});
