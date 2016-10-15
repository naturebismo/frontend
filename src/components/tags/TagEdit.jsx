import React from 'react';
import Relay from 'react-relay';
import TagEditMutation from './TagEdit.mutation'
import { FormGroup, FormControl, ControlLabel, HelpBlock, Button } from "react-bootstrap";
import Helmet from 'react-helmet';


class TagEdit extends React.Component {
  state = {slug: '', title: '', description: ''}

  handleSlugChange = (e) => {
    this.setState({slug: e.target.value});
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value});
  }

  handleDescriptionChange = (e) => {
    this.setState({description: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new TagEditMutation({
          tag: this.props.tag,
          slug: this.state.slug,
          title: this.state.title,
          description: this.state.description,
          viewer: this.props.viewer}),
      {
        onSuccess: (response) => {
          this.context.router.push('/');
        },
      }
    );
  }

  componentWillMount() {
    var tag = this.props.tag;

    this.setState({
      slug: tag.slug,
      title: tag.title,
      description: tag.description
    });
  }

  render() {
    return (<div className="col-xs-12">
      <form onSubmit={this.handleSubmit}>
        <Helmet
          title={`Editing: ${this.props.tag.title}`}
        />
        
        <FormGroup controlId="formControlsText">
          <ControlLabel>Slug</ControlLabel>
          <FormControl type="text" value={this.state.slug} onChange={this.handleSlugChange} />
        </FormGroup>

        <FormGroup controlId="formControlsText">
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" value={this.state.title} onChange={this.handleTitleChange} />
        </FormGroup>

        <FormGroup controlId="formControlsTextarea">
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" rows="20" placeholder="Tag's description" onChange={this.handleDescriptionChange} value={this.state.description} />
        </FormGroup>

        <Button type="submit">Save changes</Button>
      </form>
    </div>);
  }
}

TagEdit.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Relay.createContainer(TagEdit, {
  fragments: {
    tag: () => Relay.QL`
      fragment on Tag {
        id,
        slug,
        title,
        description,
        ${TagEditMutation.getFragment('tag')},
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        ${TagEditMutation.getFragment('viewer')},
      }
    `,
  },
});
