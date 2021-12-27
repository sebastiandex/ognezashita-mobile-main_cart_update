/* eslint-disable prettier/prettier */
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { autobind } from "core-decorators";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import React, { PureComponent } from "react";
import {
	Text,
	View,
	ListRenderItemInfo,
	Image,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	TextInput,
	TouchableHighlight
} from "react-native";
import {MainBackground, MainHeader, MainLight, MainMuted, MainOrange, MainText} from "../colors";
import AmountSelector from "../controls/AmountSelector";
import FRadio from "../controls/FRadio";
import { IServiceItem } from "../network/api";
import gstore from "../stores/gstore";
import { FlatList } from "react-native-gesture-handler";
import _ from 'lodash';
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();

type RootStackParamList = {
	ServiceList: undefined;
	ServiceEntity: { title: string, description: string, date: string };
};

type IListNavigation = StackNavigationProp<RootStackParamList, 'ServiceList'>;

interface IServiceCategory {
	id: any;
	title: string;
	data: IServiceItem[];
}

@observer
class ItemModal extends PureComponent<{ item: IServiceItem, onCart: (amount: number) => void, }> {

	@observable amount = 1;

	render() {
		const { item, onCart } = this.props;

		const desc = item.description;

		return (
			<ScrollView style={{ left: 0, top: 0, right: 0, bottom: 0, zIndex: 10, position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} contentContainerStyle={{ flexGrow: 1, flexShrink: 0, flexDirection: 'column', padding: 15, alignItems: 'stretch', justifyContent: 'center' }}>
				<View style={{ flexGrow: 1, flexShrink: 0, alignItems: 'stretch', justifyContent: 'center' }}>
					<View style={{ alignItems: 'stretch', padding: 20, borderRadius: 18, backgroundColor: MainBackground }}>
						<View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 10, top: 10, zIndex: 30 }}>
							<TouchableOpacity onPress={() => {
								gstore.setGlobalModal(null);
							}}>
								<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
									{/*<Text style={{ fontWeight: '600', fontSize: 16 }}>&lt;</Text>*/}
									<Icon style={{fontWeight: '100', marginTop: 2}} name={'chevron-left'} size={15}/>
									<Text style={{ fontWeight: '600', fontSize: 16, marginLeft: 5 }}>Назад</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ alignItems: 'center', justifyContent: 'center', flexBasis: '100%', flexGrow: 0, flexShrink: 0, marginBottom: 15, marginTop: 30, borderRadius: 8 }}>
							<Image source={{ uri: gstore.api.fileLink(item.imageId) }} style={{ width: '100%', height: 220, borderRadius: 8, resizeMode: 'cover'}} />
						</View>
						<View style={{ flexGrow: 1, flexShrink: 1 }}>
							<View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
								<Text style={{ textAlign: 'left', fontSize: 20, fontWeight: '600', color: MainHeader, }}>{item.title}</Text>
							</View>

							<View style={{ marginTop: 40 }}>
								{desc.split("\n").map((t, idx) => (
									<Text key={idx} style={{ fontSize: 14, fontWeight: '400', color: '#575757', marginBottom: 10 }}>
										{t}
									</Text>
								))}
							</View>
							<View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>

								<AmountSelector value={this.amount} onValue={a => this.amount = a} />
								{parseFloat(String(item.price || 0)) ? (
									<View style={{marginRight: -30 }}>
											<Text style={{ fontSize: 18, fontWeight: '600', color: MainText }}>
												{parseFloat(String(item.price || 0)) ? `${parseFloat(String(item.price))}₽` : '-'}
											</Text>
									</View>) : null}
								{/*<FButton style={{ marginTop: 30, marginBottom: 10 }} onPress={() => {*/}
								{/*	onCart(this.amount);*/}
								{/*}}>В корзину</FButton>*/}
								<TouchableHighlight onPress={() => {
									onCart(this.amount);
								}}>
									<View style={{backgroundColor: '#2A5EE4', width: 72, height: 36, borderRadius: 8, justifyContent: "center"}}>
										<Image
											style={{ resizeMode: 'contain', justifyContent: 'center', alignSelf: 'center' }}
											source={require('./../../assets/cartIcon.png')}
										/>
									</View>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

@observer
class CartModal extends PureComponent<{ item: IServiceItem, amount: number, price: number }> {

	@observable selectedIdx = 0;
	@observable newAddress = '';

	render() {
		const { item, amount } = this.props;
		return (
			<ScrollView
				style={{
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					zIndex: 10,
					position: 'absolute',
					backgroundColor: 'rgba(0, 0, 0, 0.5)'
				}}
				contentContainerStyle={{ flexGrow: 1, flexShrink: 0, flexDirection: 'column', padding: 15, alignItems: 'stretch', justifyContent: 'center' }}>
				<View style={{ flexGrow: 1, flexShrink: 0, alignItems: 'stretch', justifyContent: 'center' }}>
					<View style={{ alignItems: 'stretch', padding: 20, borderRadius: 20, backgroundColor: MainBackground }}>
						<View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 10, top: 10, zIndex: 30 }}>
							<TouchableOpacity onPress={() => {
								gstore.setGlobalModal(null);
							}}>
								<View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginLeft: 10, marginTop: 5 }}>
									{/*<Text style={{ fontWeight: '600', fontSize: 16 }}>&lt;</Text>*/}
									<Icon style={{fontWeight: '100', marginTop: 2}} name={'chevron-left'} size={15}/>
									<Text style={{ fontWeight: '600', fontSize: 16, marginLeft: 5 }}>Назад</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ flexGrow: 1, flexShrink: 1 }}>
							<Text style={{ fontSize: 14, fontWeight: '400', color: '#949494', marginTop: 40 }}>Название:</Text>
							<Text style={{ fontSize: 16, fontWeight: '600', color: MainText, marginBottom: 5 }}>{item.title}</Text>
							<Text style={{ fontSize: 14, fontWeight: '400', color: '#949494', marginTop: 10 }}>Количество:</Text>
							<Text style={{ fontSize: 16, fontWeight: '600', color: MainText}}>{amount}</Text>
							<View style={{marginTop: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}/>
							<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainHeader, marginBottom: 15 }}>Адрес самовывоза:</Text>
							{gstore.selfAddresses.map((address, idx) => (
								<FRadio
									text={`${address}`}
									selected={this.selectedIdx === idx}
									onPress={() => this.selectedIdx = idx}
								/>
							))}
							<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainHeader, marginBottom: 15 }}>Адрес доставки</Text>
							{gstore.places.map((place, idx) => (
								<FRadio
									text={`${place.name}, ${place.address}`}
									selected={this.selectedIdx === gstore.selfAddresses.length + idx}
									onPress={() => this.selectedIdx = gstore.selfAddresses.length + idx}
								/>
							))}
							{gstore.savedAddresses.map((address, idx) => (
								<FRadio
									text={`${address}`}
									selected={this.selectedIdx === gstore.selfAddresses.length + gstore.places.length + idx}
									onPress={() => this.selectedIdx = gstore.selfAddresses.length + gstore.places.length + idx}
								/>
							))}
							<FRadio
								style={{ marginTop: 7 }}
								cmp={<TextInput
									value={this.newAddress}
									onChangeText={newText => this.newAddress = newText}
									onFocus={() => this.selectedIdx = -1}
									style={{ height: 34, width: '90%', padding: 10, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#E3E3E3', borderRadius: 8 }}
									placeholder={"Добавить новый адрес"}
									placeholderTextColor={'#949494'}
								/>}
								selected={this.selectedIdx === -1}
								onPress={() => this.selectedIdx = -1}
							/>
							<View style={{marginTop: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E5E5'}}/>
							<View style={{ marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
								<TouchableHighlight onPress={() => {
									let address;
									let placeId = null;
									if (this.selectedIdx === -1) {
										address = this.newAddress;
									} else
									if (this.selectedIdx < gstore.selfAddresses.length) {
										address = gstore.selfAddresses[this.selectedIdx];
									} else
									if (this.selectedIdx - gstore.selfAddresses.length < gstore.places.length) {
										address = gstore.places[this.selectedIdx - gstore.selfAddresses.length].address;
										placeId = gstore.places[this.selectedIdx - gstore.selfAddresses.length].id;
									} else {
										address = gstore.savedAddresses[this.selectedIdx - gstore.places.length - gstore.selfAddresses.length];
									}
									gstore.cart.push({
										itemId: item.id,
										itemTitle: item.title,
										itemImageId: item.imageId,
										amount: amount,
										isService: item.isService,
										price: item.price,
										category: item.category,
										address,
										placeId,
									});
									gstore.setGlobalModal(null);
								}}>
									<View style={{backgroundColor: '#2A5EE4', width: 72, height: 36, borderRadius: 8, justifyContent: "center"}}>
										<Image
											style={{ resizeMode: 'contain', justifyContent: 'center', alignSelf: 'center' }}
											source={require('./../../assets/cartIcon.png')}
										/>
									</View>
								</TouchableHighlight>
								{/*<FButton style={{ marginTop: 30, marginBottom: 10 }} onPress={() => {*/}
								{/*	let address;*/}
								{/*	let placeId = null;*/}
								{/*	if (this.selectedIdx === -1) {*/}
								{/*		address = this.newAddress;*/}
								{/*	} else*/}
								{/*		if (this.selectedIdx < gstore.selfAddresses.length) {*/}
								{/*			address = gstore.selfAddresses[this.selectedIdx];*/}
								{/*		} else*/}
								{/*			if (this.selectedIdx - gstore.selfAddresses.length < gstore.places.length) {*/}
								{/*				address = gstore.places[this.selectedIdx - gstore.selfAddresses.length].address;*/}
								{/*				placeId = gstore.places[this.selectedIdx - gstore.selfAddresses.length].id;*/}
								{/*			} else {*/}
								{/*				address = gstore.savedAddresses[this.selectedIdx - gstore.places.length - gstore.selfAddresses.length];*/}
								{/*			}*/}
								{/*	gstore.cart.push({*/}
								{/*		itemId: item.id,*/}
								{/*		itemTitle: item.title,*/}
								{/*		itemImageId: item.imageId,*/}
								{/*		amount: amount,*/}
								{/*		isService: item.isService,*/}
								{/*		price: item.price,*/}
								{/*		category: item.category,*/}
								{/*		address,*/}
								{/*		placeId,*/}
								{/*	});*/}
								{/*	gstore.setGlobalModal(null);*/}
								{/*}}>В корзину</FButton>*/}
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}

@observer
class ServicesList extends PureComponent<{ navigation: IListNavigation, route: any, openedCategories: any }> {

	constructor(props: { navigation: IListNavigation; route: any; openedCategories: any } | Readonly<{ navigation: IListNavigation; route: any; openedCategories: any }>) {
		super(props);
		this.state = { openedCategories: [] };
		this.showHideCategory = this.showHideCategory.bind(this);
	}

	showHideCategory(element: { id: string }) {
		const data = _.clone(this.state.openedCategories);
		const index = _.findIndex(data, function (o) { return o === element });
		if (index === -1) {
			data.push(element)
		} else {
			data.splice(index, 1)
		}
		this.setState({ openedCategories: data })
	};
	@observable error = '';
	@observable loading = true;
	@observable type: 'services' | 'goods' = 'goods';

	@observable selectedItem: IServiceItem | null = null;

	@observable amount = 1;

	@observable rawGoods: IServiceItem[] = [];
	@observable rawServices: IServiceItem[] = [];

	@computed get goods() {
		return this.mapCategories(this.rawGoods.filter(t => t.title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || t.description.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())))
	}

	@computed get services() {
		return this.mapCategories(this.rawServices.filter(t => t.title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) || t.description.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())))
	}

	mapCategories(data: IServiceItem[]): { data: IServiceItem[]; title: string }[] {
		const cats = data.map(d => d.category || '').filter((e, i, a) => a.indexOf(e) === i);
		return cats.map(cat => ({
			title: cat || 'Без категории',
			data: data.filter(d => d.category === cat)
		})).sort((a, b) => {
			return (b.title === 'Без категории' ? 0 : 1) - (a.title === 'Без категории' ? 0 : 1);
		});
	}

	async componentDidMount() {
		const data = await gstore.api.listServices();

		if (data.result) {
			this.rawGoods = data.data.filter(d => !d.isService);
			this.rawServices = data.data.filter(d => d.isService);

			this.selectedItem = this.goods[0].data[0];
		} else {
			this.error = data.error;
		}

		this.loading = false;

		if (this.props.route.params?.openService) {
			this.showModalItem(this.props.route.params?.openService);
		}

		this.props.navigation.addListener('focus', () => {
			if (this.props.route.params?.openService) {
				this.showModalItem(this.props.route.params?.openService);
			}
		});
	}

	showModalItem(item: IServiceItem) {
		this.selectedItem = item;
		gstore.setGlobalModal(this.renderModal());
	}

	@autobind
	handleCart(amount: number) {
		const item = this.selectedItem;
		if (!item) {
			return;
		}

		gstore.setGlobalModal(this.renderAddToCartModal(item, amount));
	}

	renderAddToCartModal(item: IServiceItem, amount: number, price: number) {
		return (<CartModal item={item} amount={amount}  price={price}/>)
	}

	renderModal() {
		if (!this.selectedItem) {
			return null;
		}

		return (<ItemModal item={this.selectedItem} onCart={this.handleCart} />);
	}

	@computed get list() {
		return this.type === 'services' ? this.services : this.goods;
	}

	@autobind

	// renderItem(item: { data: object; id: string, category: string, title: string }) {
	renderItem({ item, index }: ListRenderItemInfo<any>) {
		// const navigation = this.props.navigation;
		console.log(11111111111, item)
		return (
			<View key={index} style={{ paddingHorizontal: 20, paddingTop: 5, paddingBottom: 15, backgroundColor: 'white' }}>
				<TouchableOpacity
					key={index}
					onPress={() => this.showHideCategory(item.title)}
				>
					<View style={{flexDirection: 'row', height: 50, justifyContent: 'space-between', borderBottomColor: '#E5E5E5',
						borderBottomWidth: _.findIndex(this.state.openedCategories, function (o) { return o === item.title }) !== -1 ? 0 : 1}}>
					<Text style={{ fontSize: 24, fontWeight: '600', color: MainHeader }}>
						{item.title}
					</Text>
						<Image
							style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 5, marginRight: 5 }}
							source={
								_.findIndex(this.state.openedCategories, function (o) { return o === item.title }) !== -1 ?
									require('./../../assets/crossIcon.png') : require('./../../assets/plusIcon.png')
							}
						/>
					</View>
					{/* <Image source={require('./../../src/more_	')} style={{ width: 100, height: 100, resizeMode: 'contain' }} /> */}


				</TouchableOpacity>
				{_.findIndex(this.state.openedCategories, function (o) { return o === item.title }) !== -1 ? (
					item.data.map((item: any) => {
						{
							return (

									<View style={{ flexDirection: 'row', marginHorizontal: 0, paddingVertical: 18, backgroundColor: MainBackground, borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
										<TouchableOpacity style={{flexDirection: 'row', width: '80%'}} key={item.id} onPress={() => {
											this.showModalItem(item);
											// navigation.push('ServiceEntity', { title: item.key, description: item.description, date: item.date });
										}}>
										<View style={{ flexBasis: 72, height: 72, borderRadius: 18, borderWidth: 1, overflow: 'hidden', borderColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', flexGrow: 0, flexShrink: 0, marginRight: 15 }}>
											<Image source={{ uri: gstore.api.fileLink(item.imageId) }} style={{ width: 72, height: 72, resizeMode: 'contain' }} />
										</View>
										<View style={{ flexGrow: 1, flexShrink: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
											<View style={{width: '80%'}}>
												<Text style={{ fontSize: 14, fontWeight: '400', color: '#949494' }}>Наклейка</Text>
												<Text style={{ fontSize: 14, fontWeight: '400', color: MainHeader, }}>{item.title}</Text>
											</View>

											{/*<View><Text style={{ color: MainText }}>{item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')}</Text></View>*/}
										</View>
										</TouchableOpacity>
										<View style={{ marginBottom: 12}}>
											<Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', color: MainMuted, justifyContent: 'center' }}><Text style={{ color: MainHeader, fontWeight: 'bold' }}>
												{parseFloat(String(item.price || 0)) ? `${parseFloat(String(item.price))}₽` : '-'}</Text>
											</Text>
											<TouchableHighlight onPress={() => {
													this.handleCart(1);
											}}>
												<View style={{backgroundColor: '#2A5EE4', width: 72, height: 36, borderRadius: 8, marginTop: 10, justifyContent: "center"}}>
													<Image
														style={{ resizeMode: 'contain', justifyContent: 'center', alignSelf: 'center' }}
														source={require('./../../assets/cartIcon.png')}
													/>
												</View>
											</TouchableHighlight>
										</View>
									</View>

							);
						}
					})
				) : null}
			</View>
		);
	}

	@observable search = '';

	render() {
		return (
			<View style={{ backgroundColor: MainBackground, flexGrow: 1, }}>
				<View style={{ width: '100%', paddingTop: 15, paddingBottom: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', elevation: 4 }}>
					<View style={{ flexDirection: 'row', width: '90%', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#d0d0d0', alignItems: 'stretch', justifyContent: 'center', height: 40, }}>
						<TouchableOpacity style={{ flexGrow: 1, flexShrink: 1, alignItems: 'stretch', justifyContent: 'center' }} onPress={() => this.type = 'goods'}>
							<View style={{
								flexGrow: 1,
								flexShrink: 1,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: this.type !== 'goods' ? 'white' : MainOrange,
								borderRightWidth: 1, borderRightColor: '#d0d0d0',
								borderRadius: 8
							}}>
								<Text style={{color: this.type !== 'goods' ? MainText : 'white'}}>Товары</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity disabled style={{ flexGrow: 1, flexShrink: 1, alignItems: 'stretch', justifyContent: 'center' }} onPress={() => this.type = 'services'}>
							<View style={{
								flexGrow: 1,
								flexShrink: 1,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: this.type !== 'services' ? '#f0f0f0' : 'MainOrange'
							}}>
								<Text>Товары от партнёров</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ flexGrow: 1, flexShrink: 1, alignItems: 'stretch', justifyContent: 'center' }} onPress={() => this.type = 'services'}>
							<View style={{
								flexGrow: 1,
								flexShrink: 1,
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: this.type !== 'services' ? 'white' : MainOrange
							}}>
								<Text style={{color: this.type !== 'services' ? MainText : 'white'}}>Услуги</Text>
							</View>
						</TouchableOpacity>

					</View>
					<View style={{
						marginTop: 10,
						width: '90%',
					}}>
						<TextInput
							value={this.search}
							onChangeText={e => { this.search = e }}
							placeholder="Запрос для поиска..."
							style={{
								borderWidth: 1,
								borderColor: '#e0e0e0',
								borderRadius: 3,
								height: 36,
								width: '100%',
								paddingHorizontal: 10,
								paddingVertical: 2
							}}
						/>
					</View>
				</View>
				{this.loading ? <ActivityIndicator style={{ marginTop: 50 }} size="large" color={MainLight} /> : (
					// <Accordion
					// 	activeSections={[0]}
					// 	sections={this.list}
					// 	// renderSectionTitle={() => this.renderItem}
					// 	keyExtractor={(section, index) => section.id + index}
					// 	renderHeader={(section) => (
					// 	<View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10, backgroundColor: 'white' }}>
					// 		<Text style={{ fontSize: 26, fontWeight: 'bold', color: MainHeader }}>{section.title}</Text>

					// 	</View>
					// 	)}
					// 	renderContent={(section) => this.renderItem(section)}
					// 	// onChange={this._updateSections}
					// />
					<FlatList
						data={this.list}
						// extraData={this.state.openedCategories}
						renderItem={this.renderItem}
						keyExtractor={(item) => item.id}
					// keyExtractor={(item, index) => item.id + index}
					/>
					// <SectionList
					// 	sections={this.list}
					// 	keyExtractor={(item, index) => item.id + index}
					// 	renderItem={this.renderItem}
					// 	renderSectionHeader={({ section: { title } }) => (
					// 	<View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10, backgroundColor: 'white' }}>
					// 		<Text style={{ fontSize: 26, fontWeight: 'bold', color: MainHeader }}>{title}</Text>
					// 	</View>
					// 	)}
					// />
				)}
			</View>
		);
	}
}

class ServicesScreen extends PureComponent {
	render() {
		return (
			<Stack.Navigator>
				<Stack.Screen
					component={ServicesList}
					name="ServiceList"
					options={{ headerShown: false, title: 'Товары и услуги' }}
				/>
			</Stack.Navigator>
		);
	}
}

export default ServicesList;
