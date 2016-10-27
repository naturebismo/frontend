import Relay from 'react-relay';
// import CommentItem from './item';

export default class WhatIsThisCreateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{whatIsThisCreate}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on WhatIsThisCreatePayload {
        whatIsThis {
          node {
            id
          }
        },
        viewer {
          id
          allWhatIsThis
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        parentID: this.props.viewer.id,
        connectionName: 'allWhatIsThis',
        edgeName: 'whatIsThis',
        rangeBehaviors: {
          '': 'prepend',
        },
      },
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on WhatIsThisCreatePayload {
              errors {
                code,
                location
                message
              }
            }
          `,
        ]
      }
      // {
      //   type: 'FIELDS_CHANGE',
      //   fieldIDs: {commenting: this.props.commenting.id},
      // },
      // {
      //   type: 'RANGE_ADD',
      //   parentName: 'commenting',
      //   parentID: this.props.commenting.id,
      //   connectionName: 'comments',
      //   edgeName: 'comment',
      //   rangeBehaviors: {
      //     '': 'prepend',
      //   },
      // }
    ];
  }
  getVariables() {
    return {
      when: this.props.when,
      where: this.props.where,
      notes: this.props.notes,
    };
  }
  getFiles() {
    return {
      images: this.props.images,
    };
  }
  // getOptimisticResponse() {
  //   return {
  //     comment: {
  //       node: {
  //         body: this.props.body,
  //         revisionCreated: {
  //           author: {
  //             username: this.props.viewer.me.username,
  //             avatar: {
  //               x140x140: this.props.viewer.me.avatar.x140x140,
  //             }
  //           },
  //           createdAt: new Date().toJSON(),
  //         },
  //         document: {
  //           revisionsCount: 1,
  //         },
  //         commenting: {
  //           'count': 0,
  //         }
  //       },
  //     },
  //   };
  // }
}
