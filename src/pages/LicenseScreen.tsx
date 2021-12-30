import { autobind } from "core-decorators";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import React, { PureComponent, ReactElement } from "react";
import { ScrollView, Dimensions, Image, Text, TouchableOpacity, View, Modal, ActivityIndicator } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Icon from "react-native-vector-icons/MaterialIcons";
import styled from "styled-components";

import gstore from "../stores/gstore";

@observer
class LicenseScreen extends PureComponent {

	@autobind
	async handleLogout() {
		await gstore.api.logout();
		await gstore.init();
	}

	@observable imagesForView: any[] = [];
	@observable idx = 0;

	render() {
		const width = Dimensions.get('window').width;
		const height = Dimensions.get('window').height;
		return (
			<ScrollView style={{ flexGrow: 1}} contentContainerStyle={{ height: '100%', alignItems: 'stretch', justifyContent: 'flex-start', backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white' }}>
				<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50, marginBottom: 50, width: '70%', alignSelf: 'center' }}>
					<Text style={{ textAlign: 'center', fontSize: 16, color: gstore.colorSheme === 'dark' ? 'white' : 'black', lineHeight: 24 }}>Вы можете ознакомиться с нашими действующими лицензиями на проведение всех регламентных работ</Text>
				</View>
				<View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
					{gstore.licenses.map((l, idx) => (
						<View key={l.id} style={{ alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexGrow: 0, flexShrink: 1, flexBasis: (width - 100) / 2, height: height * 0.28, borderRadius: 10, borderWidth: 1, borderColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white' }}>
							<TouchableOpacity onPress={() => { this.imagesForView = gstore.licenses.map(t => ({ url: gstore.api.fileLink(t.mainPhotoId) })); this.idx = idx; }} style={{ width: '100%', height: '100%' }}>
								<Image
									source={{ uri: gstore.api.fileLink(l.mainPhotoId) }}
									style={{
										resizeMode: 'contain',
										width: '100%',
										height: '100%',
									}}
								/>
							</TouchableOpacity>
						</View>
					))}
				</View>

				<Modal visible={this.imagesForView.length !== 0} transparent={true}>
					<ImageViewer
						loadingRender={() => <ActivityIndicator size="large"/>}
						renderHeader={() =>
							<CloseButton onPress={() => this.imagesForView = ([])}>
								<Icon size={30} name="clear" color="#fff"/>
							</CloseButton>
						}
						renderIndicator={() => null as any as ReactElement}
						index={this.idx}
						saveToLocalByLongPress={false}
						imageUrls={toJS(this.imagesForView)}
					/>
				</Modal>
			</ScrollView>
		);
	}
}

//@ts-ignore
const CloseButton = styled.TouchableOpacity`
  margin-left : 25px;
  margin-top: 30px;
`;

export default LicenseScreen;
