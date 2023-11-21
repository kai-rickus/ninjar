import { Input } from 'phaser';

export interface WASDControls
{
    w: Input.Keyboard.Key,
    a: Input.Keyboard.Key,
    s: Input.Keyboard.Key,
    d: Input.Keyboard.Key,
    space: Input.Keyboard.Key,
    shift: Input.Keyboard.Key,
    escape: Input.Keyboard.Key,
}

export const WASD_CONTROLS = {
    w      : Input.Keyboard.KeyCodes.W,
    a      : Input.Keyboard.KeyCodes.A,
    s      : Input.Keyboard.KeyCodes.S,
    d      : Input.Keyboard.KeyCodes.D,
    space  : Input.Keyboard.KeyCodes.SPACE,
    shift  : Input.Keyboard.KeyCodes.SHIFT,
    escape : Input.Keyboard.KeyCodes.ESC,
};
