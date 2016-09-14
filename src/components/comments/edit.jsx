import React from 'react';
import Relay from 'react-relay';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import CommentEditMutation from './CommentEdit.mutation';
import LoginRequired from '../accounts/LoginRequired';
import LoadingButton from '../forms/RelayLoadingButton';


class CommentEdit extends React.Component {
  state = {body: ''}

  handleBodyChange = (e) => {
    this.setState({body: e.target.value});
  }

  buildCommit = () => {
    return {
      commitUpdate: this.refs.loginRequired.refs.component.commitUpdate,
      mutation: new CommentEditMutation({
          body: this.state.body,
          comment: this.props.comment,
          viewer: this.props.viewer}),
      onSuccess: (response) => {
        if(typeof this.props.onSuccess !== 'undefined') {
          this.props.onSuccess();
        }
      }
    };
  }

  componentWillMount() {
    this.setState({body: this.props.comment.body});
  }
  
  componentDidMount() {
    if(typeof this.props.onShown !== 'undefined') {
      this.props.onShown(this.refs.body);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{marginBottom: "10px"}}>
        <FormGroup controlId="formControlsTextarea">
          <textarea rows="2" className="form-control"
            onChange={this.handleBodyChange}
            value={this.state.body}
            ref="body"
          />
        </FormGroup>

        <LoadingButton
          type="submit"
          buildCommit={this.buildCommit}
          loadingText="salvando ..."
        >
          salvar alteração
        </LoadingButton>

        <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
      </form>
    );
  }
}

export default Relay.createContainer(CommentEdit, {
  fragments: {
    comment: () => Relay.QL`
      fragment on Comment {
        id
        body,
        ${CommentEditMutation.getFragment('comment')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${CommentEditMutation.getFragment('viewer')},
        ${LoginRequired.getFragment('viewer')},
      }
    `,
  },
});
