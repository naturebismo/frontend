import React from 'react';
import Relay from 'react-relay';
import ReactList from "react-list";
import { Link } from 'react-router';
import Helmet from 'react-helmet';

const pageSize = 30;

class Tag extends React.Component {
  constructor(props){
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(key, index) {
    var posts = this.props.tag.allPosts.edges;

    // End of the list reached. Increase page size. Relay
    // will fetch only the required data to fill the new
    // page size.
    if (index === posts.length - 1) {
      this.props.relay.setVariables({
        pageSize: posts.length + pageSize
      });
    }

    var post = posts[index].node;
    return (
      <div key={ key } className="list-group-item">
        <Link to={`/${post.url}`}>{ post.title }</Link> by <strong>{ post.revisionCreated.author.username }</strong> at <i>{ post.publishedAt }</i>
      </div>
    );
  }

  render() {
    var tag = this.props.tag;
    var allPosts = tag.allPosts;

    var editorActions = null;
    if(this.props.viewer.me !== null) { 
      if(this.props.viewer.me.isAuthenticated === true) {
        var editorActions = (<p><Link to={`/tag/edit/${tag.id}`}>Editar</Link></p>);
      }
    }

    return (<div>
      <Helmet
        title={tag.title}
      />
      <div className="page-header">
        <h1>{tag.title}</h1>
      </div>

      <div>{tag.description}</div>

      {editorActions}

      <div className="list-group">
        <ReactList itemRenderer={ this.renderRow } length={ allPosts.edges.length }/>
      </div>
    </div>);
  }
}

export default Relay.createContainer(Tag, {
  initialVariables: {
    pageSize: pageSize
  },
  fragments: {
    tag: () => Relay.QL`
      fragment on Tag {
        id,
        title,
        description,
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
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          isAuthenticated
        },
      }
    `,
  },
});
