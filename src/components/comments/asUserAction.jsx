import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Media, Button } from "react-bootstrap";
import Markdown from 'react-remarkable';

import ProfileLink from '../accounts/ProfileLink';
import VotingButtons from '../voting/buttons';
// import CommentCreate from './add';
// import CommentEdit from './edit';
// import CommentDelete from './delete';
// import CommentsReplies from './replies';

import {markdownOptions} from "../blog/Post";
import RelativeDate from '../nodes/relativeDate';


class CommentItem extends React.Component {
  state = {editing: false}

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
               src={comment.revisionCreated.author.avatar.url}
               alt={comment.revisionCreated.author.username} />
        </Media.Left>
        <Media.Body>
          <Media.Heading>
            <ProfileLink user={comment.revisionCreated.author} /> . <small><i className="fa fa-clock-o"
              aria-hidden="true"></i> <RelativeDate date={comment.revisionCreated.createdAt} /></small>
          </Media.Heading>
          
          {commentBody}

          {voting}

          <button className="btn btn-link" onClick={this.handleToggleReplyForm}>
            <i className="fa fa-reply" aria-hidden="true"></i> responder
          </button>

          <Link to={`/revisions/${comment.id}`}>{comment.document.revisionsCount} alterações</Link>
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
        myPerms,
        document {
          revisionsCount
        },
        revisionCreated {
          author {
            avatar(width: 60, height: 60) {
              url
            }
            ${ProfileLink.getFragment('user')}
          },
          createdAt
        },
        voting {
          ${VotingButtons.getFragment('voting')},
        }
        commenting {
          count
        }
      }
    `,
    viewer: (variables) => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        }
      }
    `,
  },
});
