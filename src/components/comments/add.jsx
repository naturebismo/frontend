import React from 'react';
import Relay from 'react-relay';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import CommentCreateMutation from './CommentCreate.mutation';
import LoginRequired from '../accounts/LoginRequired';
import LoadingButton from '../forms/RelayLoadingButton';


class CommentCreate extends React.Component {
  state = {body: ''}

  handleBodyChange = (e) => {
    this.setState({body: e.target.value});
  }

  buildCommit = () => {
    return {
      commitUpdate: this.refs.loginRequired.refs.component.commitUpdate,
      mutation: new CommentCreateMutation({
          body: this.state.body,
          commenting: this.props.commenting,
          viewer: this.props.viewer}),
      onSuccess: (response) => {
        this.setState({body: ''});

        if(typeof this.props.onSuccess !== 'undefined') {
          this.props.onSuccess();
        }
      }
    };
  }

  componentDidMount() {
    if(typeof this.props.onShown !== 'undefined') {
      this.props.onShown(this.refs.body);
    }
  }

  render() {
    return (
      <form className="list-group-item">
        <FormGroup controlId="formControlsTextarea">
          <textarea rows="2" placeholder="Deixe seu comentário" className="form-control"
            onChange={this.handleBodyChange}
            value={this.state.body}
            ref="body"
          />
        </FormGroup>

        <LoadingButton
          type="submit"
          buildCommit={this.buildCommit}
          loadingText="enviando ..."
        >
          enviar comentário
        </LoadingButton>

        <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
      </form>
    );
  }
}

export default Relay.createContainer(CommentCreate, {
  fragments: {
    commenting: () => Relay.QL`
      fragment on Commenting {
        id
        ${CommentCreateMutation.getFragment('commenting')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${CommentCreateMutation.getFragment('viewer')},
        ${LoginRequired.getFragment('viewer')},
      }
    `,
  },
});
