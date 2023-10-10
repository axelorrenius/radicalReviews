import { IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
// import SideMenuHelp from './help';

type sideMenuProps = {
	isOpen: boolean;
	toggleOpen: () => void;
};

const SideMenu = (props: sideMenuProps) =>
	props.isOpen ? (
		<div
			style={{
				height: 'calc(100vh - 50px)',
				background: 'white',
				position: 'fixed',
				top: 60,
				right: 0,
				zIndex: 950,
				maxWidth: '40vw',
				border: '1px solid #3f51b5',
				boxShadow: '-5px 0px 25px 5px rgba(0,0,0,0.5)',
				overflowY: 'auto',
			}}
		>
			<IconButton
				aria-label="delete"
				color="primary"
				onClick={(e) => props.toggleOpen()}
			>
				<CloseIcon fontSize="default" />
			</IconButton>
			{/* <SideMenuHelp /> */}
		</div>
	) : null;

export default SideMenu;