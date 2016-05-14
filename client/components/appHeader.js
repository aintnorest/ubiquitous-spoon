import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';


function appHeader(props) {
    return (
        <nav className='nav-header'>
            <Link to='/' className="nav-lrg">Ubiquitous Spoon</Link>
            {props.game ? (
                <ul className="nav-right">
                    <li className="nav-li-itm">
                        <Link to="chat" className="nav-sml">Chat</Link>
                    </li>
                    <li className="nav-li-itm">
                        <Link to='gameSpace' className="nav-sml">Game Space</Link>
                    </li>
                    <li className="nav-li-itm">
                        <Link to='/' className="nav-sml">{props.signedIn ? 'Sign Out' : 'Sign In'}</Link>
                    </li>
                </ul>
            ):null}
        </nav>
    );
}

export default connect((state) => state.app)(appHeader);
