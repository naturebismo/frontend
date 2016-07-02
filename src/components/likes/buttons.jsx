import React from 'react';

export default class LikeDislikeButtons extends React.Component {
	render() {
		return (
			<span className="like-dislike-buttons">
			    <a href="#"><i className="fa fa-thumbs-up" aria-hidden="true"></i> gostei</a> . <a href="#"><i className="fa fa-thumbs-down" aria-hidden="true"></i> não gostei</a>
			</span>
		);
	}
}
