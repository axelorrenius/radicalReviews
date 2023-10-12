import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { ROUTES } from '../constants';
// import { getApiPath } from '../util';
// import { useAuth, useUpdateAuth } from '../contexts';
// import { UserDTO } from '../DTO/UserDTO';

type navbarProps = {
	toggleSideMenu: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	})
);

// putting some mock data here untill we get the API up and running
interface UserDTOMock {
	id: number;
	name: string;
	email: string;
	isAdmin: boolean;
}

const mockUser: UserDTOMock = {
	id: 1,
	name: 'MockUser',
	email: 'yeehaw@yemail.com',
	isAdmin: true,
}

const useAuth = () => {
	return {
		user: mockUser,
		authenticated: true,
	};
};

const useUpdateAuth = () => {
	return {
		login: () => {},
		logout: () => {},
	};
};

    // const user = "Test User :)";
    // const authenticated = true;

// const userString = (user: UserDTO | null) => user?.name || null;
const userString = (user: UserDTOMock | null) => user?.name || null;

const NavBar = (props: navbarProps) => {
	const { user, authenticated } = useAuth();
	const { login, logout } = useUpdateAuth();
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

	const handleMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		setAnchorEl(e.target as Element);
	}; 

	const handleMenuClick = (_e: React.MouseEvent) => {
		setAnchorEl(null);
	};

	const handleLogin = () => {
		login();
		//history.push(ROUTES.LOGIN);
	};

	const handleLogout = () => {
		logout();
		//history.push(ROUTES.LOGIN);
	};

	//useEffect(() => login(), [])

	const menuItems = [
		{
			title: 'Home',
			pageURL: '/',
			requiresAdmin: false,
		},
		{
			title: 'Courses',
			pageURL: ROUTES.COURSES,
			requiresAdmin: true,
		},
		{
			title: 'User',
			pageURL: ROUTES.USER,
			requiresAdmin: true,
		},
	];

	return (
		<div className={classes.root}>
			<AppBar position="fixed">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={handleMenu}
					>
						<MenuIcon />
					</IconButton>
					{user ? (
						<Menu
							id="menu-navbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={!!anchorEl}
							onClose={() => setAnchorEl(null)}
						>
							{menuItems
								.filter(
									({ requiresAdmin }) =>
									(user &&
										requiresAdmin &&
										user?.isAdmin) ||
									!requiresAdmin
								)
								.map(({ title, pageURL }) => (
									<MenuItem
										component={Link}
										style={{
											color: 'inherit',
											textDecoration: 'none',
										}}
										to={pageURL}
										key={title}
										onClick={handleMenuClick}
									>
										{title}
									</MenuItem>
								))}
						</Menu>
					) : null}
					<Typography variant="h6" className={classes.title}>
						Scopus - your campus compas
					</Typography>
					<Typography variant="body1" style={{ margin: 10 }}>
						{userString(user)}
					</Typography>
					{authenticated ? (
						<Button
							variant="outlined"
							color="secondary"
							style={{ margin: 10 }}
							onClick={(e) => props.toggleSideMenu()}
						>
							Instructions
						</Button>
					) : null}
					{authenticated ? (
						<Button
							variant="outlined"
							color="default"
							href="api/session/logout"
							style={{
								margin: 10,
								borderColor: '#fff',
								color: '#fff',
							}}
						>
							Logout
						</Button>
					) : (
						<Button
							variant="outlined"
							style={{ borderColor: '#fff', color: '#fff' }}
							// href={getApiPath() + '/session/login'}
						>
							Login
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default NavBar;
