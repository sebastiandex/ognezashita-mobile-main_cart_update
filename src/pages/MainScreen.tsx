/* eslint-disable prettier/prettier */
import React, {PureComponent, useContext} from "react";
import { Text, View, TouchableOpacity, TextStyle, Image } from "react-native";

import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createDrawerNavigator, DrawerNavigationProp, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';

import gstore from "../stores/gstore";
import HomeScreen from "./HomeScreen";
import PlacesScreen from "./PlacesScreen";
import NotificationsScreen from "./NotificationsScreen";
import ProfileScreen from "./ProfileScreen";
import {
	MainOrange,
	IconGrey
} from "../colors";
import ServicesScreen from "./ServicesScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomIcon from "../CustomIcon";
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
			<>

			<TouchableOpacity onPress={() => {
				if (gstore.cart.length) {
					this.props.navigation.jumpTo('Cart');
				}
			}}>
				<View style={{ marginRight: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
					{gstore.cart.length ? (
						<View style={{ zIndex: 9999, position: "absolute", right: -8, top: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#E73838', alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>{gstore.cart.length}</Text>
						</View>
					) : null}
					<Icon name="shopping-cart" size={24} color={gstore.colorSheme === 'dark' ? '#FFFFFF' : 'rgba(40, 40, 40, 0.4)'} />

					{/*<Icon name="shopping-cart" size={24} color={gstore.cart.length ? '#A3A3A3' : '#d0d0d0'} />*/}
				</View>
			</TouchableOpacity>
			</>
		);
	}
}

function DrawerContent(props: DrawerContentComponentProps<DrawerContentOptions>) {

	const { state, navigation, descriptors } = props;
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
		<DrawerContentScrollView {...props} style={{ width: 280, flexGrow: 1, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white' }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
			<View style={{ marginLeft: 0 }}>
				<Image
					source={gstore.colorSheme === 'dark' ? require('./../assets/mainLogo.png') : require('./../assets/mainLogoLight.png')}
					style={{ resizeMode: 'contain', marginTop: 60, marginLeft: 5, marginBottom: 40, height: 60, width: 240 }}
				/>
				<DrawerItemList {...props} state={newState} descriptors={newDescriptors} activeBackgroundColor={'transparent'} />
				{gstore.me!.role === 'admin' ? (
					<DrawerItem
						icon={({ focused }) => <Image
							source={focused ? require('./../../assets/licenses_active.png') : require('./../../assets/licenses.png')}
							style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -15 }}
						/>}
						// icon={({ focused }) => <Icon style={{ marginRight: -20 }} color={focused ? MainOrange : IconGrey} size={24} name={'home'} />}
						label="????????????????"
						focused={descriptors[licenseKey].navigation.isFocused()}
						onPress={() => navigation.jumpTo('License')}
						activeBackgroundColor={'transparent'}
						activeTintColor={MainOrange}
						inactiveTintColor={gstore.colorSheme === 'dark' ? 'white' : 'black'}
					/>
				) : null}
			</View>
			<View style={{ marginBottom: 20 }}>
				{gstore.me!.role !== 'admin' ? (
					// <View style={{ display: 'flex' }}>
					// 	<Icon name="home" size={24} color={gstore.cart.length ? 'black' : '#d0d0d0'} />

					<DrawerItem
						icon={({ focused }) => <Image
							source={focused ? require('./../../assets/licenses_active.png') : require('./../../assets/licenses.png')}
							style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -15 }}
						/>}
						// icon={({ focused}) => <Icon style={{ marginRight: -20 }} color={focused ? MainOrange : IconGrey} size={24} name={'home'} />}
						label="????????????????"
						focused={descriptors[licenseKey].navigation.isFocused()}
						onPress={() => navigation.jumpTo('License')}
						activeBackgroundColor={'transparent'}
						activeTintColor={MainOrange}
						inactiveTintColor={gstore.colorSheme === 'dark' ? 'white' : 'black'}
						labelStyle={{ fontSize: 15 }}
					/>
					// </View>
				) : null}
				<DrawerItem
					icon={({ focused }) =>
						<Image
						source={focused ? require('../../assets/connect_us_active.png') : require('../../assets/connect_us.png')}
						style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -15 }}
					/>}
					// icon={({ focused }) => <Icon style={{ marginRight: -20 }} color={focused ? MainOrange : IconGrey} size={24} name={'home'} />}
					label="?????????????????? ?? ????????"
					focused={descriptors[contactKey].navigation.isFocused()}
					onPress={() => navigation.jumpTo('Contact')}
					activeBackgroundColor={'transparent'}
					activeTintColor={MainOrange}
					inactiveTintColor={gstore.colorSheme === 'dark' ? 'white' : 'black'}
					labelStyle={{ fontSize: 15 }}
				/>
			</View>
		</DrawerContentScrollView>
	);
}

@observer
class DrawerLabelBadge extends PureComponent<({ focused: boolean, color: TextStyle['color'], text: string, count: number | (() => number) })> {
	render() {
		const { text, count, focused } = this.props;

		const c = typeof count === 'function' ? count() : count;
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
				{/* <Icon color={IconGrey} size={24} name={'home'} /> */}
				<Text style={{ color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black', marginRight: 10 }}>{text}</Text>
				{c ? (
					<View style={{
						backgroundColor: '#c00000',
						borderRadius: 12,
						height: 24,
						width: 24,
						alignItems: 'center',
						justifyContent: 'center'
						// marginRight: -30,
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

	menuItemRenderer = ({ route }) => {
		return (
			<Text>{route.params.post}</Text>
		)
	}

	render() {
		return (

			<Animated.View style={{ zIndex: 0, flexGrow: 1, opacity: this.test, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', width: '100%', height: '100%' }}>

				<NavigationContainer>

					<Drawer.Navigator

						initialRouteName="Home"
						screenOptions={({ navigation }) => {
							return {
								headerShown: true,
								backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
								headerTintColor: gstore.colorSheme === 'dark' ? 'white' : 'black',
								headerStyle: {
									backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
									// backgroundColor: 'MainBackgroundLight',
									borderBottomColor: 'white',
									elevation: 4,
								},
								bottomStyle: {
									backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
								},
								headerRight: gstore.me!.role === 'user' ? (() => (
									<HeaderRight navigation={navigation} />
								)) : void 0,
							};
						}}
						drawerContent={DrawerContent}
					>

						{/* <Image
							source={mainLogo}
							style={{
								width: 196,
								height: 196,
								resizeMode: 'cover'
							}}
						/> */}

						{/* <Icon name="shopping-cart" size={24} color={gstore.cart.length ? 'black' : '#d0d0d0'} /> */}
						<Drawer.Screen name="Home" component={HomeScreen} options={{
							title: '??????????????',
							drawerLabel: ({ focused }) => (
								<Text style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>??????????????</Text>
							),
							drawerIcon: ({ focused }) => (
								// <Icon color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
							<Image
							source={focused ? require('../../assets/home_active.png') : require('../../assets/home.png')}
							style={{ resizeMode: 'contain', height: 20, width: 20 }}
							/>
							)
						}} />

						{gstore.me!.role === 'user' ? (
							<>
								<Drawer.Screen
									name="Notifications"
									component={NotificationsScreen}
									options={{
										title: '??????????????????????', drawerLabel: ({ focused, color }) => (
											<View style={{
												display: 'flex', flex: 1,
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginLeft: -20
											}}
											>
												<DrawerLabelBadge
													color={color}
													focused={focused}
													text="??????????????????????"
													count={() => gstore.unreadNotifications.length}
												/>
											</View>
										),
										drawerIcon: ({ focused }) => (
											<Image
												source={focused ? require('./../../assets/notifications_active.png') : require('./../../assets/notifications.png')}
												style={{ resizeMode: 'contain', height: 20, width: 20 }}
											/>
										)
									}}
								/>
								<Drawer.Screen
									name="Services"
									component={ServicesScreen}
									options={{
										title: '???????????? ?? ????????????',
										drawerLabel: ({ focused }) => (
											<Text
												style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}
											>
												???????????? ?? ????????????
											</Text>
										),
										drawerIcon: ({ focused }) => (
											<Image
												source={focused ? require('./../../assets/goodsAndServices_active.png') : require('./../../assets/goodsAndServices.png')}
												style={{ resizeMode: 'contain', height: 20, width: 20 }}
											/>
										)
									}} />
								<Drawer.Screen
									name="Places"
									component={PlacesScreen}
									options={{
										title: '?????? ??????????????',
										drawerLabel: ({ focused }) => (
											<Text
												style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}
											>
												?????? ??????????????
											</Text>
										),
										drawerIcon: ({ focused }) => (
											<Image
												source={focused ? require('./../../assets/myobjects_active.png') : require('./../../assets/myobjects.png')}
												style={{ resizeMode: 'contain', height: 20, width: 20 }}
											/>
										)
									}}
								/>
							</>
						) : null}
						<Drawer.Screen
							name="OrderRouter"
							component={ActiveOrdersScreen}
							options={{
								title: gstore.me!.role === 'user' ? '?????? ????????????' : '???????????? ?? ????????????',
								drawerLabel: ({ focused }) => (
									<View style={{ marginLeft: -20 }}>
										{/* <Text
											style={{ color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}
										>{gstore.me!.role === 'user' ? '?????? ????????????' : '???????????? ?? ????????????'}
										</Text> */}
										<DrawerLabelBadge
											focused={focused}
											color={focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black'}
											text={gstore.me!.role === 'user' ? '?????? ????????????' : '???????????? ?? ????????????'}
											count={() => gstore.ordersInWorkCount}
										/>
									</View>
								),
								drawerIcon: ({ focused }) => (
									// <Icon color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
								<Image
								source={focused ? require('../../assets/orders_inwork_active.png') : require('../../assets/orders_inwork.png')}
								style={{ resizeMode: 'contain', height: 20, width: 20 }}
								/>
								)
								// drawerIcon: ({ focused }) => (
								// 	<Icon color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
								// )
								// drawerLabel: gstore.me!.role === 'executor' ? (({ color }) => (
								// 	<DrawerLabelBadge color={MainWhite} text={gstore.me!.role === 'user' ? '?????? ????????????' : '???????????? ?? ????????????'} count={() => gstore.ordersInWorkCount} color={color} />
								// )) : void 0
							}}
						/>
						{gstore.me!.role === 'executor' ? (
							<>
								<Drawer.Screen name="NewOrderRouter" component={NewOrdersScreen} options={{
									title: '?????????? ????????????', drawerLabel: ({ color, focused }) => (
										<DrawerLabelBadge focused={focused} text="?????????? ????????????" count={() => gstore.newOrdersCount} color={color} />
									),
									drawerIcon: ({ focused }) => (
										// <Icon style={{ marginRight: -20 }} color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
										<Image
											source={focused ? require('../../assets/myorders_active.png') : require('../../assets/myorders.png')}
											style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -20 }}
										/>
									)
								}} />
								<Drawer.Screen name="MyOrderRouter" component={MineOrdersScreen} options={{
									title: '?????????????????? ???????? ????????????',
									drawerLabel: ({ focused }) => (
										<Text style={{ marginLeft: -20, justifyContent: 'flex-start', color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>?????????????????? ???????? ????????????</Text>
									),
									drawerIcon: ({ focused }) => (
										<Image
											source={focused ? require('../../assets/myorders_active.png') : require('../../assets/myorders.png')}
											style={{ resizeMode: 'contain', height: 20, width: 20 }}
										/>
									)
								}} />
							</>
						) : null}
						{gstore.me!.role === 'admin' ? (
							<>
								<Drawer.Screen name="NewOrderRouter" component={NewOrdersScreen} options={{
									title: '???????????? ?? ????????????????', drawerLabel: ({ color, focused }) => (
										<DrawerLabelBadge focused={focused} text="?????????? ????????????" count={() => gstore.newOrdersCount} color={color} />
									),
									drawerIcon: ({ focused }) => (
										<Image
											source={focused ? require('../../assets/myorders_active.png') : require('../../assets/myorders.png')}
											style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -15 }}
										/>
									)
								}} />
								<Drawer.Screen name="ExecsOrderRouter" component={ExecsOrdersScreen} options={{
									title: '???????????? ???? ????????????????????????',
									drawerLabel: ({ focused }) => (
										<Text style={{ marginLeft: -20, justifyContent: 'flex-start', color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>???????????? ???? ????????????????????????</Text>
									),
									drawerIcon: ({ focused }) => (
										// <Icon color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
										<Image
											source={focused ? require('../../assets/myobjects_active.png') : require('../../assets/myobjects.png')}
											style={{ resizeMode: 'contain', height: 20, width: 20 }}
										/>
									),
								}} />
								<Drawer.Screen name="FinishedOrderRouter" component={FinishedOrdersScreen} options={{
									title: '?????????????????????? ????????????',
									drawerLabel: ({ focused }) => (
										<Text style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>?????????????????????? ????????????</Text>
									),
									drawerIcon: ({ focused }) => (
										<Image
											source={focused ? require('../../assets/closed_orders_active.png') : require('../../assets/closed_orders.png')}
											style={{ resizeMode: 'contain', height: 24, width: 24, marginLeft: -2 }}
										/>
									),
								}} />
							</>
						) : (
							<Drawer.Screen name="Cart" component={CartScreen} options={{
								title: gstore.me!.role === 'user' ? '??????????????' : '?????????????? ????????????',
								drawerLabel: gstore.me!.role === 'user' ? ({ focused, color }) => (
									<DrawerLabelBadge text="??????????????" focused={focused} color={color} count={() => gstore.cart.length} />
								) : ({ focused }) => (
									<Text style={{ color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>?????????????? ????????????</Text>
								),
								drawerIcon: ({ focused }) => (
									<Image
										source={focused ? require('../../assets/cart_active.png') : require('../../assets/cart.png')}
										style={{ resizeMode: 'contain', height: 20, width: 20, marginRight: -18, marginLeft: -1 }}
									/>
								),
							}} />
						)}

						<Drawer.Screen name="Profile" component={ProfileScreen} options={{
							title: '??????????????',
							drawerLabel: ({ focused }) => (
								<Text style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>??????????????</Text>
							),
							drawerIcon: ({ focused }) => (
								<Image
									source={focused ? require('../../assets/profile_active.png') : require('../../assets/profile.png')}
									style={{ resizeMode: 'contain', height: 20, width: 20 }}
								/>
							),
						}} />
						<Drawer.Screen name="License" component={LicenseScreen} options={{
							title: '????????????????',
							drawerLabel: ({ focused }) => (
								<Text style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}>????????????????</Text>
							),
							drawerIcon: ({ focused }) => (
								<Image
									source={focused ? require('../../assets/licenses_active.png') : require('../../assets/licenses.png')}
									style={{ resizeMode: 'contain', height: 20, width: 20 }}
								/>
							)
						}} />
						<Drawer.Screen name="Contact" component={ContactScreen} options={{
							title: '????????????????',
							drawerLabel: ({ focused }) => (
								<Text
									style={{ marginLeft: -20, color: focused ? MainOrange : gstore.colorSheme === 'dark' ? 'white' : 'black' }}
								>
									?????????????????? ?? ????????
								</Text>
							),
							drawerIcon: ({ focused }) => (
								<Icon color={focused ? MainOrange : IconGrey} size={24} name={'home'} />
							)
						}} />
					</Drawer.Navigator>
				</NavigationContainer>
			</Animated.View>
		);
	}
}

export default MainScreen;
