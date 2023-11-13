export class Controls
{
    private static readonly _KEY_MAP = {
        68 : 'right',
        65 : 'left',
        87 : 'up',
        83 : 'down',
        16 : 'shift',
        27 : 'pause',
        32 : 'spacebar',
    };

    public pressedKeys = {
        right    : false,
        left     : false,
        up       : false,
        down     : false,
        shift     : false,
        pause    : false,
        spacebar : false,
    };

    constructor()
    {
        window.addEventListener( 'keydown', this._keydown.bind( this ) );
        window.addEventListener( 'keyup', this._keyup.bind( this ) );
    }

    private _keydown( event )
    {
        const key               = Controls._KEY_MAP[ event.keyCode ];
        this.pressedKeys[ key ] = true;
    }

    private _keyup( event )
    {
        const key               = Controls._KEY_MAP[ event.keyCode ];
        this.pressedKeys[ key ] = false;
    }
}
