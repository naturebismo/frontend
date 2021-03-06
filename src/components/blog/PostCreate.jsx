import React from 'react';
import Relay from 'react-relay';
import PostCreateMutation from './PostCreate.mutation'
import { FormGroup, FormControl, ControlLabel, HelpBlock, Button } from "react-bootstrap";
import Helmet from 'react-helmet';


class PostCreate extends React.Component {
  state = {url: '', title: '', body: '', publishedAt: new Date().toJSON().split(".")[0], 'tags': ''}

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
      new PostCreateMutation({
          url: this.state.url,
          title: this.state.title,
          body: this.state.body,
          tags: this.state.tags,
          publishedAt: this.state.publishedAt,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          //this.context.router.push('/post/' + response.postCreate.post.url);
          this.context.router.push('/');
        },
      }
    );
  }

  render() {
    return (<div className="col-xs-12">
      <form onSubmit={this.handleSubmit}>
        <Helmet
          title="Write new Post"
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
          <FormControl componentClass="textarea" rows="20" placeholder="Page's body" onChange={this.handleBodyChange} value={this.state.body} />
        </FormGroup>

        <FormGroup controlId="formControlsText">
          <ControlLabel>Tags</ControlLabel>
          <FormControl type="text" value={this.state.tags} onChange={this.handleTagsChange} />
        </FormGroup>

        <Button type="submit">Save</Button>
      </form>
    </div>);
  }
}

PostCreate.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(PostCreate, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Query {
        ${PostCreateMutation.getFragment('viewer')},
      }
    `,
  },
});
