import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {FormattedMessage} from 'react-intl';

import LoginRequired from '../accounts/LoginRequired';
import LoadingButton from '../forms/RelayLoadingButton';
import SuggestionIDCreateMutation from './SuggestionIDCreate.mutation';


class SuggestionIDSelectItem extends React.Component {
  state = {}

  buildCommitSuggest = () => {
    return {
      commitUpdate: this.refs.loginRequired.refs.component.commitUpdate,
      mutation: new SuggestionIDCreateMutation({
          whatIsThis: this.props.whatIsThis,
          lifeNode: this.props.lifeNode,
          notes: '',
          viewer: this.props.viewer}),
      onSuccess: (response) => {
        if(typeof this.props.onSuccess === 'function') {
          this.props.onSuccess(response);
        }
      }
    }
  }

  render() {
    var life = this.props.lifeNode;
    
    var parent;
    if(life.parent) {
      parent = (<div>{life.parent.rankDisplay}: {life.parent.title}</div>);
    }

    var commonNames;
    if(life.commonNames.length > 0){
      var commonNamesStr = life.commonNames.map(function(name, i){
        var str = '';
        if(i > 0){
          str += ', ';
        }
        str += name;
        return str
      });
      commonNames = (<div>Nomes comuns: {commonNamesStr}</div>);
    }

    return (<li className="list-group-item">
      <div className="row">
        <div className="col-md-9">
          <h4 className="list-group-item-heading">{life.title} <small>({life.rankDisplay})</small></h4>
          {parent}
          {commonNames}
        </div>
        <div className="col-md-3 text-right">
          <LoadingButton
            bsStyle="primary"
            loadingText="salvando ..."
            ref="createSuggestIDButton"
            buildCommit={this.buildCommitSuggest}
          >
            sugerir
          </LoadingButton>
        </div>
      </div>

      <LoginRequired viewer={this.props.viewer} ref="loginRequired" showMessage={true} />
    </li>);
  }
}


export default Relay.createContainer(SuggestionIDSelectItem, {
  fragments: {
    whatIsThis: () => Relay.QL`
      fragment on WhatIsThis {
        id,
        ${SuggestionIDCreateMutation.getFragment('whatIsThis')},
      }
    `,
    lifeNode: () => Relay.QL`
      fragment on LifeNode {
        id
        title
        rankDisplay
        commonNames
        parent {
          id
          title
          rankDisplay
        }
        ${SuggestionIDCreateMutation.getFragment('lifeNode')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        ${SuggestionIDCreateMutation.getFragment('viewer')},
        ${LoginRequired.getFragment('viewer')},
      }
    `,
  },
});

