import Relay from 'react-relay';

export default class TagEditMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id,
      }
    `,
    tag: () => Relay.QL`
      fragment on Tag {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{tagEdit}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on TagEditPayload {
        tag,
        viewer {
          allTags,
        },
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
          tag: this.props.tag.id,
        },
      }
    ];
  }
  getVariables() {
    return {
      id: this.props.tag.id,
      slug: this.props.slug,
      title: this.props.title,
      description: this.props.description,
    };
  }
  getOptimisticResponse() {
    return {
      tag: {
        id: this.props.tag.id,
        slug: this.props.slug,
        title: this.props.title,
        description: this.props.description,
      },
      viewer: {
        id: this.props.viewer.id,
      },
    };
  }
}
