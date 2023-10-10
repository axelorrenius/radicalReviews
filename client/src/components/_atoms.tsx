import styled from 'styled-components';

export const Container = styled.div<{
	margin?: number;
	maxWidth?: number;
	center?: boolean;
}>`
	margin: auto;
	margin-top: ${(props) => (props.margin ? `${props.margin}px` : 'unset')};
	max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : 'unset')};
	text-align: ${(props) => (props.center ? 'center' : 'unset')};
`;

export const Card = styled.div`
	border-radius: 10px;
	box-shadow: 2px 6px 5px 1px lightgrey;
	margin: auto;
	margin-bottom: 1rem;
	border: 1px solid lightgrey;
	background-color: #f6f6f6;
	max-width: 500px;
	cursor: pointer;
	padding: 0.25rem 1rem;
	transition: all 0.2s;
	text-align: left;
	&:hover {
		background-color: #eee;
		box-shadow: none;
	}
`;