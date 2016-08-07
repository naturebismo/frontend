import React from 'react';
import { FormGroup, Alert, HelpBlock } from "react-bootstrap";


export class Errors extends React.Component {
  render() {
    var to_render = [];
    const { errors, codes, ...props } = this.props;

    for(var i in errors) {
      var error = errors[i];
      if((typeof codes !== 'undefined' && codes.indexOf(error.code) >= 0) || error.location === '__all__'){
        to_render.push(<Alert bsStyle="danger" key={i}>{error.message}</Alert>);
      }
    }

    if(to_render.length === 0){
      return null;
    }

    return (<div>{to_render}</div>);
  }
}

export class FormGroupError extends React.Component {
  render() {
    const { errors, fieldname, ...props } = this.props;

    var validationState;
    for(var i in errors) {
      var error = errors[i];
      if(error.location === fieldname){
        validationState = 'error';
      }
    }

    return (<FormGroup {...props} validationState={validationState}>{this.props.children}</FormGroup>);
  }
}

export class HelpBlockError extends React.Component {
  render() {
    const { errors, fieldname, ...props } = this.props;

    var to_render = [];
    for(var i in errors) {
      var error = errors[i];
      if(error.location === fieldname){
        to_render.push(<HelpBlock key={i}>{error.message}</HelpBlock>);
      }
    }

    if(to_render.length === 0){
      return null;
    }

    return (<div>{to_render}</div>);
  }
}
