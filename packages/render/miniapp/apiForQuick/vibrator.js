var vibrator = require('@system.vibrator');
export function vibrateLong() {
    vibrator.vibrate({
        mode: 'long'
    });
}
export function vibrateShort() {
    vibrator.vibrate({
        mode: 'short'
    });
}
