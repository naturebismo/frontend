import React from 'react';
import Relay from 'react-relay';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";


export default class LoadingButton extends React.Component {
  state = {isLoading: false, error: false}

  handleOnClick = (e) => {
    e.preventDefault();

    this.setState({isLoading: true, error: false});

    var parent = this.props.getSetVariables();

    parent.relay.setVariables(parent.variables, readyState => {
      if (readyState.done || readyState.aborted) {
        this.setState({isLoading: false});

        if(typeof parent.onSuccess === 'function') {
          parent.onSuccess(readyState);
        }

      } else if (readyState.error) {
        this.setState({isLoading: false, error: true});

        if(typeof parent.onFailure === 'function') {
          parent.onFailure(readyState);
        }
      }
    });
  }

  render() {
    var currentChildren;
    var {
      type,
      children,
      className,
      loadingText,
      getSetVariables,
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
