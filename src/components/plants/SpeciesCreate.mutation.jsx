import Relay from 'react-relay';
import SuggestionIDCreateMutation from './SuggestionIDCreate.mutation';
import SuggestionIDSelectItem from './SuggestionIDSelectItem';

export default class SpeciesCreateMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Query {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{speciesCreate}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on SpeciesCreatePayload {
        species {
          id,
          ${SuggestionIDCreateMutation.getFragment('lifeNode')},
          ${SuggestionIDSelectItem.getFragment('lifeNode')}
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on SpeciesCreatePayload {
              species {
                id,
                ${SuggestionIDCreateMutation.getFragment('lifeNode')},
                ${SuggestionIDSelectItem.getFragment('lifeNode')}
              },
              errors {
                code,
                location
                message
              }
            }
          `,
        ]
      }
    ];
  }
  getVariables() {
    return {
      commonNames: this.props.commonNames,
      species: this.props.species,
      genus: this.props.genus,
      family: this.props.family,
    };
  }
}
