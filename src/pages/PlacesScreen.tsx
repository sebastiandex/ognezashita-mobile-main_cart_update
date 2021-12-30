import React, { PureComponent } from "react";
import { Image, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { MainMuted, MainHeader } from "../colors";
import FlatText from "../controls/FlatText";

import gstore from "../stores/gstore";

class PlacesScreen extends PureComponent {
	render() {
		return (
			<View style={{ flexGrow: 1, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', }}>
				{gstore.places.length ? (
					<ScrollView style={{
						paddingLeft: '6%',
						paddingRight: '6%',
						marginTop: 10,
						paddingTop: 10,
						flexGrow: 1,
					}}>
						{gstore.places.map((p, idx) => (
							<TouchableOpacity key={idx}>
								<View style={{ flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 0, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
									{gstore.api.fileLink(p.mainPhotoId) ? (<View style={{ flexDirection: 'column', flexBasis: 70, borderRadius: 6, overflow: 'hidden', flexGrow: 0, flexShrink: 0, marginRight: 15, }}>
										<Image source={{ uri: gstore.api.fileLink(p.mainPhotoId) }} style={{ width: 70, height: 70, resizeMode: 'cover' }} />
									</View>) : null}
									<View style={{ flexDirection: 'column' }}>
										<View><Text style={{ fontSize: 16, fontWeight: 'bold', color: MainHeader, marginBottom: 5 }}>{p.name}</Text></View>
										<View style={{ }}><Text style={{ fontSize: 12, color: MainMuted }}>Адрес: {p.address}</Text></View>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				) : (
					<FlatText text={"Здесь будут отображаться объекты, прикреплённые к вашему аккаунту.\n\nСвяжитесь с нами для добавления новых объектов."} callUs={true} />
				)}
			</View>
		);
	}
}

export default PlacesScreen;
