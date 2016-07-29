import React from 'react';
import Relay from 'react-relay';
import { Media, Button } from "react-bootstrap";

import VotingButtons from '../voting/buttons';
import CommentCreate from '../comments/add';
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

    var replies;
    if (this.props.relay.variables.expanded) {
      replies = (<CommentsReplies viewer={this.props.viewer} parent={this.props.comment} />);
    }

    var repliesCount;
    if(comment.numComments >= 1) {
      repliesCount = (<Button bsStyle="info" className="list-group-item list-group-item-info comments-toggle-replies" onClick={this.handleToggleReplies}>{comment.numComments} respostas</Button>);
    }

    var replyForm;
    if(this.state.replyFormExpanded) {
      replyForm = (<CommentCreate viewer={this.props.viewer} parent={this.props.comment}
        onShown={this.handleReplyFocus}
        onSuccess={this.handleHideReplyForm} />);
    }

    return (
      <Media className="list-group-item comments-item">
        <Media.Left>
          <img width={64} height={64} src="/assets/thumbnail.png" alt="Image" />
        </Media.Left>
        <Media.Body>
          <Media.Heading><a href="#">{ comment.revisionCreated.author.username }</a></Media.Heading>
          <p>{ comment.body }</p>

          <VotingButtons viewer={this.props.viewer} parent={this.props.comment} votes={this.props.comment.votes} />

          <button className="btn btn-link" onClick={this.handleToggleReplyForm}>
            <i className="fa fa-reply" aria-hidden="true"></i> responder
          </button>
          
          <div className="list-group">
            {replyForm}
            {repliesCount}
            {replies}
          </div>
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
        numComments,
        revisionCreated {
          author {
            username
          },
          createdAt
        },
        ${CommentsReplies.getFragment('parent').if(variables.expanded)},
        votes {
          ${VotingButtons.getFragment('votes')},
        }
      }
    `,
    viewer: (variables) => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentsReplies.getFragment('viewer').if(variables.expanded)},
        ${CommentCreate.getFragment('viewer')},
        ${VotingButtons.getFragment('viewer')},
      }
    `,
  },
});
