import React from 'react';
import Relay from 'react-relay';
import { Media, Button } from "react-bootstrap";

import VotingButtons from '../voting/buttons';
import CommentCreate from './add';
import CommentsReplies from './replies';


class CommentItem extends React.Component {
  state = {replyFormExpanded: false}

  handleShowReplies = (e) => {
    e.preventDefault();
    this.props.relay.setVariables({expanded: true});
  }

  handleHideReplies = (e) => {
    e.preventDefault();
    this.props.relay.setVariables({expanded: false});
  }

  handleToggleReplies = (e) => {
    if (this.props.relay.variables.expanded) {
      this.handleHideReplies(e);
    } else {
      this.handleShowReplies(e);
    }
  }

  handleToggleReplyForm = (e) => {
    e.preventDefault();

    if(this.state.replyFormExpanded) {
      this.handleHideReplyForm();
    } else {
      this.setState({replyFormExpanded: true});
      this.handleShowReplies(e);
    }
  }

  handleHideReplyForm = () => {
    this.setState({replyFormExpanded: false});
  }

  handleReplyFocus = (input) => {
    input.focus();
  }

  render() {
    var comment = this.props.comment;
    var viewer = this.props.viewer;

    var voting;
    if(typeof this.props.comment.votes !== 'undefined') {
      voting = ( <VotingButtons viewer={this.props.viewer} parent={this.props.comment} votes={this.props.comment.votes} />);
    }

    return (
      <Media className="list-group-item comments-item">
        <Media.Left>
          <img width={64} height={64} src={require('../../assets/images/icon-user-default.png')} alt={comment.revisionCreated.author.username} />
        </Media.Left>
        <Media.Body>
          <Media.Heading><a href="#">{ comment.revisionCreated.author.username }</a></Media.Heading>
          <p>{ comment.body }</p>

          {voting}

          <button className="btn btn-link" onClick={this.handleToggleReplyForm}>
            <i className="fa fa-reply" aria-hidden="true"></i> responder
          </button>
          
          <CommentsReplies
            viewer={this.props.viewer}
            comments={this.props.comment.comments}
            parent={comment}
            expanded={this.props.relay.variables.expanded} 
            replyFormExpanded={this.state.replyFormExpanded} 
            handleToggleReplies={this.handleToggleReplies}
          />
        </Media.Body>
      </Media>
    );
  }
}

export default Relay.createContainer(CommentItem, {
  initialVariables: {
    expanded: false
  },
  fragments: {
    comment: (variables) => Relay.QL`
      fragment on Comment {
        id,
        body,
        revisionCreated {
          author {
            username
          },
          createdAt
        },
        votes {
          ${VotingButtons.getFragment('votes')},
        }
        comments(first: 50) {
          count
          ${CommentsReplies.getFragment('comments', {expanded: false, replyFormExpanded: false}).if(variables.expanded)},
        },
        ${CommentsReplies.getFragment('parent', {expanded: false, replyFormExpanded: false}).if(variables.expanded)},
        ${CommentCreate.getFragment('parent')},
      }
    `,
    viewer: (variables) => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentCreate.getFragment('viewer')},
        ${VotingButtons.getFragment('viewer')},
        ${CommentsReplies.getFragment('viewer', {expanded: false, replyFormExpanded: false}).if(variables.expanded)},
      }
    `,
  },
});
