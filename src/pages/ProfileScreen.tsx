import { autobind } from "core-decorators";
import React, { PureComponent } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FButton from "../controls/FButton";

import gstore from "../stores/gstore";
//@ts-ignore
import photoPlaceholder from '../user.png';
import {changeTheme, pickImageAsync} from "../utils/mediaUtils";

//@ts-ignore
import Prompt from 'react-native-input-prompt';
import { observable } from "mobx";
import { observer } from "mobx-react";
import {MainBackground, MainText} from "../colors";

@observer
class ProfileScreen extends PureComponent {

	@observable promptVisible = false;
	@observable promptTitle = '';
	@observable promptValue = '';
	@observable promptCallback: any = null;
	@observable passChanged = false;

	prompt(title: string, defaultValue: string): Promise<string | null> {
		return new Promise((resolve) => {
			this.promptTitle = title;
			this.promptValue = defaultValue;
			this.promptCallback = resolve;
			this.promptVisible = true;
		});
	}

	@autobind
	async handleLogout() {
		await gstore.api.logout();
		gstore.stopNOTimer();
		await gstore.init();
	}

	@autobind
	openGallery() {
		pickImageAsync(async files => {
			if (!gstore.me) {
				return;
			}

			console.log('Format: ', files[0]);
			try {
				const res = await gstore.api.uploadFile(
					'user',
					gstore.me.id,
					files[0],
				);

				if (gstore.fullMe && res.result) {
					gstore.fullMe.photoId = res.data.id;
				}
			} catch (error) {
				console.log(error);
			}
		});
	}

	@observable phoneLoading = false;
	@observable nameLoading = false;
	@observable emailLoading = false;
	@observable passwordLoading = false;

	@autobind
	async handlePhone() {
		const newPhone = await this.prompt('Введите телефон:', gstore.fullMe!.phone);
		if (newPhone) {
			this.phoneLoading = true;
			const res = await gstore.api.updateUser(gstore.fullMe!.id, { phone: newPhone });
			if (res.result) {
				gstore.fullMe!.phone = newPhone;
			}
			this.phoneLoading = false;
		}
	}

	@autobind
	async handleName() {
		const newName = await this.prompt('Введите имя:', gstore.fullMe!.name);
		if (newName) {
			this.nameLoading = true;
			const res = await gstore.api.updateUser(gstore.fullMe!.id, { name: newName });
			if (res.result) {
				gstore.fullMe!.name = newName;
			}
			this.nameLoading = false;
		}
	}

	@autobind
	async handleEmail() {
		const newEmail = await this.prompt('Введите email:', gstore.fullMe!.email);
		if (newEmail) {
			this.phoneLoading = true;
			const res = await gstore.api.updateUser(gstore.fullMe!.id, { email: newEmail });
			if (res.result) {
				gstore.fullMe!.email = newEmail;
				gstore.me!.email = newEmail;
			}
			this.phoneLoading = false;
		}
	}

	@autobind
	async handlePassword() {
		const newPassword = await this.prompt('Введите пароль:', '');
		if (newPassword) {
			this.phoneLoading = true;
			const res = await gstore.api.updateUser(gstore.fullMe!.id, { password: newPassword });
			if (res.result) {
				this.passChanged = true;
			}
			this.phoneLoading = false;
		}
	}

	render() {
		const fm = gstore.fullMe;
		if (!fm) {
			return null;
		}

		return (
			<>
				<TouchableOpacity
					style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 20, top: 13, zIndex: 99999 }}
					onPress={() => changeTheme()}
				>
					<Image source={gstore.colorScheme === 'dark' ? require('./../../assets/day.png') : require('./../../assets/night.png')}
						   style={{width: 20, height: 20, resizeMode: 'contain'}}
					/>
				</TouchableOpacity>
				<Prompt
					title={this.promptTitle}
					placeholder="Введите значение..."
					submitText="Сохранить"
					cancelText="Отмена"
					defaultValue={this.promptValue}
					visible={this.promptVisible}
					onCancel={() => {
						this.promptCallback(null);
						this.promptVisible = false;
					}}
					onSubmit={(value: string) => {
						this.promptCallback(value);
						this.promptVisible = false;
					}}
				/>
				<View style={{ height: '100%', alignItems: 'stretch', justifyContent: 'flex-start', backgroundColor: MainBackground }}>
					{/*<View style={{ height: 120, backgroundColor: '#312D2C' }}>*/}

					{/*</View>*/}
					<View style={{ backgroundColor: MainBackground }}>
						<View style={{ alignItems: 'center' }}>
							<View style={{ marginTop: 20,
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
								borderWidth: 1,
								borderColor: 'white',
								width: 160, height: 160,
								borderRadius: 32,
								backgroundColor: MainBackground }}>
								<TouchableOpacity onPress={this.openGallery}>
									<Image
										source={fm.photoId ? { uri: gstore.api.fileLink(fm.photoId) } : photoPlaceholder}
										style={{
											width: 160,
											height: 160,
											resizeMode: 'cover'
										}}
									/>
								</TouchableOpacity>
							</View>
							<View style={{ marginTop: 15 }}>
								<TouchableOpacity onPress={this.handleName}>
									<Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center', color: MainText }}>{fm.name || '[Нажмите для ввода имени]'}</Text>
								</TouchableOpacity>
							</View>
						</View>
						<ScrollView style={{ borderTopWidth: 1, borderTopColor: '#d0d0d0', marginTop: 25 }}>
							<View style={{ height: 70, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d0d0d0', paddingHorizontal: 30, paddingVertical: 10 }}>
								<View>
								<Text style={{ justifyContent: 'flex-start', fontWeight: 'normal', marginRight: 'auto', color: MainText  }}>{fm.phone || 'Номер телефона'}</Text>
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>

									<FButton
										onPress={this.handlePhone}
										style={{ marginBottom: 0, marginLeft: 20, fontSize: 15}}
										tiny
									>
										{fm.phone ? 'Изменить' : 'Добавить'}
									</FButton>
								</View>
							</View>
							<View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d0d0d0', paddingHorizontal: 30, paddingVertical: 10 }}>
								<View>
									<Text style={{ justifyContent: 'flex-start', fontWeight: 'normal', marginRight: 'auto', color: MainText  }}>{fm.email || 'Эл. почта'}</Text>
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
									<FButton onPress={this.handleEmail} style={{ marginBottom: 0, marginLeft: 20, }} tiny>{fm.email ? 'Изменить' : 'Добавить'}</FButton>
								</View>
							</View>
							<View style={{ height: 60, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#d0d0d0', paddingHorizontal: 30, paddingVertical: 10 }}>
								<View>
									<Text style={{ justifyContent: 'flex-start', fontWeight: 'normal', marginRight: 'auto', color: MainText  }}>************{this.passChanged ? ' (изменён)' : ''}</Text>
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
									{/*<Text>*********{this.passChanged ? ' (изменён)' : ''}</Text>*/}
									<FButton onPress={this.handlePassword} style={{ marginBottom: 0, marginLeft: 20, }} tiny>Изменить</FButton>
								</View>
							</View>
						</ScrollView>
					</View>
					<FButton
						style={{ marginTop: 35 }}
						buttonStyle={{ backgroundColor: '#E73838' }}
						onPress={this.handleLogout} tiny>Выйти</FButton>

				</View>
			</>
		);
	}
}

export default ProfileScreen;
