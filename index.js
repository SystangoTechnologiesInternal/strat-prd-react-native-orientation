var Orientation = require('react-native').NativeModules.Orientation;
var DeviceEventEmitter = require('react-native').DeviceEventEmitter;
 
var listeners = {};
var orientationDidChangeEvent = 'orientationDidChange';
var specificOrientationDidChangeEvent = 'specificOrientationDidChange';

var id = 0;
var META = '__listener_id';

function getKey(listener) {
  if (!listener.hasOwnProperty(META)) {
    if (!Object.isExtensible(listener)) {
      return 'F';
    }

    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }

  return listener[META];
};

module.exports = {
  getOrientation(cb) {
    Orientation.getOrientation((error,orientation, width, height) =>{
      cb(error, orientation, width, height);
    });
  },

  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },

  lockToPortrait() {
    Orientation.lockToPortrait();
  },

  lockToLandscape() {
    Orientation.lockToLandscape();
  },

  lockToLandscapeRight() {
    Orientation.lockToLandscapeRight();
  },

  lockToLandscapeLeft() {
    Orientation.lockToLandscapeLeft();
  },

  unlockAllOrientations() {
    Orientation.unlockAllOrientations();
  },

  addOrientationListener(cb) {
    // var key = getKey(cb);
    
    listeners[cb] = DeviceEventEmitter.addListener(orientationDidChangeEvent,
      (body) => {
        cb(body.orientation, body.width, body.height);
      });
  },

  removeOrientationListener(cb) {
    var key = getKey(cb);

    if (!listeners[key]) {
      return;
    }

    listeners[key].remove();
    listeners[key] = null;
  },

  addSpecificOrientationListener(cb) {
    var key = getKey(cb);

    listeners[key] = DeviceEventEmitter.addListener(specificOrientationDidChangeEvent,
      (body) => {
        cb(body.specificOrientation);
      });
  },

  removeSpecificOrientationListener(cb) {
    var key = getKey(cb);

    if (!listeners[key]) {
      return;
    }

    listeners[key].remove();
    listeners[key] = null;
  },

  getInitialOrientation() {
    return Orientation.initialOrientation;
  },

  disableIQKeyBoardManager() {
    return Orientation.disableIQKeyBoardManager();
  },

  enableIQKeyBoardManager() {
    return Orientation.enableIQKeyBoardManager();
  },

  getRectString(cb) {
    Orientation.getRectString((error,width, height) =>{
      cb(error, width, height);
    });
  }
}
