import { computed, observable, reaction } from "mobx";
import { ReactNode } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import API from "../network/api";
import { Alert } from "react-native";

export interface ICartItem {
	itemId: string;
	itemTitle: string;
	itemImageId: string | null;
	amount: number;
	address: string;
	placeId: string | null;
}

export interface ISimpleUser {
	id: string;
	name: string;
	photoId: string | null;
}

export interface IOrder {
	id: string;
	title: string;
	content: any;
	state: 'created' | 'executing' | 'done' | 'cancelled';
	activeExecutor?: ISimpleUser | null;
	createdByUser?: ISimpleUser;
	createdAt?: Date;
}

export interface ILicense {
	id: string;
	name: string;
	mainPhotoId: string;
}

export interface IContact {
	id: string;
	name: string;
	type: 'main-phone' | 'phone' | 'email' | 'main-address' | 'self-address';
	value: string;
}

export const contactsDesc: Record<'main-phone' | 'phone' | 'email' | 'main-address' | 'self-address', string> = {
	'main-phone': 'Основной телефон',
	'phone': 'Телефон',
	'email': 'Email',
	'main-address': 'Главный адрес',
	'self-address': 'Адрес самовывоза',
};

export const stateDesc = {
	'created': 'Поиск исполнителя',
	'executing': 'В процессе выполнения',
	'done': 'Завершена',
	'cancelled': 'Отменена',
}

export interface IPlace {
	id: string;
	name: string;
	address: string;
	contacts: string;
	lastCheckDate: string;
	mainPhotoId: string | null;
}

export interface IWork {
	id: string;
	name: string;
	text: string;
	pushText: string;
	relatedServices: string;
	lastSend: Date | null;
}

export interface IRNotification {
	id: string;
	userId: string;
	workId: string;
	isRead: boolean;
	work: IWork;
}

export interface IFullUser {
	id: string;
	role: 'user' | 'executor' | 'admin';
	email: string;
	phone: string;
	passwordHash: string;
	name: string;
	photoId: string | null;
	isActive: boolean;
	tags: string;
	savedAddresses: string[];
	deviceToken: string | null;
}

class GlobalStore {

	api: API = new API('https://admin.rus-ognezashita.ru/api'); // new API('http://64.225.101.7/api'); // new API('http://10.0.2.2/api'); // 

	@observable globalError: string = '';
	@observable me: null | { id: string; email: string; role: string; name: string } = null;

	@observable fullMe: null | IFullUser = null;

	@observable savedAddresses: string[] = [];
	@observable newOrdersCount = 0;

	_globalModal: ReactNode = null;
	@observable globalModalId = 0;

	@observable cart: ICartItem[] = [];
	@observable orders: IOrder[] = [];

	@observable places: IPlace[] = [];
	@observable unreadNotifications: IRNotification[] = [];

	@observable licenses: ILicense[] = [];
	@observable contacts: IContact[] = [];

	@observable notification: any | null = null;

	@observable ordersInWorkCount: number = 0;
	@observable ordersWaitingAnswerCount: number = 0;
	@observable ordersFromExecutorsCount: number = 0;

	selectedOrderId!: string;
	ordersMode: 'default' | 'mine' | 'execs' | 'new' = 'default';

	constructor() {
		this.loadCart();
	}

	@computed get selfAddresses() {
		return this.contacts.filter(c => c.type === 'self-address').map(c => c.value);
	}

	@computed get otherContacts() {
		return this.contacts.filter(c => c.type !== 'self-address');
	}

	@computed get mainPhone() {
		return this.contacts.find(c => c.type === 'main-phone')!.value;
	}

	@computed get activeOrders() {
		return this.orders.filter(o => o.state !== 'cancelled' && o.state !== 'done');
	}

	async updateOrders() {
		const res = await this.api.getOrders('default', '');
		if (res.result) {
			this.orders = res.data;
		}
	}

	async loadCart() {
		const cart = await AsyncStorage.getItem('cart');
		if (cart) {
			this.cart = JSON.parse(cart);
		}
		reaction(() => this.cart.map(c => c), () => {
			this.persistCart();
		})
	}

	@computed get globalModal() {
		if (this.globalModalId > 0) {
			return this._globalModal;
		} else {
			return this._globalModal;
		}
	}

	setGlobalModal(d: any) {
		this._globalModal = d;
		this.globalModalId++;
	}

	async persistCart() {
		await AsyncStorage.setItem('cart', JSON.stringify(this.cart));
	}

	noTimer: any = null;

	async initNewOrdersTimer() {
		const checkNewOrders = async () => {
			const rr = await this.api.getNewOrders();
			if (rr.result) {
				this.newOrdersCount = rr.data.newOrdersCount;
				this.ordersInWorkCount = rr.data.ordersInWorkCount;
			}
		};
		const s = Date.now();
		await checkNewOrders();
		const e = Date.now() - s;
		this.noTimer = setInterval(checkNewOrders, 7 * 1000 + e);
	}

	stopNOTimer() {
		if (this.noTimer) {
			clearInterval(this.noTimer);
			this.noTimer = null;
		}
	}

	async init() {
		try {
			const meResult = await this.api.me();
			if (meResult.result) {
				const initData = await this.api.initClient();
				if (!initData.result) {
					this.me = null;
					this.fullMe = null;
					return this.globalError = 'Server error';
				} else {
					this.licenses = initData.data.licenses;
					this.contacts = initData.data.contacts;
					this.fullMe = initData.data.fullUser;
					this.places = initData.data.places;
					this.orders = initData.data.activeOrders;
					this.unreadNotifications = initData.data.unreadNotifications;
					this.savedAddresses = initData.data.savedAddresses;

					await this.updateOrders();
				}
				this.me = meResult.data;
				if (this.me?.role === 'admin') {
					const tt = await this.api.getAdminData();
					if (tt.result) {
						this.ordersInWorkCount = tt.data.ordersInWorkCount;
						this.ordersWaitingAnswerCount = tt.data.ordersWaitingAnswerCount;
						this.ordersFromExecutorsCount = tt.data.ordersFromExecutorsCount;
					}
				}
				if (this.me?.role !== 'user' && !this.noTimer) {
					await this.initNewOrdersTimer();
				}
			} else {
				this.me = null;
				this.fullMe = null;
				// this.globalError = 'Server error';
			}
		} catch (err: any) {
			Alert.alert(err.message);
			Alert.alert(JSON.stringify(err));
			throw err;
		}
	}

}

const gstore = new GlobalStore();

export default gstore;