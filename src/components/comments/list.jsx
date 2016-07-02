import React from 'react';
import { Media } from "react-bootstrap";

import LikeDislikeButtons from '../likes/buttons';

export default class CommentsList extends React.Component {
  render() {
    return (
      <div className="list-group-item">
        <Media>
          <Media.Left>
            <img width={64} height={64} src="/assets/thumbnail.png" alt="Image"/>
          </Media.Left>
          <Media.Body>
            <Media.Heading>Media Heading</Media.Heading>
            <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
            <LikeDislikeButtons/>
            <Media>
              <Media.Left>
                <img width={64} height={64} src="/assets/thumbnail.png" alt="Image"/>
              </Media.Left>
              <Media.Body>
                <Media.Heading>Nested Media Heading</Media.Heading>
                <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
                <LikeDislikeButtons/>
              </Media.Body>
            </Media>
          </Media.Body>
        </Media>
      </div>
    );
  }
}
