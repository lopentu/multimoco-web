import React, { useState } from 'react';
import {
	MDBContainer,
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarToggler,
	MDBIcon,
	MDBNavbarNav,
	MDBNavbarItem,
	MDBNavbarLink,
	MDBBtn,
	MDBDropdown,
	MDBDropdownToggle,
	MDBDropdownMenu,
	MDBDropdownItem,
	MDBCollapse,
	MDBInputGroup,
} from 'mdb-react-ui-kit';

import { TextField, Button, Grid, Select, InputLabel, FormControl, MenuItem, Container } from '@mui/material';

export default function Searchbar() {
	const [showBasic, setShowBasic] = useState(false);
	const [queryText, setQueryText] = useState("");
	const [handSelect, setHandSelect] = useState("");
	const [soundSelect, setSoundSelect] = useState("");

	return (
		<MDBNavbar expand='lg' light bgColor='light'>
			<MDBContainer fluid className="justify-content-start">
				<MDBNavbarBrand className='h1 m-1' href='#'>MultiMoco</MDBNavbarBrand>

				<MDBNavbarToggler
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
					onClick={() => setShowBasic(!showBasic)}
				>
					<MDBIcon icon='bars' fas />
				</MDBNavbarToggler>

				<MDBCollapse navbar show={showBasic}>
					<MDBNavbarNav className='mr-auto m-1 mb-lg-0'>
						<MDBNavbarItem>
							<MDBNavbarLink active aria-current='page' href='#'>
								Home
							</MDBNavbarLink>
						</MDBNavbarItem>

					</MDBNavbarNav>

				</MDBCollapse>
			</MDBContainer>
		</MDBNavbar>
	);
}