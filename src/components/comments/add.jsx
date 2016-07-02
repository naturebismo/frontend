import React from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";

import LikeDislikeButtons from '../likes/buttons';

export default class CommentAdd extends React.Component {
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="list-group-item">
        <FormGroup controlId="formControlsTextarea">
          <FormControl componentClass="textarea" rows="2" placeholder="comment" />
        </FormGroup>

        <Button type="submit">enviar comentário</Button>
      </form>
    );
  }
}
