import { observer } from "mobx-react";
import React, { PureComponent } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { MainBackground, MainBorder, MainHeader, MainLight, MainMuted, MainText } from "../colors";
import FlatText from "../controls/FlatText";

import gstore, { stateDesc } from "../stores/gstore";
import { IHomeRoute, IHomeNavigation } from "./MainScreen";

import moment from 'moment';
import { observable } from "mobx";
import FButton from "../controls/FButton";

@observer
class HomeScreen extends PureComponent<{ route: IHomeRoute, navigation: IHomeNavigation }> {

	static navigationOptions = {
		drawerLabel: 'Home',
	};

	dispose: null | (() => void) = null;

	@observable loading = true;

	async onLoad() {
		this.loading = true;
		await gstore.init();
		this.loading = false;
	}

	async componentDidMount() {
		await this.onLoad();

		this.dispose = this.props.navigation.addListener('focus', async (e: any) => {
			await this.onLoad();
		})
	}

	componentWillUnmount() {
		if (this.dispose) {
			this.dispose();
			this.dispose = null;
		}
	}

	getUneadCount() {
		const a = gstore.unreadNotifications.length;
		const b = a % 100;
		const c = a % 10;
		if (c === 0 || (c >= 5 && c <= 9) || b >= 10 && a < 20) {
			return 'непрочитанных оповещений';
		} else
		if (c === 1) {
			return 'непрочитанное оповещение';
		} else
		if (c >= 2 && c <= 4) {
			return 'непрочитанных оповещения';
		} else {
			return 'непрочитанных оповещения';
		}
	}

	render() {
		return (
			this.loading ? (<ActivityIndicator color={MainLight} style={{ marginTop: 40 }} size="large" />) : (
				<ScrollView style={{
					paddingLeft: '6%',
					paddingRight: '6%',
					marginTop: 0,
					paddingTop: 20,
					flexGrow: 1,
					flexShrink: 1,
					backgroundColor: MainBackground,
				}}>
					{gstore.unreadNotifications.length ? (
						<TouchableOpacity onPress={() => {
							this.props.navigation.jumpTo('Notifications');
						}}>
							<View style={{
								backgroundColor: '#b00000',
								borderRadius: 5,
								paddingVertical: 12,
								paddingHorizontal: 20,
								width: '100%',
								marginTop: 15,
								marginBottom: 20,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}>
								<Text style={{ color: 'white' }}>У вас {gstore.unreadNotifications.length} {this.getUneadCount()}!</Text>
								<Icon name="chevron-right" color="white" />
							</View>
						</TouchableOpacity>
					) : null}
					{(gstore.me!.role === 'admin') ? (
						<View style={{ marginBottom: 25 }}>
							<View style={{ marginBottom: 5 }}>
								<Text style={{ fontSize: 30, fontWeight: 'bold', color: MainLight }}>Состояние системы</Text>
							</View>
							<TouchableOpacity onPress={() => {
								//@ts-ignore
								this.props.navigation.jumpTo('OrderRouter');
							}}>
								<View style={{ marginTop: 18, borderRadius: 5, backgroundColor: '#64AD4B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
									<View><Text style={{ fontSize: 16, color: 'white', }}>Заявки в работе</Text></View>
									<View><Text style={{ fontSize: 16, color: 'white' }}>{gstore.ordersInWorkCount}</Text></View>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								//@ts-ignore
								this.props.navigation.jumpTo('NewOrderRouter');
							}}>
								<View style={{ marginTop: 18, borderRadius: 5, backgroundColor: '#4E74AC', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
									<View><Text style={{ fontSize: 16, color: 'white', }}>Новые заявки</Text></View>
									<View><Text style={{ fontSize: 16, color: 'white' }}>{gstore.ordersWaitingAnswerCount}</Text></View>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								//@ts-ignore
								this.props.navigation.jumpTo('ExecsOrderRouter');
							}}>
								<View style={{ marginTop: 18, borderRadius: 5, backgroundColor: '#D49537', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
									<View><Text style={{ fontSize: 16, color: 'white', }}>Заявки от исполнителей</Text></View>
									<View><Text style={{ fontSize: 16, color: 'white' }}>{gstore.ordersFromExecutorsCount}</Text></View>
								</View>
							</TouchableOpacity>
						</View>
					) : null}
					{(gstore.me!.role === 'user' || gstore.me!.role === 'executor') ? (
						<>
							<View style={{ marginBottom: 25 }}>
								<View style={{ marginBottom: 5 }}>
									<Text style={{ fontSize: 22, fontWeight: 'bold', color: MainLight }}>Ваши заявки</Text>
								</View>
								{gstore.activeOrders.length ? (
									gstore.activeOrders.map((ord, idx) => (
										<TouchableOpacity key={idx} onPress={() => {
											gstore.selectedOrderId = ord.id;
											this.props.navigation.jumpTo('OrderRouter', { screen: 'Order', orderId: ord.id });
										}}>
											<View style={{ paddingVertical: 18, paddingHorizontal: 0, backgroundColor: MainBackground, borderBottomColor: MainBorder, borderBottomWidth: 1 }}>
												<View><Text style={{ fontSize: 16, fontWeight: 'bold', color: MainHeader }}>{ord.title}</Text></View>
												<View style={{ marginBottom: 12 }}><Text style={{ fontSize: 12, color: MainMuted }}>{moment(ord.createdAt).format('DD.MM.YYYY HH:mm')}</Text></View>
												<View><Text style={{ color: MainText }}>{stateDesc[ord.state]}</Text></View>
											</View>
										</TouchableOpacity>
									))
								) : (
									<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 30, width: '90%', alignSelf: 'center' }}>
										<Text style={{ textAlign: 'center', fontSize: 16, color: '#404040', lineHeight: 24 }}>У вас нет активных заявок на покупку товаров или оказание услуг</Text>
										{gstore.me!.role === 'user' ? (
											<FButton style={{ marginTop: 40 }} onPress={() => { this.props.navigation.jumpTo('Services', {}); }}>Создать новый заказ</FButton>
										) : null}
									</View>
								)}
							</View>
						</>
					) : null}
					{gstore.me!.role === 'user' ? (
						<>
							<View style={{ marginBottom: 5, marginTop: 10 }}>
								<Text style={{ fontSize: 22, fontWeight: 'bold', color: MainLight }}>Ваши объекты</Text>
							</View>
							{gstore.places.length ? (
								gstore.places.map((p, idx) => (
									<TouchableOpacity key={idx}>
										<View style={{ flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 0, backgroundColor: MainBackground, borderBottomColor: MainBorder, borderBottomWidth: idx === gstore.places.length - 1 ? 0 : 1 }}>
											{gstore.api.fileLink(p.mainPhotoId) ? (<View style={{ flexDirection: 'column', flexBasis: 70, borderRadius: 6, overflow: 'hidden', flexGrow: 0, flexShrink: 0, marginRight: 15, }}>
												<Image source={{ uri: gstore.api.fileLink(p.mainPhotoId) }} style={{ width: 70, height: 70, resizeMode: 'cover' }} />
											</View>) : null}
											<View style={{ flexDirection: 'column' }}>
												<View><Text style={{ fontSize: 16, fontWeight: 'bold', color: MainHeader, marginBottom: 5 }}>{p.name}</Text></View>
												<View style={{ }}><Text style={{ fontSize: 12, color: MainMuted }}>Адрес: {p.address}</Text></View>
											</View>
										</View>
									</TouchableOpacity>
								))
							) : (
								<FlatText text="Администратор должен добавить объекты в Ваш аккаунт. Пожалуйста, свяжитесь с нами в случае вопросов." callUs />
							)}
						</>
					) : null}
				</ScrollView>
			)
		);
	}
}

export default HomeScreen;