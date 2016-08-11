import React from 'react';
import Relay from 'react-relay';

import LoginRequired from '../accounts/LoginRequired';
import VoteSetMutation from './VoteSet.mutation';
import VoteDeleteMutation from './VoteDelete.mutation';

class VotingButtons extends React.Component {
  handleVoteSet = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new VoteSetMutation({
          value: e.target.value,
          parent: this.props.parent})
    );
  }

  handleVoteDelete = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new VoteDeleteMutation({
          vote: this.props.votes.mine,
          parent: this.props.parent})
    );
  }

  render() {
    var vote_up_class = 'btn btn-default';
    var vote_down_class = 'btn btn-default';
    var button_delete;

    if(this.props.votes.mine) {
      if(this.props.votes.mine.value == 1) {
        vote_up_class += ' active';
      }

      if(this.props.votes.mine.value == -1) {
        vote_down_class += ' active';
      }

      button_delete = (
        <button className='btn btn-danger tip' title="Remover" onClick={this.handleVoteDelete}>
          <i className="fa fa-close" aria-hidden="true"></i>
        </button>
      );
    }

    return (
      <span className="voting-buttons" role="toolbar" aria-label="...">
        <span  className="btn-group" role="groutp" aria-label="...">
          <span className="btn btn-default">{this.props.votes.sumValues} - {this.props.votes.count}</span>
          <button className={vote_up_class} value="1" onClick={this.handleVoteSet}>
            <i className="fa fa-thumbs-up" aria-hidden="true"></i> gostei
          </button>
          <button className={vote_down_class} value="-1" onClick={this.handleVoteSet}>
            <i className="fa fa-thumbs-down" aria-hidden="true"></i> não gostei
          </button>
          {button_delete}
        </span>

        <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
      </span>
    );
  }
}

export default Relay.createContainer(VotingButtons, {
  fragments: {
    votes: () => Relay.QL`
      fragment on VoteConnection {
        sumValues,
        count,
        mine {
          id
          value
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        ${LoginRequired.getFragment('viewer')},
      }
    `,
  },
});
