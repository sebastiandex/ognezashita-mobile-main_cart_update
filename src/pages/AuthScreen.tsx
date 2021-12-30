import React, { PureComponent } from "react";
import { Dimensions, Text, View, TouchableOpacity } from "react-native";

import { observable } from "mobx";
import { observer } from "mobx-react";

import { autobind } from "core-decorators";
import Animated, { Easing } from "react-native-reanimated";

import Centroid from "../controls/Centroid";
import FButton from "../controls/FButton";
import FInput from "../controls/FInput";
import gstore from "../stores/gstore";

@observer
class AuthScreen extends PureComponent {

	@observable loading = false;

	@observable error: string = '';
	@observable email: string = '';
	@observable password: string = '';

	@observable codeSent = false;
	@observable code = '';

	@observable type: 'login' | 'register' | 'forgot' = 'login';

	@autobind
	async handleLogin() {
		this.error = '';
		this.loading = true;

		let e = this.email;
		// if (e === 'admin@a.ru') {
		// 	e = '2admin@a.ru';
		// }

		try {
			const loginResult = await gstore.api.login(e, this.password);

			if (loginResult.result) {
				this.loading = false;
				Animated.timing(this.test4, {
					toValue: 0,
					duration: 500,
					easing: Easing.ease
				}).start(() => {
					Animated.timing(this.test3, {
						toValue: -Dimensions.get('window').width / 2,
						duration: 700,
						easing: Easing.ease
					}).start(async () => {
						await gstore.init();
					});
				});
				return;
			} else {
				if (loginResult.error === 'USER_NOT_FOUND') {
					this.error = 'Неправильный пароль или пользователь';
				} else {
					this.error = 'Ошибка сервера';
				}
			}
		} catch (err) {
			this.error = 'Сервер недоступен. Попробуйте ещё раз.';
		}

		this.loading = false;
	}

	@autobind
	async handleRegister() {
		this.error = '';
		this.loading = true;

		try {
			const registerResult = await gstore.api.register(this.email, this.password);

			if (registerResult.result) {
				this.loading = false;
				Animated.timing(this.test4, {
					toValue: 0,
					duration: 500,
					easing: Easing.ease
				}).start(() => {
					Animated.timing(this.test3, {
						toValue: -Dimensions.get('window').width / 2,
						duration: 700,
						easing: Easing.ease
					}).start(async () => {
						await gstore.init();
					});
				});
				return;
			} else {
				if (registerResult.error === 'USER_NOT_FOUND') {
					this.error = 'Пользователь не найден';
				} else {
					this.error = 'Ошибка сервера';
				}
			}
		} catch (err) {
			this.error = 'Сервер недоступен. Попробуйте ещё раз.';
		}

		this.loading = false;
	}

	@autobind
	async handleForgot() {
		this.error = '';
		this.loading = true;

		try {
			let result;
			if (this.codeSent) {
				result = await gstore.api.recover(this.email, this.code, this.password);
			} else {
				result = await gstore.api.forgot(this.email);
			}
			if (result.result) {
				this.loading = false;
				if (!this.codeSent) {
					this.codeSent = true;
				} else {
					this.codeSent = false;
					this.type = 'login';
				}
				return;
			} else {
				if (result.error === 'USER_NOT_FOUND') {
					this.error = 'Пользователь не найден';
				} else
				if (result.error === 'WRONG_RECOVERY_CODE') {
					this.error = 'Неправильный код';
				} else
				if (result.error === 'EXPIRED_RECOVERY_CODE') {
					this.error = 'Срок действия кода истёк';
				} else {
					this.error = 'Ошибка сервера';
				}
			}
		} catch (err) {
			this.error = 'Сервер недоступен. Попробуйте ещё раз.';
		}

		this.loading = false;
	}

	test = new Animated.Value(0);
	test2 = new Animated.Value(0);
	test3 = new Animated.Value(0);
	test4 = new Animated.Value(1);

	componentDidMount() {
		Animated.timing(this.test, {
			toValue: 1,
			duration: 1000,
			easing: Easing.bounce
		}).start(() => {
			setTimeout(() => {
				Animated.timing(this.test2, {
					toValue: 1,
					duration: 500,
					easing: Easing.ease
				}).start(() => {

				});
			}, 500);
		});
	}

	render() {
		return (
			<Centroid style={{ backgroundColor: 'white' }}>
				<Animated.View style={{ zIndex: 2, position: 'absolute', backgroundColor: '#312D2C', left: this.test3, width: '50%', top: 0, bottom: 0 }} />
				<Animated.View style={{ zIndex: 2, position: 'absolute', backgroundColor: '#312D2C', right: this.test3, width: '50%', top: 0, bottom: 0 }} />
				<Animated.View style={{ zIndex: 3, paddingLeft: '10%', paddingRight: '10%', alignItems: 'stretch', opacity: this.test4 }}>
					<View style={{ alignItems: 'center', height: 260, marginBottom: 60 }}>
						<View style={{ position: 'relative', marginBottom: 15, width: 1, height: 221 }}>
							<Animated.Image
								source={require('../left.png')}
								style={{
									position: 'absolute',
									top: 0,
									left: Animated.interpolate(this.test, {
										inputRange: [0, 1],
										outputRange: [-200, -100],
									}),
									width: 100, // 458
									height: 220, // 1006
									resizeMode: 'contain'
								}}
							/>
							<Animated.Image
								source={require('../right.png')}
								style={{
									position: 'absolute',
									top: 0,
									left: Animated.interpolate(this.test, {
										inputRange: [0, 1],
										outputRange: [100, 0],
									}),
									width: 100,
									height: 220,
									resizeMode: 'contain'
								}}
							/>
							<Animated.Image
								source={require('../title.png')}
								style={{
									position: 'absolute',
									top: 70,
									opacity: Animated.interpolate(this.test2, {
										inputRange: [0, 1],
										outputRange: [0, 1],
									}),
									left: 0,
									marginLeft: -100,
									width: 200,
									height: 50,
									resizeMode: 'contain'
								}}
							/>
						</View>
						<View style={{ marginTop: 40 }}>
							<Text style={{ fontSize: 14, color: 'white' }}>{this.type === 'login' ? 'Авторизуйтесь для доступа к услугам' : (this.type === 'register' ? 'Укажите данные для регистрации' : 'Введите данные для восстановления пароля')}</Text>
						</View>
					</View>
					{this.error ? (
						<View style={{ marginBottom: 20 }}>
							<Text style={{ color: 'red', textAlign: 'center' }}>{this.error}</Text>
						</View>
					) : null}
					<View style={{ marginBottom: 10 }}>
						<FInput style={{ width: '100%', backgroundColor: '#202020', color: 'white', borderWidth: 1, borderColor: '#404040' }} placeholderTextColor="white" value={this.email} onChangeText={(val: string) => this.email = val} placeholder="Email" />
					</View>
					{(this.type === 'forgot' && this.codeSent) ? (
						<View style={{ marginBottom: 10 }}>
							<FInput style={{ width: '100%', backgroundColor: '#202020', color: 'white', borderWidth: 1, borderColor: '#404040' }} placeholderTextColor="white" value={this.code} onChangeText={(val: string) => this.code = val} placeholder="Код из письма" />
						</View>
					) : null}
					{(this.type !== 'forgot' || this.codeSent) ? (
						<View style={{ marginBottom: -10 }}>
							<FInput style={{ width: '100%', backgroundColor: '#202020', color: 'white', borderWidth: 1, borderColor: '#404040' }} placeholderTextColor="white" value={this.password} onChangeText={(val: string) => this.password = val} secureTextEntry={true} placeholder={this.type === 'forgot' ? 'Новый пароль' : 'Пароль'} />
						</View>
					) : null}
					<View style={{ marginBottom: 50 }}>
						{this.type === 'login' ? (
							<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
								this.type = 'forgot';
							}}>
								<View style={{ marginTop: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
									<Text style={{ color: '#a0a0a0', borderBottomColor: '#a0a0a0', borderBottomWidth: 1, fontSize: 12 }}>Восстановить пароль</Text>
								</View>
							</TouchableOpacity>
						) : null}
					</View>
					<View style={{ marginBottom: 20 }}>
						<FButton loading={this.loading} onPress={this.type === 'login' ? this.handleLogin : (this.type === 'forgot' ? this.handleForgot : this.handleRegister)}>
							{this.type === 'login' ? 'Войти' : (this.type === 'forgot' ? (this.codeSent ? 'Сохранить пароль' : 'Выслать код') : 'Зарегистрироваться')}
						</FButton>
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
						<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => {
							this.codeSent = false;
							if (this.type === 'login') {
								this.type = 'register';
							} else {
								this.type = 'login';
							}
						}}>
							<View style={{ marginTop: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
								<Text style={{ color: '#a0a0a0', borderBottomColor: '#a0a0a0', borderBottomWidth: 1 }}>{this.type === 'login' ? 'Зарегистрироваться' : 'Авторизоваться'}</Text>
							</View>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</Centroid>
		);
	}
}

export default AuthScreen;
