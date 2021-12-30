import { RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { autobind } from "core-decorators";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { PureComponent } from "react";
import { ScrollView, TouchableHighlight, TouchableOpacity, Text, View, FlatList, ListRenderItemInfo, ActivityIndicator, Image } from "react-native";
import { MainHeader, MainLight, MainMuted } from "../colors";
import FlatText from "../controls/FlatText";
import moment from 'moment';

import gstore, { IRNotification } from "../stores/gstore";
import { IServiceItem } from "../network/api";
import FButton from "../controls/FButton";

const Stack = createStackNavigator();

type RootStackParamList = {
	NotList: undefined;
	NotEntity: IRNotification;
};

type IEntityRoute = RouteProp<RootStackParamList, 'NotEntity'>;
type IEntityNavigation = StackNavigationProp<RootStackParamList, 'NotEntity'>;

type IListNavigation = StackNavigationProp<RootStackParamList, 'NotList'>;

@observer
class Notification extends PureComponent<{ navigation: IEntityNavigation, route: IEntityRoute }> {

	@observable goods: IServiceItem[] = [];
	@observable loadingGoods = false;

	async loadGoods(ids: string[]) {
		this.loadingGoods = true;

		const newGoods = await gstore.api.listServices(ids);
		if (newGoods.result) {
			this.goods.push(...newGoods.data);
		}

		this.loadingGoods = false;
	}

	componentDidMount() {
		gstore.api.readNotification(this.props.route.params.id);
		const goods = this.parseInlineIds(this.props.route.params.work.relatedServices);
		const notFound = goods.filter(g => !this.goods.find(t => t.id === g));
		if (notFound.length) {
			this.loadGoods(notFound);
		}

		this.props.navigation.addListener('focus', () => {
			gstore.api.readNotification(this.props.route.params.id);
			const goods = this.parseInlineIds(this.props.route.params.work.relatedServices);
			const notFound = goods.filter(g => !this.goods.find(t => t.id === g));
			if (notFound.length) {
				this.loadGoods(notFound);
			}
		})
	}

	parseInlineIds(raw: string): string[] {
		const data = raw.substring(1, raw.length - 1);
		if (!data) {
			return [];
		} else {
			return data.split('|');
		}
	}

	@autobind
	renderItem(item: IServiceItem) {
		const navigation = this.props.navigation;
		return (
			<TouchableOpacity key={item.id} onPress={() => {
				// this.showModalItem(item);
				//@ts-ignore
				navigation.jumpTo('Services', { openService: item });
			}}>
				<View style={{ flexDirection: 'row', paddingVertical: 18, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
					<View style={{ flexBasis: 100, height: 100, borderRadius: 10, borderWidth: 1, overflow: 'hidden', borderColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', flexGrow: 0, flexShrink: 0, marginRight: 15 }}>
						<Image source={{ uri: gstore.api.fileLink(item.imageId) }} style={{ width: 100, height: 100, resizeMode: 'contain' }}  />
					</View>
					<View style={{ flexGrow: 1, flexShrink: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
						<View><Text style={{ fontSize: 18, fontWeight: 'bold', color: gstore.colorSheme === 'dark' ? 'white' : 'black', }}>{item.title}</Text></View>
						<View style={{ marginBottom: 12, marginTop: 6 }}><Text style={{ fontSize: 12, color: MainMuted }}>Цена: <Text style={{ color: MainHeader, fontWeight: 'bold' }}>{parseFloat(String(item.price || 0)) ? `${parseFloat(String(item.price))} руб.` : '-'}</Text></Text></View>
						<View><Text style={{ color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')}</Text></View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		const { route, navigation } = this.props;
		const item = route.params;
		const title = item.work.name;
		const text = item.work.text;
		const date = item.work.lastSend ? moment(item.work.lastSend).format('DD.MM.YYYY HH:mm') : '-';
		const goods = this.parseInlineIds(item.work.relatedServices);
		const aGoods: IServiceItem[] = goods.map(g => this.goods.find(t => t.id === g)!).filter(g => !!g);
		return (
			<View>
				<View style={{ height: '100%', paddingVertical: 16, paddingHorizontal: 30, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
					<View><Text style={{ fontSize: 18, color: gstore.colorSheme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>{title}</Text></View>
					<View style={{ marginBottom: 12 }}><Text style={{ fontSize: 12, color: MainMuted }}>{date}</Text></View>
					<View><Text style={{ color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{text}</Text></View>
					{goods.length ? (
						<>
							<View style={{ marginTop: 50, marginBottom: 20 }}>
								<Text style={{ fontSize: 18, color: gstore.colorSheme === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>Подходящие товары и услуги</Text>
							</View>
							{this.loadingGoods ? (
								<ActivityIndicator size="large" color={MainLight} />
							) : (
								aGoods.map(g => (
									this.renderItem(g)
								))
							)}
						</>
					) : null}
					<View style={{ marginBottom: 10, marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
						<FButton buttonStyle={{ backgroundColor: '#a00000' }} onPress={() => {
							navigation.goBack();
						}}>Назад</FButton>
					</View>
				</View>
			</View>
		);
	}
}

@observer
class NotificationsList extends PureComponent<{ navigation: IListNavigation }> {

	@observable notifications: IRNotification[] = [];
	@observable loading = true;

	async componentDidMount() {
		const res = await gstore.api.getNotifications();
		if (res.result) {
			this.notifications = res.data;
		}

		this.loading = false;

		this.props.navigation.addListener('focus', async () => {
			this.loading = true;
			const res2 = await gstore.api.getNotifications();
			if (res2.result) {
				this.notifications = res2.data;
			}
			this.loading = false;
		})
	}

	@autobind
	renderItem({ item }: { item: IRNotification }) {
		const navigation = this.props.navigation;
		const title = item.work.name || '-';
		const text = item.work.pushText || '-';
		const date = item.work.lastSend ? moment(item.work.lastSend).format('DD.MM.YYYY HH:mm') : '-';
		return (
			<TouchableOpacity
				// delayPressIn={100}
				onPress={() => {
					navigation.push('NotEntity', item);
					const g = this.notifications.find(n => n.id === item.id);
					if (g) {
						g.isRead = true;
					}
				}}
			>
				<View style={{ opacity: item.isRead ? 0.9 : 1, paddingVertical: 18, paddingHorizontal: 20, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
					<View><Text style={{ fontSize: 18, fontWeight: 'bold', color: gstore.colorSheme === 'dark' ? 'white' : 'black', }}>{title}</Text></View>
					<View style={{ marginBottom: 12 }}><Text style={{ fontSize: 12, color: MainMuted }}>{date}</Text></View>
					<View><Text style={{ color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{text}</Text></View>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		const sortedNots = this.notifications.slice();

		sortedNots.sort((a, b) => {
			if (a.isRead === b.isRead) {
				const a1 = a.work.lastSend ? moment(a.work.lastSend).unix() : 0;
				const b1 = b.work.lastSend ? moment(b.work.lastSend).unix() : 0;
				return b1 - a1;
			} else {
				return Number(a.isRead) - Number(b.isRead);
			}
		});

		return (
			<View>
				{this.loading ? (
					<ActivityIndicator color={MainLight} size="large" style={{ marginTop: 50 }} />
				) : (
					sortedNots.length ? (
						<ScrollView style={{height: '100%', backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white'}}>
							{sortedNots.map(item => this.renderItem({ item }))}
						</ScrollView>
					) : (
						<FlatText text="Здесь будут отображаться уведомления от администрации сервиса. В данный момент новых уведомлений нет." />
					)
				)}
			</View>
		);
	}
}

class NotificationsScreen extends PureComponent {
	render() {
		return (
			<Stack.Navigator>
				<Stack.Screen component={NotificationsList} name="NotList" options={{ headerShown: false, title: 'Уведомления' }} />
				<Stack.Screen component={Notification} name="NotEntity" options={({ route }) => ({ headerShown: false, title: (route.params as any).title })} />
			</Stack.Navigator>
		);
	}
}

export default NotificationsScreen;
