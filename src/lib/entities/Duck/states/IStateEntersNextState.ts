import INextStateFactory from './INextStateFactory';

export default interface IStateGoesBackToIdle {
    /**
     * Function that returns next state for our duck
     */
    nextStateFactory: INextStateFactory;
}
