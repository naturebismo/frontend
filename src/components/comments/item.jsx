import React from 'react';
import Relay from 'react-relay';
import { Media, Button } from "react-bootstrap";
import Markdown from 'react-remarkable';

import VotingButtons from '../voting/buttons';
import CommentCreate from './add';
import CommentEdit from './edit';
import CommentsReplies from './replies';

import {markdownOptions} from "../blog/Post";


class CommentItem extends React.Component {
  state = {replyFormExpanded: false, editing: false}

  handleShowEditForm = (e) => {
    this.setState({editing: true});
  }

  handleHideEditForm = (e) => {
    this.setState({editing: false});
  }

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
    if(typeof this.props.comment.voting !== 'undefined') {
      voting = ( <VotingButtons viewer={this.props.viewer} voting={this.props.comment.voting} />);
    }

    var commentBody;
    if(this.state.editing) {
      commentBody = (<CommentEdit viewer={this.props.viewer}
                                  comment={this.props.comment}
                                  onSuccess={this.handleHideEditForm} />);
    } else {
      commentBody = (
        <Markdown options={markdownOptions} container="div">{comment.body}</Markdown>
      );
    }

    return (
      <Media className="list-group-item comments-item">
        <Media.Left>
          <img width={60} height={60} className="img-thumbnail" style={{maxWidth: "60px"}}
               src={comment.revisionCreated.author.avatar.x140x140}
               alt={comment.revisionCreated.author.username} />
        </Media.Left>
        <Media.Body>
          <Media.Heading><a href="#">{ comment.revisionCreated.author.username }</a></Media.Heading>
          
          {commentBody}

          {voting}

          <button className="btn btn-link" onClick={this.handleToggleReplyForm}>
            <i className="fa fa-reply" aria-hidden="true"></i> responder
          </button>

          <button className="btn btn-link" onClick={this.handleShowEditForm}>
            <i className="fa fa-pencil" aria-hidden="true"></i> editar
          </button>

          <button className="btn btn-link" onClick={this.handleToggleReplyForm}>
            <i className="fa fa-trash" aria-hidden="true"></i> excluir
          </button>
          
          <CommentsReplies
            viewer={this.props.viewer}
            commenting={this.props.comment.commenting}
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
            avatar {
              x140x140
            }
          },
          createdAt
        },
        voting {
          ${VotingButtons.getFragment('voting')},
        }
        commenting {
          count
          ${CommentCreate.getFragment('commenting')},
          ${CommentsReplies.getFragment('commenting').if(variables.expanded)},
        },
        ${CommentEdit.getFragment('comment')},
      }
    `,
    viewer: (variables) => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${CommentEdit.getFragment('viewer')},
        ${CommentCreate.getFragment('viewer')},
        ${VotingButtons.getFragment('viewer')},
        ${CommentsReplies.getFragment('viewer').if(variables.expanded)},
      }
    `,
  },
});
