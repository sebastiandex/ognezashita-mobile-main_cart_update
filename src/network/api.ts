/* eslint-disable prettier/prettier */
import querystring from 'querystring';
import { ICartItem, IFullUser, IOrder, IPlace } from '../stores/gstore';

export interface IServiceItem {
	id: string;
	isService: boolean;
	category: string | null;
	title: string;
	description: string;
	imageId: string | null;
	price: number;
}

export interface ISimpleQueryActionResult {
	id: string;
	text: string;
	payload?: any;
}

export interface IOrderData {
	id: string;
	title: string;
	content: { type: 'cart', cart: ICartItem[], description: string };
	state: 'created' | 'executing' | 'done' | 'cancelled';
	tags: string;
	report: null | { text: string; imageIds: string[] };
	activeExecutorId: string | null;
	activeExecutor: null | {
		id: string;
		name: string;
		photoId: string | null;
		phone: string;
	};
	createdByUserId: string;
	createdByUser: null | {
		id: string;
		name: string;
		photoId: string | null;
		phone: string;
	};
}

type IResponse<T> = {
	result: false,
	error: string,
	data?: T
} | {
	result: true,
	data: T
};

const verbose = true;

class API {

	host: string;

	constructor(host: string) {
		this.host = host;
	}

	get<T extends {}>(url: string, qs?: Record<string, string>): Promise<T> {
		if (verbose) {
			console.log('GET ' + this.host + url);
			console.log('Query: ', qs);
		}
		return fetch(this.host + url + (qs ? ('?' + querystring.stringify(qs)) : ''), {
			method: 'GET',
			credentials: 'include',
		}).then(response => {
			return response.json() as unknown as T;
		}).then(data => {
			if (verbose) {
				console.log('Received: ', JSON.stringify(data, null, "\t"));
			}
			return data;
		}).catch(err => {
			console.log('network err: ', err);
			throw err;
		});
	}

	post<T extends {}>(url: string, data?: FormData | Record<string, any>, qs?: Record<string, string>): Promise<T> {
		if (verbose) {
			console.log('POST ' + this.host + url);
			console.log('Data: ', data);
			console.log('Query: ', qs);
		}
		const headers: any = {};
		const opts: any = {
			method: 'POST',
			credentials: 'include',
		};
		if (data) {
			if (data instanceof FormData) {
				opts.body = data;
			} else {
				headers['Content-Type'] = 'application/json';
				opts.body = JSON.stringify(data)
			}
		}
		opts.headers = headers;
		return fetch(this.host + url + (qs ? ('?' + querystring.stringify(qs)) : ''), opts).then(response => {
			return response.json() as unknown as T;
		}).then(data => {
			if (verbose) {
				console.log('Received: ', JSON.stringify(data, null, "\t"));
			}
			return data;
		});
	}

	async search(entityType: string, entityId: string | null, query: string, extras?: any) {
		return await this.post<IResponse<ISimpleQueryActionResult[]>>('/search/', { entityType, entityId, query, extras });
	}

	async getOrder(id: string) {
		return await this.get<IResponse<IOrderData & { newState?: { state: 'created' | 'executing' | 'done' | 'cancelled' }}>>('/order/get', { id });
	}

	async getPlace(id: string) {
		return await this.get<IResponse<IPlace>>('/place/get', { id });
	}

	async cancelOrder(id: string) {
		return await this.post<IResponse<boolean>>('/order/cancel', { id });
	}

	async changeOrder(id: string, payload: { activeExecutorId?: string | null, state?: 'created' | 'executing' | 'done' | 'cancelled' }) {
		return await this.post<IResponse<boolean>>('/order/edit', { id, ...payload });
	}

	async acceptOrder(id: string) {
		return await this.post<IResponse<boolean>>('/order/accept', { id });
	}

	async declineOrder(id: string) {
		return await this.post<IResponse<boolean>>('/order/decline', { id });
	}

	async finishOrder(id: string, reportText: string, reportImageIds: string[]) {
		return await this.post<IResponse<boolean>>('/order/finish', { id, reportText, reportImageIds });
	}

	async updateUser(id: string, data: Partial<IFullUser & { password: string }>) {
		return await this.post<IResponse<any>>('/user/edit', { id, ...data });
	}

	async updateSavedAddresses(id: string, addresses: string[]) {
		return await this.updateUser(id, { savedAddresses: addresses });
	}

	async me() {
		return await this.get<IResponse<{ id: string, email: string, role: string, name: string, } | null>>('/auth/me');
	}

	async getNotifications() {
		return await this.get<IResponse<any>>('/auth/notifications');
	}

	async readNotification(id: string) {
		return await this.post<IResponse<void>>('/auth/notificationsRead', { id });
	}

	async initClient() {
		return await this.get<IResponse<any>>('/auth/initClient');
	}

	async getNewOrders() {
		return await this.get<IResponse<{ newOrdersCount: number, ordersInWorkCount: number }>>('/auth/getNewOrders');
	}

	async getAdminData() {
		return await this.get<IResponse<{ ordersInWorkCount: number, ordersWaitingAnswerCount: number, ordersFromExecutorsCount: number }>>('/auth/getAdminData');
	}

	async updateDeviceToken(token: string) {
		return await this.post<IResponse<void>>('/auth/saveToken', { token });
	}

	async login(email: string, password: string) {
		return await this.post<IResponse<void>>('/auth/login', { email, password });
	}

	async log(text: string) {
		return await this.post<IResponse<void>>('/auth/log', { text });
	}

	async register(email: string, password: string) {
		return await this.post<IResponse<void>>('/auth/register', { email, password, role: 'user' });
	}

	async forgot(email: string) {
		return await this.post<IResponse<void>>('/auth/forgot', { email });
	}

	async recover(email: string, code: string, newPassword: string) {
		return await this.post<IResponse<void>>('/auth/recover', { email, code, newPassword });
	}

	async logout() {
		return await this.post<IResponse<void>>('/auth/logout', { });
	}

	async addOrder(order: Omit<IOrder, 'id'>) {
		return await this.post<IResponse<void>>('/order/', order);
	}

	async getOrders(mode: string, search: string) {
		return await this.get<IResponse<IOrder[]>>('/order/', { mode, search });
	}

	async listServices(ids?: string[]) {
		return await this.get<IResponse<IServiceItem[]>>('/service/', { ids: ids ? ids.join(',') : '' });
	}

	async uploadFile(entityType: 'order' | 'place' | 'user' | 'service' | 'license', entityId: string, file: any) {
		const fd = new FormData;
		fd.append('entityType', entityType);
		fd.append('entityId', entityId);
		fd.append('file', file);
		return await this.post<IResponse<{ id: string }>>('/file/', fd);
	}

	fileLink(id: string | null) {
		if (!id) {
			return '';
		}

		if (id.startsWith('http')) {
			return id;
		}

		return this.host + '/files/' + id;
	}

}

export default API;