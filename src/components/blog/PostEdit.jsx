import React from 'react';
import Relay from 'react-relay';
import PostEditMutation from './PostEdit.mutation'
import { FormGroup, FormControl, ControlLabel, HelpBlock, Button } from "react-bootstrap";
import Helmet from 'react-helmet';


class PostEdit extends React.Component {
  state = {url: '', title: '',
           body: '',
           publishedAt: '', 'tags': ''}

  handleURLChange = (e) => {
    this.setState({url: e.target.value});
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value});
  }

  handleBodyChange = (e) => {
    this.setState({body: e.target.value});
  }

  handlePublishedAtChange = (e) => {
    this.setState({publishedAt: e.target.value});
  }

  handleTagsChange = (e) => {
    this.setState({tags: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new PostEditMutation({
          post: this.props.post,
          url: this.state.url,
          title: this.state.title,
          body: this.state.body.toString('markdown'),
          tags: this.state.tags,
          publishedAt: this.state.publishedAt,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          this.context.router.push('/');
        },
      }
    );
  }

  componentWillMount() {
    var post = this.props.post;
    var tags = post.tags.edges.map(function(edge, i){
      return edge.node.title;
    });

    this.setState({
      url: post.url,
      title: post.title,
      publishedAt: post.publishedAt,
      body: post.body,
      tags: tags.join(', ')
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Helmet
          title={`Editing: ${this.props.post.title}`}
        />
        
        <FormGroup controlId="formControlsText">
          <ControlLabel>URL</ControlLabel>
          <FormControl type="text" value={this.state.url} onChange={this.handleURLChange} />
        </FormGroup>

        <FormGroup controlId="formControlsText">
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" value={this.state.title} onChange={this.handleTitleChange} />
        </FormGroup>

        <FormGroup controlId="formControlsFile">
          <ControlLabel>Published At</ControlLabel>
          <FormControl type="text" value={this.state.publishedAt} onChange={this.handlePublishedAtChange} />
          <HelpBlock>Format: 2006-01-02T15:04:05</HelpBlock>
        </FormGroup>
        
        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Body</ControlLabel>
          <FormControl componentClass="textarea" rows="20"
              onChange={this.handleBodyChange} value={this.state.body} />
        </FormGroup>

        <FormGroup controlId="formControlsText">
          <ControlLabel>Tags</ControlLabel>
          <FormControl type="text" value={this.state.tags} onChange={this.handleTagsChange} />
        </FormGroup>

        <Button type="submit">Save changes</Button>
      </form>
    );
  }
}

PostEdit.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(PostEdit, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id,
        url,
        title,
        body,
        publishedAt,
        tags(first: 50) {
          edges {
            node {
              title,
            }
          }
        },
        ${PostEditMutation.getFragment('post')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${PostEditMutation.getFragment('viewer')},
      }
    `,
  },
});
