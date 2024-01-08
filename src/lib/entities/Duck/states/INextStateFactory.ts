import type State from './State';

export default interface INextStateFactory {
    (): State;
}
