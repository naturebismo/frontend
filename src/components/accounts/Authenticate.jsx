import React from 'react';
import Relay from 'react-relay';
import AuthenticateMutation from './Authenticate.mutation';
import { Form, FormGroup, FormControl, Col, ControlLabel, Button } from "react-bootstrap";

class Authenticate extends React.Component {
  state = {email: '', password: ''}

  handleEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new AuthenticateMutation({
          email: this.state.email,
          password: this.state.password,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          if(typeof this.props.callback === 'function'){
            this.props.callback();
          }
        },
      }
    );
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} horizontal>
        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>
            Email
          </Col>
          <Col sm={10}>
            <FormControl type="text"
                          placeholder="Email"
                          value={this.state.email}
                          onChange={this.handleEmailChange} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}>
            Password
          </Col>
          <Col sm={10}>
            <FormControl type="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.handlePasswordChange} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button type="submit">
              Sign in
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default Relay.createContainer(Authenticate, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        ${AuthenticateMutation.getFragment('viewer')},
      }
    `,
  },
});
