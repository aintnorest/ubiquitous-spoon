import test from 'tape';
import sinon from 'sinon';
import { signIn, redirect, __RewireAPI__ as rewireAPI } from './app';

test('signIn', (assert) => {
    assert.plan(3);
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
        assert.equals(dispatch.called, true, 'should call `dispatch`');
        assert.equals(dispatch.getCall(0).calledWith(redirect(route)), true, 'should call `dispatch` with `redirect(' + route + ')`');
        assert.end();
    });
});

test('redirect', (assert) => {
    assert.plan(3);
    const route = '/foo';
    const push = sinon.stub().returns(route);
    rewireAPI.__Rewire__('push', push);

    const result = redirect(route);

    assert.equals(push.called, true, 'should call `push`');
    assert.equals(push.getCall(0).calledWith(route), true, 'should call `dispatch` with `redirect(' + route + ')`');
    assert.equals(result, route, 'should return the result of `push`');
    assert.end();
});