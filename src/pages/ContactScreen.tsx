import { autobind } from "core-decorators";
import React, { PureComponent } from "react";
import { Linking, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FButton from "../controls/FButton";
import Icon from 'react-native-vector-icons/FontAwesome';

import gstore, { contactsDesc } from "../stores/gstore";

class ContactScreen extends PureComponent {

	@autobind
	async handleLogout() {
		await gstore.api.logout();
		await gstore.init();
	}

	render() {
		return (
			<View style={{ height: '100%', alignItems: 'stretch', justifyContent: 'flex-start', backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white' }}>
				<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50, width: '70%', alignSelf: 'center' }}>
					<Text style={{ textAlign: 'center', fontSize: 16, color: gstore.colorSheme === 'dark' ? 'white' : 'black', lineHeight: 24 }}>Вы всегда можете связаться с нами для консультаций и уточнений одним из следующих способов:</Text>
				</View>
				<ScrollView style={{ borderTopWidth: 1, borderTopColor: '#d0d0d0', marginTop: 60 }}>
					{gstore.otherContacts.map(c => (
						<View key={c.id} style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d0d0d0', paddingHorizontal: 30, paddingVertical: 10 }}>
							<View>
								<Text style={{color: gstore.colorSheme === 'dark' ? 'white' : 'black'}}>{contactsDesc[c.type]}</Text>
							</View>
							<View>
								<Text style={{ fontWeight: 'bold', color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{c.value}</Text>
							</View>
						</View>
					))}
					<FButton big style={{ marginTop: 60 }} onPress={() => {
						Linking.openURL(`tel:${gstore.mainPhone}`);
					}}><Icon name="phone" /> Позвонить нам</FButton>
				</ScrollView>
			</View>
		);
	}
}

export default ContactScreen;
