/* eslint-disable prettier/prettier */
import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, TextStyle } from "react-native";

import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createDrawerNavigator, DrawerNavigationProp, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';

import gstore from "../stores/gstore";
import HomeScreen from "./HomeScreen";
import PlacesScreen from "./PlacesScreen";
import NotificationsScreen from "./NotificationsScreen";
import ProfileScreen from "./ProfileScreen";
import { MainBackgroundLight, MainHeader } from "../colors";
import ServicesScreen from "./ServicesScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { observer } from "mobx-react";
import CartScreen from "./CartScreen";
import Animated, { Easing } from "react-native-reanimated";
import LicenseScreen from "./LicenseScreen";
import ContactScreen from "./ContactScreen";
import OrderRouterScreen from "./OrderRouterScreen";
import { IServiceItem } from "../network/api";

type RootStackParamList = {
	Notifications: undefined;
	Services: { openService?: IServiceItem };
	Home: undefined;
	OrderRouter: { screen: string, orderId?: string };
};

export type IHomeRoute = RouteProp<RootStackParamList, 'Home'>;
export type IHomeNavigation = DrawerNavigationProp<RootStackParamList, 'Home'>;

export type IOrderRouterNavigation = DrawerNavigationProp<RootStackParamList, 'OrderRouter'>;

const Drawer = createDrawerNavigator();

@observer
class HeaderRight extends PureComponent<{ navigation: any }> {
	render() {
		return (
			<TouchableOpacity onPress={() => {
				if (gstore.cart.length) {
					this.props.navigation.jumpTo('Cart');
				}
			}}>
				<View style={{ marginRight: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
					{gstore.cart.length ? (
						<View style={{ marginRight: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontSize: 12, fontWeight: 'bold', marginTop: -1 }}>{gstore.cart.length}</Text>
						</View>
					) : null}<Icon name="shopping-cart" size={24} color={gstore.cart.length ? 'black' : '#d0d0d0'} />
				</View>
			</TouchableOpacity>
		);
	}
}

function DrawerContent(props: DrawerContentComponentProps<DrawerContentOptions>) {

	const { state, navigation, descriptors, progress } = props;
	const newDescriptors: any = {};
	const newState = {
		...state,
		routes: state.routes.filter(r => !r.key.startsWith('Contact') && !r.key.startsWith('License'))
	}
	let contactKey: string = '';
	let licenseKey: string = '';
	for (let key in descriptors) {
		if (!key.startsWith('Contact') && !key.startsWith('License')) {
			newDescriptors[key] = descriptors[key];
		} else
		if (key.startsWith('Contact')) {
			contactKey = key;
		} else
		if (key.startsWith('License')) {
			licenseKey = key;
		}
	}
	return (
		<DrawerContentScrollView {...props} style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
			<View><DrawerItemList {...props} state={newState} descriptors={newDescriptors} />
			{gstore.me!.role === 'admin' ? (
				<DrawerItem
					label="Лицензии"
					focused={descriptors[licenseKey].navigation.isFocused()}
					onPress={() => navigation.jumpTo('License')}
				/>
			) : null }
			</View>
			<View style={{ marginBottom: 20 }}>
				{gstore.me!.role !== 'admin' ? (
				<DrawerItem
					label="Лицензии"
					focused={descriptors[licenseKey].navigation.isFocused()}
					onPress={() => navigation.jumpTo('License')}
				/>
			) : null }
				<DrawerItem
					label="Связаться с нами"
					focused={descriptors[contactKey].navigation.isFocused()}
					onPress={() => navigation.jumpTo('Contact')}
				/>
			</View>
		</DrawerContentScrollView>
	);
}

@observer
class DrawerLabelBadge extends PureComponent<({ color: TextStyle['color'], text: string, count: number | (() => number) })> {
	render() {
		const { color, text, count } = this.props;

		const c = typeof count === 'function' ? count() : count;
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
				<Text style={{ color }}>{text}</Text>
				{c ? (
					<View style={{
						backgroundColor: '#c00000',
						borderRadius: 12,
						height: 24,
						width: 24,
						alignItems: 'center',
						justifyContent: 'center',
						marginRight: -30,
					}}>
						<Text style={{ color: 'white' }}>{c}</Text>
					</View>
				) : null}
			</View>
		);
	}
}

const WrapOrderScreen = ({ ...baseProps }: any) => ({ ...props }: any) => <OrderRouterScreen {...props} {...baseProps} />;

const ActiveOrdersScreen = WrapOrderScreen({ mode: 'default' });
const NewOrdersScreen = WrapOrderScreen({ mode: 'new' });
const MineOrdersScreen = WrapOrderScreen({ mode: 'mine' });
const ExecsOrdersScreen = WrapOrderScreen({ mode: 'execs' });
const FinishedOrdersScreen = WrapOrderScreen({ mode: 'finished' });

class MainScreen extends PureComponent {
	test = new Animated.Value(0);

	componentDidMount() {
		Animated.timing(this.test, {
			toValue: 1,
			duration: 700,
			easing: Easing.ease,
		}).start();
	}
	
	render() {
		return (
			<Animated.View style={{ zIndex: 0, flexGrow: 1, opacity: this.test, backgroundColor: 'white', width: '100%', height: '100%' }}>
				<NavigationContainer>
					<Drawer.Navigator
						initialRouteName="Home"
						screenOptions={({ navigation }) => {
							return {
								headerShown: true,
								headerTintColor: MainHeader,
								headerStyle: {
									backgroundColor: MainBackgroundLight,
									borderBottomColor: 'white',
									elevation: 4,
								},
								headerRight: gstore.me!.role === 'user' ? (() => (
									<HeaderRight navigation={navigation} />
								)) : void 0,
							};
						}}
						drawerContent={DrawerContent}
					>
						<Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
						{gstore.me!.role === 'user' ? (
							<>
								<Drawer.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Уведомления', drawerLabel: ({ focused, color }) => (
									<DrawerLabelBadge text="Уведомления" color={color} count={() => gstore.unreadNotifications.length} />
								) }} />
								<Drawer.Screen name="Services" component={ServicesScreen} options={{ title: 'Товары и услуги' }} />
								<Drawer.Screen name="Places" component={PlacesScreen} options={{ title: 'Мои объекты' }} />
							</>
						) : null}
						<Drawer.Screen
							name="OrderRouter"
							component={ActiveOrdersScreen}
							options={{
								title: gstore.me!.role === 'user' ? 'Мои заявки' : 'Заявки в работе',
								drawerLabel: gstore.me!.role === 'executor' ? (({ color }) => (
									<DrawerLabelBadge text={gstore.me!.role === 'user' ? 'Мои заявки' : 'Заявки в работе'} count={() => gstore.ordersInWorkCount} color={color} />
								)) : void 0
							}}
						/>
						{gstore.me!.role === 'executor' ? (
							<>
								<Drawer.Screen name="NewOrderRouter" component={NewOrdersScreen} options={{ title: 'Новые заявки', drawerLabel: ({ color }) => (
									<DrawerLabelBadge text="Новые заявки" count={() => gstore.newOrdersCount} color={color} />
								) }} />
								<Drawer.Screen name="MyOrderRouter" component={MineOrdersScreen} options={{ title: 'Созданные мной заявки' }} />
							</>
						) : null}
						{gstore.me!.role === 'admin' ? (
							<>
								<Drawer.Screen name="NewOrderRouter" component={NewOrdersScreen} options={{ title: 'Заявки в ожидании', drawerLabel: ({ color }) => (
									<DrawerLabelBadge text="Новые заявки" count={() => gstore.newOrdersCount} color={color} />
								) }} />
								<Drawer.Screen name="ExecsOrderRouter" component={ExecsOrdersScreen} options={{ title: 'Заявки от исполнителей' }} />
								<Drawer.Screen name="FinishedOrderRouter" component={FinishedOrdersScreen} options={{ title: 'Завершенные заявки' }} />
							</>
						) : (
							<Drawer.Screen name="Cart" component={CartScreen} options={{ title: gstore.me!.role === 'user' ? 'Корзина' : 'Создать заявку', drawerLabel: gstore.me!.role === 'user' ? ({ focused, color }) => (
								<DrawerLabelBadge text="Корзина" color={color} count={() => gstore.cart.length} />
							) : void 0 }} />
						)}

						<Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
						<Drawer.Screen name="License" component={LicenseScreen} options={{ drawerLabel: () => null, title: 'Лицензии' }} />
						<Drawer.Screen name="Contact" component={ContactScreen} options={{ drawerLabel: () => null, title: 'Контакты' }} />
					</Drawer.Navigator>
				</NavigationContainer>
			</Animated.View>
		);
	}
}

export default MainScreen;