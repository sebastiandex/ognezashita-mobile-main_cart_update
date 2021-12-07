import React, { PureComponent } from 'react';
import { reaction } from 'mobx';

import { Notifications } from 'react-native-notifications';

import gstore from '../stores/gstore';

class PushNotificationsManager extends PureComponent {

	dispose: any;

	componentDidMount() {
		this.dispose = reaction(() => gstore.fullMe, (user => {
			console.log('reaction to user: ', user);
			if (user) {
				this.registerDevice(user);
				this.registerNotificationEvents();

				this.dispose();
				this.dispose = null;
			}
		}));

		if (gstore.fullMe) {
			this.registerDevice(gstore.fullMe);
			this.registerNotificationEvents();

			this.dispose();
			this.dispose = null;
		}
	}

	async registerDevice(user: { id: string; deviceToken: string | null }) {
		const hasPermissions: boolean = await Notifications.isRegisteredForRemoteNotifications();
		console.log('hasPermissions?')
		console.log(hasPermissions)
		Notifications.ios.checkPermissions().then((response) => {
        console.log('Response:')
        console.log(response)
        console.info('=================================')
    })
    .catch(err => console.error(err));
	Notifications.ios.getDeliveredNotifications().then((response) => {
        console.log('getDeliveredNotifications:')
        console.log(response)
        console.info('=================================')
    });
	Notifications.ios.getBadgeCount().then((response) => {
        console.log('getBadgeCount:')
        console.log(response)
        console.info('=================================')
    });
		// await gstore.api.log('registerDevice');
		// await gstore.api.log('await Notifications.isRegisteredForRemoteNotifications(): ' + (await Notifications.isRegisteredForRemoteNotifications()));
		Notifications.events().registerRemoteNotificationsRegistered(async event => {
			await gstore.api.log('Device Token Received, saving... ' + event.deviceToken);
			if (event.deviceToken && event.deviceToken !== user.deviceToken) {
				const result = await gstore.api.updateDeviceToken(event.deviceToken);
				await gstore.api.log('New device token was sent to user account: ' + JSON.stringify(result));
			}
		});
		Notifications.events().registerRemoteNotificationsRegistrationFailed(async (event) => {
			await gstore.api.log(JSON.stringify(event));
		});

		Notifications.registerRemoteNotifications();
	}

	async registerNotificationEvents() {
		Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
			console.log('registerRemoteNotificationsRegistrationFailed')
  		console.log(event.code, event.localizedDescription, event.domain);
});
		console.log('PushManager registered');
		Notifications.events().registerNotificationReceivedForeground(async (notification, completion) => {
			console.log('Notification Received - Foreground', notification);
			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			const rr = await gstore.api.getNewOrders();
			console.log('loggingResult')
			console.log(rr)
			if (rr.result) {
				console.log('We have rr.result')
				gstore.newOrdersCount = rr.data.newOrdersCount;
				gstore.ordersInWorkCount = rr.data.ordersInWorkCount;
			}
			completion({ alert: true, sound: false, badge: false });
		});
	  
		// User clicked on foreground or background notification
		Notifications.events().registerNotificationOpened(async (notification, completion) => {
			console.log('Notification opened by device user', notification);
			gstore.notification = notification.payload;
			const rr = await gstore.api.getNewOrders();
			if (rr.result) {
				gstore.newOrdersCount = rr.data.newOrdersCount;
				gstore.ordersInWorkCount = rr.data.ordersInWorkCount;
			}
			completion();
		});
	  
		Notifications.events().registerNotificationReceivedBackground(async (notification, completion) => {
			console.log('Notification Received - Background', notification);
			// Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
			const rr = await gstore.api.getNewOrders();
			if (rr.result) {
				gstore.newOrdersCount = rr.data.newOrdersCount;
				gstore.ordersInWorkCount = rr.data.ordersInWorkCount;
			}
			//@ts-ignore
			completion({ alert: true, sound: true, badge: true });
			// completion({ alert: true, sound: true, badge: false });
		});
	  
		try {
			const notification = await Notifications.getInitialNotification()
			console.log('Initial notification was:', notification || 'N/A');
			if (notification) {
				gstore.notification = notification.payload;
			}
			
			console.log('hey', notification);
		} catch (err) {
			console.log('getInitialNotifiation() failed', err);
		}
	}

	componentWillUnmount() {
		if (this.dispose) {
			this.dispose();
		}
	}

	render() {
		const { children } = this.props;
		return (
			children
		);
	}
}

export default PushNotificationsManager;