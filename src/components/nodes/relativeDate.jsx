import React from 'react';
import ReactDOM from 'react-dom';
import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const FormatedDate = injectIntl(({date, intl}) => (
    <span title={intl.formatDate(date)}>
        <FormattedRelative value={date}/>
    </span>
));

export default class RelativeDate extends React.Component {
  render() {
  	return <FormatedDate date={this.props.date} />
  }
}
