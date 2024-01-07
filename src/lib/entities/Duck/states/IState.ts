import type Duck from '../Duck';
import type State from './State';

export default interface IState {
    new (duck: Duck): State;
}
