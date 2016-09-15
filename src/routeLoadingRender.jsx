import React from 'react';

class LoadingMessage extends React.Component {
  state = {periods: '...'}

  componentDidMount() {
    var intervalId = setInterval(function() { 
      this.setState({periods: this.state.periods + '.'});
    }.bind(this), 1000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    return (<div><i className="fa fa-spinner fa-spin fa-fw"></i> carregando {this.state.periods}</div>);
  }
}

export default ({done, error, props, retry, stale, routerProps, element}) => {
  if (error) {
    return <div className="alert alert-danger" role="alert">
          <i className="fa fa-exclamation-triangle"
            aria-hidden="true"></i> ocorreu um erro ao acessar esta página, por favor, tente novamente.
      </div>;
  } else if (props) {
    return React.cloneElement(element, props);
  } else {
    return <LoadingMessage />;
  }
}