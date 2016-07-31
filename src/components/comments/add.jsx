import React from 'react';
import Relay from 'react-relay';
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import CommentCreateMutation from './CommentCreate.mutation';


class CommentCreate extends React.Component {
  state = {body: ''}

  handleBodyChange = (e) => {
    this.setState({body: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Relay.Store.commitUpdate(
      new CommentCreateMutation({
          body: this.state.body,
          parent: this.props.parent,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          this.setState({body: ''});

          if(typeof this.props.onSuccess !== 'undefined') {
            this.props.onSuccess();
          }
        },
      }
    );
  }

  componentDidMount() {
    if(typeof this.props.onShown !== 'undefined') {
      this.props.onShown(this.refs.body);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="list-group-item">
        <FormGroup controlId="formControlsTextarea">
          <textarea rows="2" placeholder="Deixe seu comentário" className="form-control"
            onChange={this.handleBodyChange}
            value={this.state.body}
            ref="body"
          />
        </FormGroup>

        <Button type="submit">enviar comentário</Button>
      </form>
    );
  }
}

export default Relay.createContainer(CommentCreate, {
  fragments: {
    parent: () => Relay.QL`
      fragment on Node {
        id
        ${CommentCreateMutation.getFragment('parent')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${CommentCreateMutation.getFragment('viewer')},
      }
    `,
  },
});
