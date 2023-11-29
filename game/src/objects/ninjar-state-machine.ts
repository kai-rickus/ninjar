type NinjarState = { allowed?: StateKey[], active: boolean }
type StateKey = keyof NinjarStates

interface NinjarStates
{
    idling: NinjarState,
    dashing: NinjarState,
    runnning: NinjarState,
    jumping: NinjarState,
    crouching: NinjarState,
    falling: NinjarState,

}

export class NinjarStateMachine
{
    private _states: NinjarStates = {
        idling    : { active : false },
        dashing   : { active : false },
        runnning  : { active : false },
        jumping   : { active : false },
        crouching : { active : false },
        falling   : { allowed : [ 'idling', 'dashing' ], active : false },
    };

    public activateState( state: StateKey )
    {
        const newState = this._states[ state ];

        for ( const stateKey of Object.keys( this._states ) )
        {
            if ( newState.allowed?.includes( stateKey as StateKey ) )
            {
                continue;
            }
            this._states[ stateKey ].active = false;
        }

        newState.active = true;
    }

    public deactivateState( state: StateKey )
    {
        this._states[ state ].active = false;
    }

    public getState( state: StateKey )
    {
        return this._states[ state ];
    }

    public getActiveStates()
    {
        const activeStates: Partial<NinjarStates> = {};

        for ( const [ key, state ] of Object.entries( this._states ) )
        {
            if ( state.active )
            {
                activeStates[ key ] = { ...state };
            }
        }

        return activeStates;
    }

    public isActive( state: StateKey )
    {
        return this._states[ state ].active;
    }
}
