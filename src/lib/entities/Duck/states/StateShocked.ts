import State from './State';
import Shock from '../../VFX/Shock/Shock';

import type INextStateFactory from './INextStateFactory';
import type IStateGoesBackToIdle from './IStateEntersNextState';
import Duck from '../Duck';
import {
    getDuckMaterialByName,
    getDuckObjectWithMaterialByName,
} from '../../../utils/DuckMaterialHelpers';
import { MeshBasicMaterial } from 'three';

export default class StateShocked
    extends State
    implements IStateGoesBackToIdle
{
    name = 'shocked';

    nextStateFactory: INextStateFactory;

    /**
     * @constant
     */
    static SHOCKED_FOR_SECONDS = 3;

    static materials:
        | {
              beak: MeshBasicMaterial;
              body: MeshBasicMaterial;
              tail: MeshBasicMaterial;
          }
        | undefined;

    static initMaterials() {
        StateShocked.materials = {
            beak: getDuckMaterialByName(Duck.MODEL, 'beak').clone(),
            body: getDuckMaterialByName(Duck.MODEL, 'body').clone(),
            tail: getDuckMaterialByName(Duck.MODEL, 'tail').clone(),
        };
        StateShocked.materials.beak.color.set(0.36, 0.36, 0.36);
        StateShocked.materials.body.color.set(0.84, 0.84, 0.84);
        StateShocked.materials.tail.color.set(0.7, 0.7, 0.7);
        StateShocked.materials.beak.needsUpdate = true;
        StateShocked.materials.body.needsUpdate = true;
        StateShocked.materials.tail.needsUpdate = true;
    }

    constructor(duck: Duck, state: INextStateFactory) {
        super(duck);
        this.nextStateFactory = state;

        this.duck.emote(
            new Shock(this.game, this.duck, StateShocked.SHOCKED_FOR_SECONDS)
        );
        this.duck.quack();

        if (!StateShocked.materials) {
            StateShocked.initMaterials();
        }

        // TODO: Refactor
        getDuckObjectWithMaterialByName(this.duck.model, 'beak').material =
            StateShocked.materials!.beak;
        getDuckObjectWithMaterialByName(this.duck.model, 'body').material =
            StateShocked.materials!.body;
        getDuckObjectWithMaterialByName(this.duck.model, 'tail').material =
            StateShocked.materials!.tail;
    }

    update() {
        if (this.duck.timeInState > StateShocked.SHOCKED_FOR_SECONDS) {
            // TODO: Refactor
            getDuckObjectWithMaterialByName(this.duck.model, 'beak').material =
                getDuckMaterialByName(Duck.MODEL, 'beak');
            getDuckObjectWithMaterialByName(this.duck.model, 'body').material =
                getDuckMaterialByName(Duck.MODEL, 'body');
            getDuckObjectWithMaterialByName(this.duck.model, 'tail').material =
                getDuckMaterialByName(Duck.MODEL, 'tail');

            this.duck.state = this.nextStateFactory();
        }
    }
}
