import React from 'react';
import warmahordes from '../../images/warmahordes.png';
import chess from '../../images/chess.png';
import { setGame, setUserName, signIn } from '../../actions/app';
import { connect } from 'react-redux';
import InputField from '../inputField';
import { bindActionCreators } from 'redux';

function Home(props) {
    let ld = Object.keys(props.loading);

    console.log('home props: ',props);
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
                        <div style={{width:'85px', height:'50px'}}>
                            <button onMouseMove={(e)=>{e.preventDefault();}} disabled={!props.serverConnected} className="signin-btn" onClick={props.signIn}>Sign In</button>
                        </div>
                    </div>
                    )
                ) : (
                    <div>
                        <h1>Select Game</h1>
                        <ul className="btnless-list">
                            <li>
                                <div className="card-image">
                                    <img src={chess} alt='chess'/>
                                    <span className="card-title">Chess</span>
                                </div>
                                <div className="card-content">
                                    Chess is a two-player strategy board game played on a checkered gameboard with an eight-by-eight grid.
                                </div>
                                <div className="card-action">
                                    <a onClick={() => props.setGame('chess')}>Select Game</a>
                                    <a href="https://en.wikipedia.org/wiki/Chess">Read More</a>
                                </div>
                            </li>
                            <li>
                                <div className="card-image">
                                    <img src={warmahordes} alt='warmahordes'/>
                                    <span className="card-title">WarmaHordes</span>
                                </div>
                                <div className="card-content">
                                    Warmachine and Hordes are tabletop skirmish sized war games produced by Privateer Press &reg;
                                </div>
                                <div className="card-action">
                                    <a onClick={() => props.setGame('warmachine')}>Select Game</a>
                                    <a href="http://privateerpress.com/">Read More</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
            }
            <div className="about-faq-wrap">
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
            {(ld.length > 0) ?
                (
                    <div className="signin-dialog-bg">
                        <div className="signin-dialog-box">
                            <div data-loader="circle" />
                            {
                                ld.map(function(k,n) {
                                    return (<div key={n} className="signin-dialog-txt">{k+" "+props.loading[k]+"%"}</div>);
                                })
                            }
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}

export default connect(
    (state) => state.app,
    (dispatch) => bindActionCreators({setGame, setUserName, signIn}, dispatch)
)(Home);
