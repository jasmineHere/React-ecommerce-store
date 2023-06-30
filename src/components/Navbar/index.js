import React, {useState} from 'react';
import {
Nav,
NavLink,
Bars,
NavMenu,
NavBtn,
NavBtnLink,
} from './NavbarElements';

const Navbar = ({user, setUser}) => {
	
	const login = (user) => {
		setUser(user);
	};
	const logout = () => {
		setUser(null);
	};	
return (
	<>
	<Nav>
		<Bars />

		<NavMenu>
		<NavLink to='/home' activeStyle>
			Home
		</NavLink>
		<NavLink to='/product-details' activeStyle>
			Product Details
		</NavLink>
		<NavLink to='/cart' activeStyle>
			Cart Details
		</NavLink>
		<NavLink to='/add-product' activeStyle>
			Add Products
		</NavLink>
		{!user ? (
                <NavLink to="/login" >
                  Login
                </NavLink>
              ) : (
                <NavLink to="/" onClick={logout}>
                  Logout
                </NavLink>
        )}
		{/* Second Nav */}
		{/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
		</NavMenu>
		{/* <NavBtn>
		<NavBtnLink to='/signin'>Sign In</NavBtnLink>
		</NavBtn> */}
	</Nav>
	</>
);
};

export default Navbar;
