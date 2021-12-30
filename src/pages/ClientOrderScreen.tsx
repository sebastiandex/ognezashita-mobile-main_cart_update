/* eslint-disable prettier/prettier */
import { autobind } from "core-decorators";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import React, { PureComponent, ReactElement } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	Text,
	ScrollView,
	View,
	TouchableOpacity,
	ImageBackground,
	Modal,
	Button, TouchableHighlight
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { MainBackground, MainHeader, MainLight, MainMuted, MainText } from "../colors";
import Centroid from "../controls/Centroid";
import FButton from "../controls/FButton";
import Section from "../controls/Section";
import { IOrderData, ISimpleQueryActionResult } from "../network/api";

import gstore, { IPlace, ISimpleUser, stateDesc } from "../stores/gstore";
import { IOrderNavigation, IOrderRoute } from "./OrderRouterScreen";

import ImageViewer from "react-native-image-zoom-viewer";
import Icon from "react-native-vector-icons/MaterialIcons";
import styled from "styled-components";

import {pickImageAsync, statusColor} from "../utils/mediaUtils";

//@ts-ignore
const CloseButton = styled.TouchableOpacity`
  margin-left : 25px;
  margin-top: 30px;
`;

function UserRow({ text, user }: { text: string, user: { id: string; name: string; photoId: string | null; phone: string; } }) {
	const link = gstore.api.fileLink(user.photoId);

	return (
		<Section noBorder>
			<View style={{ flexDirection: 'row', backgroundColor: MainBackground }}>
				{link ? (
					<View style={{ flexBasis: 72, height: 72, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', flexGrow: 0, flexShrink: 0, marginRight: 15 }}>
						<Image source={{ uri: link }} style={{ width: 72, height: 72}} />
					</View>
				) : null}
				<View style={{ flexGrow: 1, flexDirection: 'row', flexShrink: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
					<View>
						<Text style={{ color: '#949494', fontSize: 14  }}>{text}</Text>
						<Text style={{ fontSize: 16, fontWeight: '600', color: MainText, }}>{user.name}</Text>
					</View>
					{user.phone ? (
						<View style={{marginLeft: 'auto', marginRight: 20, marginTop: 15, justifyContent: 'flex-end'}}>
							<TouchableHighlight onPress={() => {
								Linking.openURL('tel:' + user!.phone);
							}}>
								<View>
									<Image source={require('./../../assets/phoneIcon.png')} style={{ width: 45, height: 45, resizeMode: 'contain' }} />
								</View>
							</TouchableHighlight>
						</View>
						// 	style={{ marginBottom: 12, marginTop: 6 }}>
						// 	<Button title={''} onPress={() => {
						// 		Linking.openURL('tel:' + user!.phone);
						// 	}} >
						// 		<Image source={require('./../../assets/phoneIcon.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
						// 	</Button>
						// 	{/*<FButton onPress={() => {*/}
						// 	{/*	Linking.openURL('tel:' + user!.phone);*/}
						// 	{/*}} small>Позвонить</FButton>*/}
						// </View>
					) : null}
				</View>
			</View>
		</Section>
	);
}

@observer
class ExecutorsModal extends PureComponent<{ onSelect: (a: { id: string; name: string; }) => Promise<void> }> {

	@observable executors: ISimpleQueryActionResult[] = [];
	@observable search: string = '';
	@observable loading = false;

	async componentDidMount() {
		this.loading = true;
		const res = await gstore.api.search('user', null, '', { role: 'executor' });
		if (res.result) {
			this.executors = res.data;
		}
		this.loading = false;
	}

	async updateExecs() {
		this.loading = true;
		const res = await gstore.api.search('user', null, this.search, { role: 'executor' });
		if (res.result) {
			this.executors = res.data;
		}
		this.loading = false;
	}

	render() {
		return (
			<ScrollView
				style={{ left: 0, top: 0, right: 0, bottom: 0, zIndex: 10, position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
				contentContainerStyle={{ flexGrow: 1, flexShrink: 0, flexDirection: 'column', padding: 30, alignItems: 'stretch', justifyContent: 'center' }}
			>
				<View style={{ flexGrow: 1, flexShrink: 0, alignItems: 'stretch', justifyContent: 'center' }}>
					<View style={{ alignItems: 'stretch', padding: 30, borderRadius: 20, backgroundColor: MainBackground }}>
						<View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, top: 10, zIndex: 30, width: 24, height: 24, borderRadius: 12, backgroundColor: '#f0f0f0' }}>
							<TouchableOpacity onPress={() => {
								gstore.setGlobalModal(null);
							}}>
								<View style={{ alignItems: 'center', justifyContent: 'center', width: 24, height: 24 }}>
									<Text style={{ fontWeight: 'bold', marginTop: -2, fontSize: 14 }}>x</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontSize: 18, fontWeight: 'bold' }}>Выберите исполнителя:</Text>
						</View>
						<View style={{ alignItems: 'stretch' }}>
							<TextInput
								value={this.search}
								onChangeText={text => {
									this.search = text;
									this.updateExecs();
								}}
								style={{
									marginTop: 20,
									marginBottom: 30,
									paddingVertical: 4,
									paddingHorizontal: 7,
									borderRadius: 3,
									backgroundColor: '#f0f0f0',
									height: 30,
									width: '100%'
								}}
								placeholder="Поиск..."
							/>
						</View>
						<View style={{ alignItems: 'stretch', justifyContent: 'flex-start' }}>
							{this.loading ? (<ActivityIndicator size="large" color={MainLight} />) : (this.executors.length ? this.executors.map(e => (
								<TouchableOpacity onPress={() => {
									this.props.onSelect({ id: e.id, name: e.text }).then(_ => {
										gstore.setGlobalModal(null);
									});
								}}>
									<View style={{ flexDirection: 'row', marginBottom: 5, paddingBottom: 5, borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
										<Image
											source={{ uri: gstore.api.fileLink(e.payload.photoId) || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }}
											style={{ width: 50, height: 50, borderRadius: 5, marginRight: 15 }}
										/>
										<View>
											<Text style={{ fontSize: 16 }}><Text style={{ fontWeight: 'bold' }}>{e.text}</Text></Text>
											<Text style={{ fontSize: 14 }}>{e.payload.email}</Text>
										</View>
									</View>
								</TouchableOpacity>
							)) : (
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<Text style={{ color: MainMuted, fontSize: 18 }}>Исполнители не найдены</Text>
								</View>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

@observer
class ClientOrderScreen extends PureComponent<{ navigation: IOrderNavigation, route: IOrderRoute }> {

	@observable order!: IOrderData;
	@observable loading = true;
	@observable cancelLoading = false;
	@observable answerLoading = false;
	@observable changeLoading = false;
	@observable error = '';

	@observable reportScreen = false;

	@observable imagesForView: any[] = [];
	@observable idx = 0;

	dispose: null | (() => void) = null;

	@observable isNew = false;

	async componentDidMount() {
		await this.reloadOrder();
		this.dispose = this.props.navigation.addListener('focus', async () => {
			await this.reloadOrder();
		});
	}

	componentWillUnmount() {
		if (this.dispose) {
			this.dispose();
			this.dispose = null;
		}
	}

	@autobind
	async handleAccept() {
		this.answerLoading = true;
		const dRes = await gstore.api.acceptOrder(this.order.id);
		if (!dRes.result) {
			this.error = dRes.error;
		} else {
			await this.reloadOrder();
			gstore.newOrdersCount -= 1;
		}
		this.answerLoading = false;
	}

	@autobind
	async handleDecline() {
		this.answerLoading = true;
		const dRes = await gstore.api.declineOrder(this.order.id);
		if (!dRes.result) {
			this.error = dRes.error;
		} else {
			await this.reloadOrder();
		}
		this.answerLoading = false;
	}

	@autobind
	async handleFinished() {
		this.reportScreen = true;

		// this.answerLoading = true;
		// const dRes = await gstore.api.finishOrder(this.order.id);
		// if (!dRes.result) {
		// 	this.error = dRes.error;
		// } else {
		// 	await this.reloadOrder();
		// }
		// this.answerLoading = false;
	}

	@autobind
	async handleRealFinished() {
		this.answerLoading = true;
		const dRes = await gstore.api.finishOrder(this.order.id, this.reportText, this.reportImageIds);
		if (!dRes.result) {
			this.error = dRes.error;
			this.answerLoading = false;
			return;
		} else {
			await this.reloadOrder();
		}
		this.answerLoading = false;
		this.reportScreen = false;
		this.reportText = '';
		this.reportImageIds = [];
	}

	@autobind
	async reloadOrder() {
		this.loading = true;
		const res = await gstore.api.getOrder(gstore.selectedOrderId);
		if (res.result) {
			this.order = res.data;
			this.isNew = !!(res.data.newState && res.data.newState.state === 'created');
		} else {
			this.error = res.error;
		}
		this.loading = false;
	}

	@autobind
	async handleCancel() {
		this.cancelLoading = true;
		const dRes = await gstore.api.cancelOrder(this.order.id);
		if (!dRes.result) {
			this.error = dRes.error;
			this.cancelLoading = false;
			return;
		}
		this.cancelLoading = false;

		await this.reloadOrder();
	}

	@observable reportText = '';
	@observable reportImageIds: string[] = [];

	renderReportScreen() {
		return (
			<>
				<Section text="Отчёт о проделанной работе" contentStyle={{ paddingVertical: 10 }}>
					<TextInput
						style={{ height: 100, width: '100%', paddingVertical: 0, paddingTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start', textAlignVertical: 'top' }}
						placeholder="Текст"
						multiline={true}
						value={this.reportText}
						onChangeText={text => this.reportText = text}
					/>
				</Section>

				<Section text="Фотографии" contentStyle={{ paddingTop: 20, paddingBottom: 0, flexDirection: 'row', flexWrap: 'wrap' }}>
					{this.reportImageIds.map((id, idx) => (
						<TouchableOpacity onPress={_ => {
							this.idx = idx;
							this.imagesForView = this.reportImageIds.map(i => ({ url: gstore.api.fileLink(i) }));
						}}>
							<ImageBackground
								source={{ uri: gstore.api.fileLink(id) }}
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
									borderRadius: 10,
									borderWidth: 1,
									borderColor: '#c0c0c0',
									width: 100,
									height: 100,
									flexBasis: 100,
									flexGrow: 0,
									flexShrink: 0,
									marginRight: 20,
									marginBottom: 20,
								}}
							>
								<TouchableOpacity onPress={_ => { this.reportImageIds.splice(idx, 1) }} style={{ width: 26, height: 26, paddingBottom: 4, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: 'white', borderWidth: 1, borderColor: '#e0e0e0', position: 'absolute', left: -13, top: -13, zIndex: 10 }}>
									<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#a0a0a0' }}>x</Text>
								</TouchableOpacity>
							</ImageBackground>
						</TouchableOpacity>
					))}
					<TouchableOpacity onPress={_ => {
						pickImageAsync(async files => {
							if (!gstore.me) {
								return;
							}

							try {
								const res = await gstore.api.uploadFile(
									'order',
									this.order.id,
									files[0],
								);

								if (res.result) {
									this.reportImageIds.push(res.data.id);
								}
							} catch (error) {
								console.log(error);
							}
						});
					}}>
						<View
							style={{
								alignItems: 'center',
								flexBasis: 100,
								flexGrow: 0,
								flexShrink: 0,
								justifyContent: 'center',
								borderRadius: 10,
								borderWidth: 1,
								borderColor: '#c0c0c0',
								width: 100,
								height: 100,
								marginBottom: 20,
							}}
						>
							<Text style={{ fontSize: 50 }}>+</Text>
						</View>
					</TouchableOpacity>
				</Section>
				<View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
					<FButton
						style={{ marginBottom: 0, marginLeft: 7, marginRight: 7 }}
						buttonStyle={{ backgroundColor: '#a00000' }}
						onPress={() => {
							this.reportText = '';
							this.reportImageIds = [];
							this.reportScreen = false;
						}}
					>
						Отмена
					</FButton>
					<FButton
						style={{ marginBottom: 0, marginLeft: 7, marginRight: 7 }}
						buttonStyle={{ backgroundColor: '#00a000' }}
						loading={this.answerLoading}
						onPress={this.handleRealFinished}
					>
						Сдать отчёт и завершить
					</FButton>
				</View>
			</>
		);
	}

	@observable viewPlace: IPlace | null = null;
	// private pRes: any;

	renderPlaceContent() {
		if (!this.viewPlace) {
			return null;
		}

		const p = this.viewPlace;

		return (
			<Modal visible={true}>
				<View style={{ flexDirection: 'column', paddingVertical: 30, paddingHorizontal: 30, backgroundColor: MainBackground, alignItems: 'center' }}>
					{gstore.api.fileLink(p.mainPhotoId) ? (<View style={{ flexDirection: 'column', flexBasis: 320, borderRadius: 6, overflow: 'hidden', flexGrow: 0, flexShrink: 0, marginRight: 15, }}>
						<Image source={{ uri: gstore.api.fileLink(p.mainPhotoId) }} style={{ width: 320, height: 320, resizeMode: 'cover' }} />
					</View>) : null}
					<View style={{ flexDirection: 'column', marginTop: 30, alignItems: 'center' }}>
						<View><Text style={{ fontSize: 20, fontWeight: 'bold', color: MainHeader, marginBottom: 15 }}>{p.name}</Text></View>
						<View style={{}}><Text style={{ fontSize: 14, color: MainHeader }}>Адрес: {p.address}</Text></View>
						<FButton onPress={() => this.viewPlace = null} style={{ marginTop: 30 }}>Назад</FButton>
					</View>
				</View>
			</Modal>
		);
	}

	renderPlaceContentNew() {
		if (!this.viewPlace) {
			return null;
		}

		const p = this.viewPlace;

		return (
            // <TouchableOpacity style={{ marginBottom: 0, marginTop: 10 }} onPress={() => this.renderPlaceContent()}>
				<View style={{ flexDirection: 'column', paddingLeft: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', backgroundColor: MainBackground, alignItems: 'flex-start' }}>
					{/*{gstore.api.fileLink(p.mainPhotoId) ? (<View style={{ flexDirection: 'column', flexBasis: 320, borderRadius: 6, overflow: 'hidden', flexGrow: 0, flexShrink: 0, marginRight: 15, }}>*/}
					{/*	<Image source={{ uri: gstore.api.fileLink(p.mainPhotoId) }} style={{ width: 72, height: 72, resizeMode: 'cover' }} />*/}
					{/*</View>) : null}*/}
					<View style={{ flexDirection: 'column',  alignItems: 'flex-start' }}>
						<View>
							<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainText, marginBottom: 15 }}>Название объекта:</Text>
							<Text style={{ fontSize: 16, color: '#A3A3A3', marginBottom: 15 }}>{p.name}</Text>
						</View>
						{/*<View style={{}}><Text style={{ fontSize: 14, color: MainHeader }}>Адрес: {p.address}</Text></View>*/}
						{/*<FButton onPress={() => this.viewPlace = null} style={{ marginTop: 30 }}>Назад</FButton>*/}
					</View>
				</View>
            // </TouchableOpacity>
		);
	}

	renderCartContent() {

		return (
    <>
	{this.renderPlaceContentNew()}
			<Section noBorder text="Состав заявки" contentStyle={{ paddingVertical: 10 }}>

				{this.order.content.cart.map((item, index) => (
					<View key={item.itemId}
						  style={{
						  	flexDirection: 'column',
							  alignItems: 'flex-start',
							  justifyContent: 'space-between',
							  paddingVertical: 12,
							  backgroundColor: MainBackground,
							  borderBottomColor: '#E5E5E5',
							  borderBottomWidth: (this.order.content.cart.length === index + 1) ? 0 : 1 }}
					>
						{(gstore.me!.role !== 'user' && item.placeId && !this.isNew) ? (
							<View style={{ alignSelf: 'flex-start' }} onLayout={async () => {
								if (!item.placeId) {
									return;
								}
								const pRes = await gstore.api.getPlace(item.placeId);
								if (pRes.result) {
									this.viewPlace = pRes.data;
									console.log('PRESDATA', pRes.data)
								}}}
								>

							{/*	<TouchableOpacity style={{ marginBottom: 0, marginTop: 10 }} onPress={async () => {*/}
							{/*	if (!item.placeId) {*/}
							{/*		return;*/}
							{/*	}*/}
							{/*	const pRes = await gstore.api.getPlace(item.placeId);*/}
							{/*	if (pRes.result) {*/}
							{/*		this.viewPlace = pRes.data;*/}
							{/*		console.log('PRESDATA', pRes.data)*/}
							{/*	}*/}
							{/*}}>*/}
							{/*		<Text>{2222}</Text>*/}
							{/*	</TouchableOpacity>*/}

							</View>
						) : null}
						<View style={{ flexGrow: 1, flexShrink: 1 }}>
							<View style={{flexDirection: 'row'}}>
								<Image source={{ uri: gstore.api.fileLink(item.itemImageId) }} style={{ borderRadius: 18, width: 72, height: 72, backgroundColor: '#E5E5E5', resizeMode: 'contain' }} />
								<View style={{marginLeft: 15, width: '75%'}}>
									<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainText, flexWrap: 'wrap'}}>{item.itemTitle}</Text>
									<Text style={{ fontSize: 12, color: MainMuted }}>Количество: {item.amount}</Text>
									<Text style={{ color: MainText }}>Адрес: {item.address}</Text>
								</View>
							</View>
							{/*<View style={{ marginBottom: 12 }}><Text style={{ fontSize: 12, color: MainMuted }}>Количество: {item.amount}</Text></View>*/}
							{/*<View><Text style={{ color: MainText }}>Адрес: {item.address}</Text></View>*/}
						</View>
					</View>
				))}
			</Section>
    </>
		);
	}

	@autobind
	async onExecutorSelect({ id, name }: { id: string, name: string }) {
		this.changeLoading = true;
		const dRes = await gstore.api.changeOrder(this.order.id, { activeExecutorId: id, state: 'executing' });
		if (!dRes.result) {
			this.error = dRes.error;
			this.changeLoading = false;
			return;
		}
		this.changeLoading = false;

		await this.reloadOrder();
	}

	renderExecutorSelect() {
		return <ExecutorsModal onSelect={this.onExecutorSelect} />;
	}

	@autobind
	handleChangeExecutor() {
		gstore.setGlobalModal(this.renderExecutorSelect());
	}

	renderOrder() {
		return (
			<ScrollView style={{ backgroundColor: MainBackground, flexGrow: 1 }}>
				<Modal visible={this.imagesForView.length !== 0} transparent={true}>
					<ImageViewer
						loadingRender={() => <ActivityIndicator size="large" />}
						renderHeader={() =>
							<CloseButton onPress={() => this.imagesForView = ([])}>
								<Icon size={30} name="clear" color="#fff" />
							</CloseButton>
						}
						index={this.idx}
						renderIndicator={() => null as any as ReactElement}
						saveToLocalByLongPress={false}
						imageUrls={toJS(this.imagesForView)}
					/>
				</Modal>
				{this.reportScreen ? (this.renderReportScreen()) : (
					<View style={{backgroundColor: MainBackground}}>
						<Section>
							<Text style={{ color: '#949494', fontSize: 14 }}>Название:</Text>
							<Text style={{ color: MainText, fontWeight: '600', fontSize: 16, marginBottom: 18 }}>{this.order.title}</Text>
							<Text style={{ color: '#949494', fontSize: 14 }}>Текс заявки:</Text>
							<Text style={{ color: MainText, fontWeight: '600', fontSize: 16 }}>{this.order.content.description}</Text>
						</Section>

						{this.order.content.type === 'cart' ? this.renderCartContent() : null}


						<Text style={{marginLeft: 20, marginTop: 20, fontSize: 18, fontWeight: '600', marginBottom: 10, color: MainText}}>Пользователи:</Text>
						{((gstore.me!.role === 'user' || gstore.me!.role === 'admin') && this.order.activeExecutor) ? (
							<UserRow text="Исполнитель" user={this.order.activeExecutor} />
						) : null}

						{((gstore.me!.role === 'executor' || gstore.me!.role === 'admin') && this.order.createdByUser && !this.isNew) ? (
							<>
								<View style={{width: '90%', marginLeft: '5%', borderBottomWidth: 1, borderBottomColor: '#E5E5E5', marginBottom: 15}}/>
								<UserRow text="Заказчик" user={this.order.createdByUser} />
							</>
						) : null}
						<View style={{borderBottomWidth: 1, borderBottomColor: '#E5E5E5', marginBottom: 15}}/>
						<Section noBorder text="Статус:">
							<View style={{ marginTop: -10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
								{gstore.me!.role !== 'admin' ? (
									<View style={{borderStyle: 'solid', borderWidth: 1, borderRadius: 8, borderColor: statusColor(stateDesc[this.order.state]) }}>
										<Text
											style={{
												paddingHorizontal: 20,
												paddingBottom: 5,
												paddingTop: 5,
												alignItems: 'center',
												textAlignVertical: 'center',
												color: statusColor(stateDesc[this.order.state])
											}}
										>
											{stateDesc[this.order.state]}
										</Text>
									</View>
								) : null }
							</View>
							{gstore.me!.role === 'admin' ? (
								<View style={{ alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'flex-start', flexDirection: 'row' }}>
									{this.order.state !== 'executing' ? (
										<FButton
											style={{ marginBottom: 0, marginRight: 10, marginTop: 5 }}
											buttonStyle={{backgroundColor: '#F48E39', width: 176}}
											onPress={(this.order.content.type as string) === 'simple' ? this.handleAccept : this.handleChangeExecutor}
											big
										>
											{(this.order.content.type as string) === 'simple' ? 'В работу' : (this.order.state !== 'created' ? 'Смена исполнителя' : 'Выбор исполнителя')}
										</FButton>
									) : null}

									{this.order.state !== 'done' ? (
										<FButton
											style={{ marginBottom: 0, marginRight: 10, marginTop: 5 }}
											buttonStyle={{ backgroundColor: '#4CBD57', width: 108 }}
											onPress={this.handleFinished}
											big
										>
											Выполнено
										</FButton>
									) : null}
									{this.order.state !== 'cancelled' ? (
										<FButton
											style={{ marginBottom: 0, marginRight: 10, marginTop: 5 }}
											buttonStyle={{ backgroundColor: '#E73838', width: 106 }}
											onPress={this.handleCancel}
											big
										>
											Отменить
										</FButton>
									) : null}

								</View>
							) : null}
						</Section>
						{(this.order.report && ((gstore.me!.role === 'executor' && this.order.activeExecutorId === gstore.me!.id) || gstore.me!.role === 'admin')) ? (
							<>
								<Section text="Текст отчёта о работах">
									<Text style={{color: MainText}}>{this.order.report.text}</Text>
								</Section>
								<Section text="Фотографии отчёта">
									{this.order.report.imageIds.map((id, idx) => (
										<TouchableOpacity onPress={_ => {
											this.idx = idx;
											this.imagesForView = this.order.report!.imageIds.map(i => ({ url: gstore.api.fileLink(i) }));
										}}>
											<ImageBackground
												source={{ uri: gstore.api.fileLink(id) }}
												style={{
													alignItems: 'center',
													justifyContent: 'center',
													borderRadius: 10,
													overflow: 'hidden',
													borderWidth: 1,
													borderColor: '#c0c0c0',
													width: 100,
													height: 100,
													flexBasis: 100,
													flexGrow: 0,
													flexShrink: 0,
													marginRight: 20,
													marginBottom: 20,
												}}
											>
											</ImageBackground>
										</TouchableOpacity>
									))}
								</Section>
							</>
						) : null}

						{gstore.me!.role !== 'admin' ? (
							<View style={{ height: 30, marginTop: 20, marginBottom: 30, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
								{(this.order.state === 'created' && this.order.createdByUserId === gstore.me!.id) ? (
									<FButton
										style={{ marginBottom: 0, marginLeft: 5, marginRight: 5 }}
										buttonStyle={{ backgroundColor: '#E73838' }}
										onPress={this.handleCancel}
										small
									>
										Отменить
									</FButton>
								) : null}

								{(this.order.state === 'executing' && this.order.activeExecutorId === gstore.me!.id) ? (
									<FButton
										style={{ marginBottom: 0, marginLeft: 5, marginRight: 5 }}
										buttonStyle={{ backgroundColor: '#00a000' }}
										onPress={this.handleFinished}
										small
									>
										Завершить
									</FButton>
								) : null}

								{(gstore.me!.role === 'executor' && this.isNew) ? (
									<>
										<FButton
											style={{ marginBottom: 0, marginLeft: 5, marginRight: 5 }}
											buttonStyle={{ backgroundColor: '#2A5EE4' }}
											onPress={this.handleAccept}
											small
										>
											В работу
										</FButton>
										<FButton
											style={{ marginBottom: 0, marginLeft: 5, marginRight: 5 }}
											buttonStyle={{ backgroundColor: '#E73838' }}
											onPress={this.handleDecline}
											small
										>
											Отказаться
										</FButton>
									</>
								) : null}
							</View>
						) : null}
					</View>)}
			</ScrollView>
		);
	}

	render() {
		if (this.loading) {
			return <Centroid><ActivityIndicator size="large" color={MainLight} /></Centroid>
		}
		if (this.error) {
			return <Centroid><Text>{this.error}</Text></Centroid>
		}
		return this.renderOrder();
	}
}

export default ClientOrderScreen;
