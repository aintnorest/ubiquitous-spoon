import test from 'tape';
import sinon from 'sinon';
import {
    signIn,
    signOut,
    redirect,
    setUserName,
    setSignedIn,
    setErrorMessage,
    __RewireAPI__ as rewireAPI
} from './app';

test('signIn success', (assert) => {
    const userName = 'user';
    const route = '/foo';
    const mockState = {appReducer: {userName: userName}};
    const getState = sinon.stub().returns(mockState);
    const dispatch = sinon.spy();
    const signInStub = sinon.stub().returns(Promise.resolve('test'));
    const SocketProxyMock = function(){};
    SocketProxyMock.prototype.signIn = signInStub;
    rewireAPI.__Rewire__('SocketProxy', SocketProxyMock);

    signIn()(dispatch, getState).then(() => {
        assert.equals(signInStub.called, true, 'should call `socketProxy.signIn`');
        assert.equals(dispatch.callCount, 3, 'should call `dispatch` three times');
        assert.equals(dispatch.getCall(0).calledWith(setErrorMessage(null)), true, 'should call `dispatch` with `setErrorMessage(null)`');
        assert.equals(dispatch.getCall(1).calledWith(setSignedIn(true)), true, 'should call `dispatch` with `setSignedIn(true)`');
        assert.equals(dispatch.getCall(2).calledWith(redirect(route)), true, 'should call `dispatch` with `redirect(' + route + ')`');
        rewireAPI.__ResetDependency__('SocketProxy');
        assert.end();
    });
});

test('signIn error', (assert) => {
    const userName = 'user';
    const message = 'foobar';
    const error = {reason: message};
    const mockState = {appReducer: {userName: userName}};
    const getState = sinon.stub().returns(mockState);
    const dispatch = sinon.spy();
    const signInStub = sinon.stub().returns(Promise.reject(error));
    const SocketProxyMock = function(){};
    SocketProxyMock.prototype.signIn = signInStub;
    rewireAPI.__Rewire__('SocketProxy', SocketProxyMock);

    signIn()(dispatch, getState).then(() => {
        assert.equals(signInStub.called, true, 'should call `socketProxy.signIn`');
        assert.equals(dispatch.callCount, 2, 'should call `dispatch` two times');
        assert.equals(dispatch.getCall(0).calledWith(setErrorMessage(error.reason)), true, 'should call `dispatch` with `setErrorMessage(error.reason)`');
        assert.equals(dispatch.getCall(1).calledWith(setSignedIn(false)), true, 'should call `dispatch` with `setSignedIn(false)`');
        rewireAPI.__ResetDependency__('SocketProxy');
        assert.end();
    });
});

test('signOut', (assert) => {
    const route = '/';
    const dispatch = sinon.spy();
    const disconnect = sinon.stub();
    rewireAPI.__Rewire__('socketProxy', {disconnect});

    signOut()(dispatch);
    assert.equals(disconnect.called, true, 'should call `socketProxy.disconnect`');
    assert.equals(dispatch.callCount, 3, 'should call `dispatch` three times');
    assert.equals(dispatch.getCall(0).calledWith(setUserName(null)), true, 'should call `dispatch` with `setUserName(null)`');
    assert.equals(dispatch.getCall(1).calledWith(setSignedIn(false)), true, 'should call `dispatch` with `setSignedIn(false)`');
    assert.equals(dispatch.getCall(2).calledWith(redirect(route)), true, 'should call `dispatch` with `redirect(' + route + ')`');
    rewireAPI.__ResetDependency__('socketProxy');
    assert.end();
});

test('redirect', (assert) => {
    const route = '/foo';
    const push = sinon.stub().returns(route);
    rewireAPI.__Rewire__('push', push);

    const result = redirect(route);

    assert.equals(push.called, true, 'should call `push`');
    assert.equals(push.getCall(0).calledWith(route), true, 'should call `push` with `route`');
    assert.equals(result, route, 'should return the result of `push`');
    assert.end();
});
