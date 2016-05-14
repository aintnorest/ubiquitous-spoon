import React from 'react';
import warmahordes from '../../images/warmahordes.png'
import { setGame, setUserName, signIn } from '../../actions/app';
import { connect } from 'react-redux';
import InputField from '../inputField';
import { bindActionCreators } from 'redux';

function Home(props) {
    console.log('home Props: ',props);
    return (
        <div className='body'>
            {
                (props.game !== null) ? (
                    (props.signedIn) ? null : (
                    <div>
                        <h1>Sign In</h1>
                        <div className='signin-input-wrap'>
                            <InputField type='text' placeholder='' error={props.errorMessage} value={props.userName} change={props.setUserName} id='username' label='Username'/>
                        </div>
                        <button className="signin-btn" onClick={props.signIn}>Sign In</button>
                    </div>
                    )
                ) : (
                    <div>
                        <h1>Select Game</h1>
                        <ul className="btnless-list">
                            <li onClick={() => props.setGame('warmachine')}>
                                <img className="btn-img" src={warmahordes} alt='warmahordes'/>
                            </li>
                        </ul>
                    </div>
                )
            }
            <h2>About</h2>
            <section>
                The goal is make a more modern and web based alternative to http://www.vassalengine.org/ . As of right now the two primary contributers use vassal for warmachine / hordes and feature development will probably be geared towards that game.
            </section>
            <h3>FAQ</h3>
            <ul>
                <li>What the name?</li>
                Didn't want to waste time trying to name it, ubiquitous-spoon was githubs random pick.
                <li>What games are supported?</li>
                At first warmachine / hordes but development is being done with an eye towards modularity and support other tabletop games.
                <li>Is it open source and can I help?</li>
                Yes please! <a href="https://github.com/aintnorest/ubiquitous-spoon">Ubiquitous Spoon</a>
            </ul>

        </div>
    );
}

export default connect(
    (state) => state.app,
    (dispatch) => bindActionCreators({setGame, setUserName, signIn}, dispatch)
)(Home);
