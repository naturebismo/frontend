import React from 'react';
import Relay from 'react-relay';
import ReactList from "react-list";
import { Link } from 'react-router';
import {
  Nav,
  Navbar,
  NavDropdown,
  MenuItem
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Helmet from 'react-helmet';
import { IntlProvider } from 'react-intl';

import AccountNavbar from './accounts/Navbar';

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import pt from 'react-intl/locale-data/pt';

addLocaleData([...en, ...pt]);

const pageSize = 10;

class App extends React.Component {
  constructor(props){
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(key, index) {
    var posts = this.props.viewer.allPosts.edges;

    var post = posts[index].node;
    return (
      <li key={ key } className="list-group-item">
        <Link to={`/blog/${post.url}`}>{ post.title }</Link> by <strong>{ post.revisionCreated.author.username }</strong> at <i>{ post.publishedAt }</i>
      </li>
    );
  }

  render() {
    var allPosts = this.props.viewer.allPosts;

    return (
      <IntlProvider locale="pt-BR">
      <div>
        <Helmet 
          titleTemplate="%s | Naturebismo"
        />
        <Navbar staticTop>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={`/`} className="navbar-brand">Naturebismo</Link>
            </Navbar.Brand>

            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <AccountNavbar viewer={this.props.viewer} />
          </Navbar.Collapse>
        </Navbar>

        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              {React.cloneElement(this.props.children, {viewer: this.props.viewer})}
            </div>
          </div>

          <footer className="row">
            <br />
            <br />
            <div className="col-xs-6">
              © 2016 Naturebismo versão <a href="#">a3f19e2</a>.
            </div>
            <div className="col-xs-6 text-right">
              <a href="#">Sobre</a><span> . </span>
              <a href="#">Contribua</a><span> . </span>
              <a href="#">Termos de Uso</a>
            </div>
            <br />
            <br />
          </footer>
        </div>
      </div>
      </IntlProvider>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        allPosts(first: $pageSize) {
          edges {
            node {
              url,
              title,
              publishedAt,
              revisionCreated {
                author {
                  username
                }
              }
            }
          }
        },
        ${AccountNavbar.getFragment('viewer')},
      }
    `,
  },
});
