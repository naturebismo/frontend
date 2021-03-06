import React from 'react';
import Relay from 'react-relay';
import ReactList from "react-list";
import { Link } from 'react-router';
import { Badge } from "react-bootstrap";
import Helmet from 'react-helmet';

import RelativeDate from './nodes/relativeDate';
import ProfileLink from './accounts/ProfileLink';

const pageSize = 30;

class Home extends React.Component {
  constructor(props){
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(key, index) {
    var posts = this.props.viewer.allPosts.edges;

    var post = posts[index].node;
    return (
      <div key={ key } className="list-group-item">
        <Link to={`/${post.url}`}>{ post.title }</Link> {post.tags.edges.map(function(edge, i){
          var tag = edge.node;
          return (<Link to={`/tag/${tag.slug}`} key={i} className="badge">{tag.title}</Link>);
        })}<br/>
        <a href="#">{post.voting.countUps} gostaram</a> . <a href="#">{post.voting.countDowns} não gostaram</a> . <a href="#">{ post.commenting.count } comentarios</a> . enviada por <ProfileLink user={post.revisionCreated.author} /> <RelativeDate date={post.publishedAt} />
      </div>
    );
  }
  
  render() {
    var allPosts = this.props.viewer.allPosts;
    return (
      <div className="col-xs-12">
        <Helmet 
          title="Naturebismo"
          titleTemplate="%s"
        />

        <p>Naturebismo representa uma corrente filosófica, onde a principal regra é "usar aquilo que a terra nos dá".</p>
        <p>Esta é uma comunidade 100% colaborativa, queremos não só gerar consciência ecológica, mas também estimular o respeito e a boa convivência.</p>

        <div className="list-group">
          <ReactList itemRenderer={ this.renderRow } length={ allPosts.edges.length }/>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
        allPosts(first: $pageSize) {
          edges {
            node {
              url,
              title,
              publishedAt,
              commenting {
                count
              }
              voting {
                countUps
                countDowns
              }
              tags(first: 50) {
                edges {
                  node {
                    title
                    slug
                  }
                }
              }
              revisionCreated {
                author {
                  ${ProfileLink.getFragment('user')},
                }
              }
            }
          }
        },
      }
    `,
  },
});
