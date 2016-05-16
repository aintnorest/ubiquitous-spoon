import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOut } from '../actions/app';

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
                        {(props.signedIn) ? (
                            <a onClick={props.signOut}>Sign Out</a>
                        ) : (
                            <Link to='/' className="nav-sml">Sign In</Link>
                        )}
                    </li>
                </ul>
            ):null}
        </nav>
    );
}

export default connect(
    (state) => state.app,
    (dispatch) => bindActionCreators({signOut}, dispatch)
)(appHeader);
