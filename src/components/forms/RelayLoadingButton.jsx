import React from 'react';
import Relay from 'react-relay';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";


export default class LoadingButton extends React.Component {
  state = {isLoading: false, error: false}

  handleOnClick = (e) => {
    e.preventDefault();
    var commit = this.props.buildCommit();
    this.handleCommit(commit);
  }


  handleCommit = (commit) => {
    this.setState({isLoading: true});

    var commitUpdateFn;
    if(typeof commit.commitUpdate === 'function') {
      commitUpdateFn = commit.commitUpdate;
    } else {
      commitUpdateFn = Relay.Store.commitUpdate;
    }

    commitUpdateFn(commit.mutation, {
      onSuccess: (response) => {
        this.setState({error: false, isLoading: false});

        if(typeof commit.onSuccess === 'function') {
          commit.onSuccess(response);
        }
      },
      onFailure: (transaction) => {
        this.setState({error: true, isLoading: false});

        if(typeof commit.onFailure === 'function') {
          commit.onFailure(transaction);
        }
      }
    })
  }

  render() {
    var currentChildren;
    var {
      type,
      children,
      className,
      loadingText,
      buildCommit,
      ...containerProps
    } = this.props;

    if(this.state.isLoading){
      var loadingTextRender;
      if(loadingText) {
        loadingTextRender = loadingText;
      }

      currentChildren = (<span>
        <i className="fa fa-spinner fa-spin fa-fw"></i> {loadingTextRender}
      </span>);
    } else {
      currentChildren = (this.props.children);
    }

    containerProps.disabled = this.state.isLoading;
    containerProps.className = className;
    containerProps.onClick = this.handleOnClick;

    var tooltipError;
    if(this.state.error){
      tooltipError = (<Tooltip id={`tooltip_error_loading_button`}>ocorreu um erro, por favor tente novamente</Tooltip>);

      currentChildren = (<span>
          <i className="fa fa-exclamation-triangle text-danger"
            aria-hidden="true"></i> {this.props.children}
        </span>);
    }

    var button = (<Button type={type} {...containerProps}>
        {currentChildren}
      </Button>);

    if(this.state.error){
      return (<OverlayTrigger placement="top" overlay={tooltipError}>
          {button}
        </OverlayTrigger>);
    }

    return button;
  }
}
