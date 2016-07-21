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
          viewer: this.props.viewer})
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="list-group-item">
        <FormGroup controlId="formControlsTextarea">
          <FormControl componentClass="textarea" rows="2" placeholder="Deixe seu comentário"  onChange={this.handleBodyChange} />
        </FormGroup>

        <Button type="submit">enviar comentário</Button>
      </form>
    );
  }
}

export default Relay.createContainer(CommentCreate, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        ${CommentCreateMutation.getFragment('viewer')},
      }
    `,
  },
});
