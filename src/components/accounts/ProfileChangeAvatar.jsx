import React from 'react';
import Relay from 'react-relay';
import ProfileChangeAvatarMutation from './ProfileChangeAvatar.mutation';
import { Form, FormGroup, Col, ControlLabel, Button, Alert } from "react-bootstrap";
import { Errors, FormGroupError, HelpBlockError } from '../forms/errors';

class ProfileChangeAvatar extends React.Component {
  state = {avatar: '', errors: [], success: false}

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new ProfileChangeAvatarMutation({
          avatar: this.state.avatar,
          file: this.refs.fileInput.files.item(0),
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          this.setState({errors: response.meProfileChangeAvatar.errors});
          if(response.meProfileChangeAvatar.errors.length == 0){
            this.setState({success: true});
          }
        },
      }
    );
  }

  render() {
    var user = this.props.viewer.me;

    var success;
    if(this.state.success) {
      success = (<Alert bsStyle="success">Foto alterada com sucesso</Alert>);
    }

    var avatar;
    if(user.avatar) {
      avatar = (<div className="row">
          <Col sm={2}></Col>
          <Col sm={10}>
            <p><img src={user.avatar.x140x140} width="140" className="img-thumbnail" /></p>
          </Col>
        </div>);
    }

    return (
      <Form onSubmit={this.handleSubmit} horizontal>
        <Errors errors={this.state.errors} />
        {success}

        {avatar}

        <FormGroupError errors={this.state.errors} fieldname="avatar">
          <Col componentClass={ControlLabel} sm={2}>
            Imagem de exibição
          </Col>
          <Col sm={10}>
            <input type="file" ref="fileInput" className="form-control" />
            <HelpBlockError errors={this.state.errors} fieldname="avatar" />
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
    );
  }
}

export default Relay.createContainer(ProfileChangeAvatar, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id
        me {
          avatar {
            x140x140
          }
        }
        ${ProfileChangeAvatarMutation.getFragment('viewer')},
      }
    `,
  },
});
