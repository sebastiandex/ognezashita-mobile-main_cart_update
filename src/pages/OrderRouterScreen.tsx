import React, { PureComponent } from "react";

import { RouteProp } from '@react-navigation/native';

import OrdersScreen from "./OrdersScreen";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import ClientOrderScreen from "./ClientOrderScreen";
import { IOrderRouterNavigation } from "./MainScreen";

type RootStackParamList = {
	OrdersList: undefined;
	Order: { orderId: string };
};

export type IOrderRoute = RouteProp<RootStackParamList, 'Order'>;
export type IOrderNavigation = StackNavigationProp<RootStackParamList, 'Order'>;

export type IOrdersListRoute = RouteProp<RootStackParamList, 'OrdersList'>;
export type IOrdersListNavigation = StackNavigationProp<RootStackParamList, 'OrdersList'>;

const Stack = createStackNavigator();
const Nav = Stack.Navigator;

interface IOrderRouterScreenProps {
	mode: 'default' | 'mine' | 'new' | 'execs';
	navigation: IOrderRouterNavigation;
	route: { params: any };
}

class OrderRouterScreen extends PureComponent<IOrderRouterScreenProps> {
	
	WrappedOrdersScreen: any;
	dispose: null | (() => void) = null;
	nav: IOrdersListNavigation | null = null;

	constructor(props: IOrderRouterScreenProps) {
		super(props);

		this.WrappedOrdersScreen = ({ ...p }: any) => <OrdersScreen mode={props.mode} {...p} />;

		this.dispose = props.navigation.addListener('blur', () => {
			if (this.nav) {
				this.nav.reset({
					index: 0,
					routes: [{
						name: 'OrdersList',
					}]
				});
			}
		});
	}

	componentWillUnmount() {
		if (this.dispose) {
			this.dispose();
			this.dispose = null;
		}
	}

	render() {
		return (
			<Nav
				initialRouteName="OrdersList"
				screenOptions={({ navigation }) => {
					this.nav = navigation;
					return { headerShown: false };
				}}
			>
				<Stack.Screen name="OrdersList" component={this.WrappedOrdersScreen} options={{ title: 'Заявки' }} />
				<Stack.Screen name="Order" component={ClientOrderScreen} options={{ title: 'Заявка' }} />
			</Nav>
		);
	}
}

export default OrderRouterScreen;
