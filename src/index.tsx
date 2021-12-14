import React, { PureComponent } from "react";

import { observable, reaction } from "mobx";
import { observer } from "mobx-react";
import { SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from "react-native";
import gstore from "./stores/gstore";
import Centroid from "./controls/Centroid";
import AuthScreen from "./pages/AuthScreen";
import MainScreen from "./pages/MainScreen";
import { MainLight } from "./colors";
import PushNotificationsManager from "./controls/PushNotificationsManager";

@observer
class App extends PureComponent {

	@observable loading = true;

	async componentDidMount() {
		await gstore.init();
		this.loading = false;

		reaction(() => gstore.globalModalId, () => this.forceUpdate());
	}

	render() {
		return (
			<PushNotificationsManager>
				<KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={{ flexGrow: 1, flexShrink: 1, alignItems: 'stretch' }}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<SafeAreaView style={{ backgroundColor: gstore.me ? 'white' : '#312D2C', flexGrow: 1, flexShrink: 1, alignItems: 'stretch' }}>
							{this.loading ? (
								<Centroid>
									<ActivityIndicator color={MainLight} size="large" />
								</Centroid>
							) : (
								gstore.me ? (
									<MainScreen />
								) : (
									<AuthScreen />
								)
							)}
							{gstore.globalModal}
						</SafeAreaView>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</PushNotificationsManager>
		);
	}
}

export default App;
