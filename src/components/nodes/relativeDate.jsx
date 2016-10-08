import React from 'react';
import ReactDOM from 'react-dom';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
    injectIntl,
    FormattedRelative,
} from 'react-intl';

const MyFormattedRelative = injectIntl(({date, intl}) => {
	var tooltip = (<Tooltip id={`tip_rdate_${date}`}>{intl.formatDate(date)} às {intl.formatTime(date)}</Tooltip>);
	return (<OverlayTrigger placement="top" overlay={tooltip}>
        <span><FormattedRelative value={date} /></span>
    </OverlayTrigger>);
});

export default class RelativeDate extends React.Component {
  render() {
  	return <MyFormattedRelative date={this.props.date} />
  }
}
