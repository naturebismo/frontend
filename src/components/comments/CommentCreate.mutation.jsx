import Relay from 'react-relay';
import CommentItem from './item';

export default class CommentCreateMutation extends Relay.Mutation {
  static fragments = {
    commenting: () => Relay.QL`
      fragment on Commenting {
        id
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        id,
        me {
          username,
          avatar(width: 60, height: 60) {
            url
          }
        }
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{commentCreate}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CommentCreatePayload {
        commenting {
          id,
          count,
          comments
        }
        comment {
          node {
            id,
            ${CommentItem.getFragment('comment')},
          }
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {commenting: this.props.commenting.id},
      },
      {
        type: 'RANGE_ADD',
        parentName: 'commenting',
        parentID: this.props.commenting.id,
        connectionName: 'comments',
        edgeName: 'comment',
        rangeBehaviors: {
          '': 'prepend',
        },
      }
    ];
  }
  getVariables() {
    return {
      body: this.props.body,
      parent: this.props.commenting.id,
    };
  }
  getOptimisticResponse() {
    return {
      comment: {
        node: {
          body: this.props.body,
          revisionCreated: {
            author: {
              username: this.props.viewer.me.username,
              avatar: {
                url: this.props.viewer.me.avatar.url,
              }
            },
            createdAt: new Date().toJSON(),
          },
          document: {
            revisionsCount: 1,
          },
          commenting: {
            'count': 0,
          }
        },
      },
    };
  }
}
