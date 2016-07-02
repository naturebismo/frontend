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
          <div className="container">
            <Navbar.Header>
              <Navbar.Brand>
                <Link to={`/`} className="navbar-brand" style={{paddingLeft: 0}}>Naturebismo</Link>
              </Navbar.Brand>
            </Navbar.Header>

            <AccountNavbar viewer={this.props.viewer} />
          </div>
        </Navbar>

        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              {React.cloneElement(this.props.children, {viewer: this.props.viewer})}
            </div>
          </div>
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
