import {observer} from "mobx-react";
import React, {PureComponent} from "react";
import {ActivityIndicator, Image, ScrollView} from "react-native";
import {TouchableOpacity} from "react-native";
import {Text, View} from "react-native";
import {
    MainLight,
    createdColor,
    doneColor,
    cancelledColor
} from "../colors";

import moment from 'moment';
import _ from 'lodash';
import gstore, {stateDesc} from "../stores/gstore";
import {observable} from "mobx";
import {IOrdersListNavigation, IOrdersListRoute} from "./OrderRouterScreen";
import FButton from "../controls/FButton";
import {TextInput} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { createFilter } from 'react-native-search-filter';

const searchStyle = {
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: gstore.colorSheme === 'dark' ? '#2B2B2B' : '#E5E5E5',
        width: '90%',
        marginLeft: '4%',
        marginTop: 10,
        borderTop: 1,
        borderRadius: 8
    },
    searchIcon: {
        marginLeft: -30,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        color: '#A3A3A3',
            backgroundColor: gstore.colorSheme === 'dark' ? '#2B2B2B' : '#E5E5E5',
            borderColor: '#e0e0e0',
            borderRadius: 8,
            height: 36,
            width: '90%',
            paddingHorizontal: 10,
            paddingVertical: 2
    }
}

@observer
class OrdersScreen extends PureComponent<{ mode: 'default' | 'new' | 'mine' | 'execs' | 'finished', navigation: IOrdersListNavigation, route: IOrdersListRoute }> {
    constructor(props: { searchValue: string } ) {
        super(props);
        this.state = { searchValue: '' };
        // this.showHideCategory = this.showHideCategory.bind(this);
    }
    @observable orders = gstore.orders;
    @observable loading = true;
    @observable search = '';

    dispose: any = null;

    componentWillUnmount() {
        if (this.dispose) {
            this.dispose();
            this.dispose = null;
        }
    }

    async onLoad() {
        const {mode} = this.props;

        this.loading = true;

        if (mode === 'default') {
            if (gstore.me!.role === 'executor') {
                await gstore.init();
                this.orders = gstore.orders.filter(m => m.activeExecutor?.id === gstore.me!.id);
            } else if (gstore.me!.role === 'admin') {
                const res = await gstore.api.getOrders('default', this.search);
                if (res.result) {
                    this.orders = res.data;
                } else {
                    this.orders = [];
                }
            } else {
                await gstore.init();
                this.orders = gstore.orders;
            }
        } else if (mode === 'new') {
            const res = await gstore.api.getOrders('new', this.search);
            if (res.result) {
                this.orders = res.data;
                gstore.newOrdersCount = this.orders.length;
            } else {
                this.orders = [];
            }
        } else if (mode === 'execs') {
            const res = await gstore.api.getOrders('execs', this.search);
            if (res.result) {
                this.orders = res.data;
            } else {
                this.orders = [];
            }
        } else if (mode === 'finished') {
            const res = await gstore.api.getOrders('finished', this.search);
            if (res.result) {
                this.orders = res.data;
            } else {
                this.orders = [];
            }
        } else if (mode === 'mine') {
            this.orders = gstore.orders.filter(m => m.createdByUser!.id === gstore.me!.id)
        }

        this.loading = false;
    }

    async componentDidMount() {
        await this.onLoad();

        this.dispose = this.props.navigation.addListener('focus', async (e: any) => {
            await this.onLoad();
        })
    }

    render() {
        const {mode} = this.props;

        const states = ['created', 'executing', 'done', 'cancelled'];
        let ods;
        if (gstore.me?.role === 'admin') {
            ods = _.sortBy(this.orders.slice(), 'createdAt');
            ods.reverse()
        } else {
            ods = this.orders.slice();
            ods.sort((a, b) => {
                const ai = states.indexOf(a.state);
                const bi = states.indexOf(b.state);
                return ai - bi;
            });
        }
        const statusColor = (status: any) => {
            switch (status) {
                case "?????????? ??????????????????????":
                    return createdColor;
                case "?? ???????????????? ????????????????????":
                    return gstore.colorSheme === 'dark' ? 'white' : 'black';
                case "??????????????????":
                    return doneColor;
                case "????????????????":
                    return cancelledColor
                default:
                    return gstore.colorSheme === 'dark' ? 'white' : 'black';
            }
        }

        const getPlaceImage = async (placeID: string) => {
                const pRes = await gstore.api.getPlace(placeID)
                if (pRes.result) {
                    return pRes.data.mainPhotoId
                } else {
                    return;
                }
        }
        const KEYS_TO_FILTERS = ['title', 'description'];

        const filteredOds = ods.filter(createFilter(this.state.searchValue, KEYS_TO_FILTERS))
        const searchUpdated = (term: string) => {
            this.setState({ searchValue: term })
        }
        return (
            <View style={{flexGrow: 1, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',}}>
                {/*{(gstore.me!.role === 'admin' && this.props.mode !== 'mine') ? (*/}
                {/*    <View style={{*/}
                {/*        paddingLeft: '6%',*/}
                {/*        paddingRight: '6%',*/}
                {/*        marginTop: 20,*/}
                {/*    }}>*/}

                {/*        <TextInput*/}
                {/*            value={this.search}*/}
                {/*            onChangeText={e => {*/}
                {/*                this.search = e;*/}
                {/*                this.onLoad();*/}
                {/*            }}*/}
                {/*            placeholder="???????????? ?????? ????????????..."*/}
                {/*            style={{*/}
                {/*                borderWidth: 1,*/}
                {/*                borderColor: '#e0e0e0',*/}
                {/*                borderRadius: 3,*/}
                {/*                height: 36,*/}
                {/*                paddingHorizontal: 10,*/}
                {/*                paddingVertical: 2*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*) : null}*/}
                {this.loading ?
                    <View style={{flexGrow: 1}}>
                        <ActivityIndicator
                            color={MainLight}
                            style={{marginTop: 40}}
                            size="large"
                        />
                    </View> : (
                        <>
                        <View style={searchStyle.searchSection}>

                            <TextInput
                                value={this.state.searchValue}
                                placeholderTextColor={'#A3A3A3'}
                                onChangeText={e => {
                                    searchUpdated( e)
                                }}
                                placeholder="??????????"
                                // style={{
                                //     color: 'black',
                                //     backgroundColor: '#E5E5E5',
                                //     borderColor: '#e0e0e0',
                                //     borderRadius: 8,
                                //     height: 36,
                                //     width: '100%',
                                //     paddingHorizontal: 10,
                                //     paddingVertical: 2
                                // }}
                                style={searchStyle.input}
                            >

                            </TextInput>
                            <Icon style={searchStyle.searchIcon} name="search" size={20} color="#A3A3A3"/>
                        </View>
                        <ScrollView style={{
                            // paddingLeft: '6%',
                            // paddingRight: '6%',
                            marginTop: 10,
                            paddingTop: 0,
                            flexGrow: 1,
                            marginBottom: 20
                        }}>

                            {ods.length ? (
                                // _.sortBy(users, [function(o) { return o.user; }]);
                                _.sortBy(filteredOds, 'createdAt').reverse().map((ord, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => {
                                        gstore.selectedOrderId = ord.id;
                                        this.props.navigation.navigate('Order', {orderId: ord.id});
                                    }}>
                                        <View style={{
                                            flexDirection: 'column',
                                            borderBottomColor: '#e0e0e0',
                                            borderBottomWidth: 1
                                        }}>
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{marginTop: 20, marginRight: 20, marginLeft: 15}}>
                                                    {ord.content.cart && ord.content.cart[0] && ord.content.cart[0].placeId ? (
                                                        <Image
                                                            source={{uri: gstore.api.fileLink(ord.createdByUser.photoId)}}
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                resizeMode: 'contain',
                                                                borderRadius: 18
                                                            }}
                                                        />
                                                    ) : (
                                                        <Image
                                                            source={{uri: gstore.api.fileLink(ord.createdByUser.photoId)}}
                                                            style={{
                                                                width: 70,
                                                                height: 70,
                                                                resizeMode: 'contain',
                                                                borderRadius: 18
                                                            }}
                                                        />
                                                    )}
                                                </View>

                                                <View style={{
                                                    // opacity: (ord.state === 'cancelled' || ord.state === 'done') ? 0.5 : 1,
                                                    paddingVertical: 18, backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white', width: '70%'
                                                }}>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: 16,
                                                            fontWeight: 'bold',
                                                            color: gstore.colorSheme === 'dark' ? 'white' : 'black'
                                                        }}
                                                        >
                                                            {ord.title}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            fontWeight: 'normal',
                                                            color: gstore.colorSheme === 'dark' ? '#949494' : '#575757'
                                                        }}
                                                        >
                                                            {ord.content.description}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginLeft: 105,
                                                marginRight: 20,
                                                marginBottom: 25
                                            }}>
                                                <Text style={{
                                                    fontSize: 15,
                                                    color: statusColor(stateDesc[ord.state])
                                                }}>{stateDesc[ord.state]}</Text>
                                                <View style={{marginLeft: 10}}><Text style={{
                                                    fontSize: 14,
                                                    color: '#949494'
                                                }}>{moment(ord.createdAt).format('DD.MM.YYYY')}</Text></View>
                                            </View>
                                        </View>

                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 50,
                                    width: '90%',
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{textAlign: 'center', fontSize: 16, color: '#606060', lineHeight: 26}}>
                                        {
                                            this.search ? '???????????? ???? ??????????????' :
                                                gstore.me!.role === 'user' ? '?????????? ?????????? ???????????????????????? ???????? ????????????.\n\n?????? ???????????????? ????????????, ?????????????????? ?? ?????????????? ?? ?????????????? ?? ???????????????? ?????????? ??????????.' : (
                                                    mode === 'new' ? '?????????? ?????????? ???????????????????????? ?????????? ????????????, ?? ?????????????? ???? ???????????? ?????????? ????????????????????????.' :
                                                        (
                                                            mode === 'mine' ? '?????????? ?????????? ???????????????????????? ?????????????????? ???????? ????????????.' :
                                                                (mode === 'execs' ? '?????????? ?????????? ???????????????????????? ???????????? ???? ???????????????????????? ?? ?????????????? ??????????????????????????.' : (
                                                                    mode === 'finished' ? '?????????? ?????????? ???????????????????????? ?????????????? ?????????????????????? ????????????.' :
                                                                        '?????????? ?????????? ???????????????????????? ????????????, ???? ?????????????? ???? ?? ???????????? ???????????? ???????????????????? ????????????.'
                                                                ))
                                                        )
                                                )
                                        }
                                    </Text>
                                </View>
                            )}
                            {gstore.me!.role === 'user' ? (
                                <View style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 40,
                                    marginBottom: 20
                                }}>
                                    <FButton onPress={() => {
                                        //@ts-ignore
                                        this.props.navigation.jumpTo('Services');
                                    }}>?????????????? ?? ?????????????? ?? ??????????????</FButton>
                                </View>
                            ) : (
                                (mode === 'new') ? (
                                    null
                                ) : (
                                    (mode === 'mine') ? (
                                        <View style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 20,
                                            marginBottom: 20
                                        }}>
                                            {/*<FButton onPress={() => {*/}
                                            {/*    //@ts-ignore*/}
                                            {/*    this.props.navigation.jumpTo('Cart');*/}
                                            {/*}}>?????????????? ???????????? ??????????????????????????</FButton>*/}
                                        </View>
                                    ) : null
                                )
                            )}
                        </ScrollView>
                        </>
                    )}
            </View>
        );
    }
}

export default OrdersScreen;
