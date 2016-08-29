import React from 'react';
import Relay from 'react-relay';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import LoginRequired from '../accounts/LoginRequired';
import VoteSetMutation from './VoteSet.mutation';
import VoteDeleteMutation from './VoteDelete.mutation';

class VotingButtons extends React.Component {
  state = {}

  handleVoteSet = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new VoteSetMutation({
          value: e.target.value,
          voting: this.props.voting})
    );
  }

  handleVoteDelete = (e) => {
    e.preventDefault();

    this.refs.loginRequired.refs.component.commitUpdate(
      new VoteDeleteMutation({
          vote: this.props.voting.mine,
          voting: this.props.voting})
    );
  }

  render() {
    var voting = this.props.voting;
    var vote_up_class = 'btn btn-default';
    var vote_down_class = 'btn btn-default';
    var button_delete;

    if(voting.mine) {
      if(voting.mine.value == 1) {
        vote_up_class += ' active';
      }

      if(voting.mine.value == -1) {
        vote_down_class += ' active';
      }

      var tooltip_delete = (<Tooltip id={`tooltip_voting_delete_${voting.id}`}>excluir</Tooltip>);
      button_delete = (
        <OverlayTrigger placement="top" overlay={tooltip_delete}>
        <button className='btn btn-danger tip' title="Remover" onClick={this.handleVoteDelete}>
          <i className="fa fa-close" aria-hidden="true"></i>
        </button>
        </OverlayTrigger>
      );
    }

    var accept_percent = 0;
    if(voting.count > 0) {
      accept_percent = (voting.countUps * 100.0) / voting.count;
    }
    var accept_title = (<Tooltip id={`tooltip_voting_stats_${voting.id}`}>
        {voting.count} pessoas votaram com<br />
        <strong>{accept_percent}% de aceitação</strong>.
      </Tooltip>);

    return (
      <span className="voting-buttons" role="toolbar" aria-label="...">
        <span  className="btn-group" role="groutp" aria-label="...">
          <OverlayTrigger placement="top" overlay={accept_title}>
            <span className="btn btn-default">{voting.count}</span>
          </OverlayTrigger>
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
    voting: () => Relay.QL`
      fragment on Voting {
        id,
        countUps,
        count,
        mine {
          id
          value
        },
        ${VoteSetMutation.getFragment('voting')},
        ${VoteDeleteMutation.getFragment('voting')},
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
