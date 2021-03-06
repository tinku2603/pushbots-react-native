import { NativeModules, NativeAppEventEmitter, NetInfo, Platform } from 'react-native';

const RNPushbotsModule = NativeModules.Pushbots;

const not_handlers = new Map();

function handleConnectionStateChange(isConnected) {
	if (!isConnected) return;
	NetInfo.isConnected.removeEventListener('connectionChange', handleConnectionStateChange);
}

NetInfo.isConnected.fetch().then(isConnected => {
	NetInfo.isConnected.addEventListener('connectionChange', handleConnectionStateChange);
}).catch((...args) => console.warn("Error: ", args));
	

export default class Pushbots {
	static addEventListener(type: any, handler: Function) {
		var listener;
		if (type === 'received') {			
			listener = NativeAppEventEmitter.addListener(
				'Pushbots__RemoteNotificationReceived',
				(notification) => {
					handler(notification);
				}
			);
		}
		not_handlers.set(type, listener);
	}
	
   static removeEventListener(type: any, handler: Function) {

       var listener = not_handlers.get(type);
       if (!listener) {
           return;
       }
       listener.remove();
       not_handlers.delete(type);
   }

	static registerForRemoteNotifications () {	  
		RNPushbotsModule.registerForRemoteNotifications()
	}

	static setAlias (alias) {
		RNPushbotsModule.setAlias(alias)
	}

	static removeAlias(){
		RNPushbotsModule.removeAlias()
	}

	static setTag(tag){
		RNPushbotsModule.setTag(tag)
	}

	static removeTag(tag){
		RNPushbotsModule.removeTag(tag)
	}

	static toggleNotifications(value){
		RNPushbotsModule.toggleNotifications(value)
	}

	static incrementBadgeCountBy(count){
		if (Platform.OS === 'ios') {
			RNPushbotsModule.incrementBadgeCountBy(count)
		}

	}

	static decrementBadgeCountBy(count){
		if (Platform.OS === 'ios') {
			RNPushbotsModule.decrementBadgeCountBy(count)
		}

	}

	static clearBadgeCount(count){
		if (Platform.OS === 'ios') {
			RNPushbotsModule.clearBadgeCount()
		}
	}
}