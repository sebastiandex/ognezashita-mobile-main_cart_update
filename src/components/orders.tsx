import {observer} from "mobx-react";
import React, {PureComponent, useState} from "react";
import {ActivityIndicator, Image, ScrollView} from "react-native";
import {TouchableOpacity} from "react-native";
import {Text, View} from "react-native";
import {
    MainLight,
    MainBackground,
    MainMuted,
    MainHeader,
    MainText,
    createdColor,
    executingColor,
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
import SearchInput, { createFilter } from 'react-native-search-filter';

const searchStyle = {
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '90%',
        marginLeft: '4%',
        marginTop: 10,
        borderTop: 1
    },
    searchIcon: {
        marginLeft: -30,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: 'black',
        backgroundColor: '#E5E5E5',
        borderColor: '#e0e0e0',
        borderRadius: 8,
        height: 36,
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 2
    }
}

@observer
class orders extends PureComponent<{ mode: 'default' | 'new' | 'mine' | 'execs' | 'finished', navigation: IOrdersListNavigation, route: IOrdersListRoute }> {
    constructor(props: { searchValue: string } ) {
        super(props);
        this.state = { searchValue: '' };
    }
    @observable orders = gstore.orders;
    @observable loading = true;
    @observable search = '';

    dispose: any = null;

    render() {
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
                case "Поиск исполнителя":
                    return createdColor;
                case "В процессе выполнения":
                    return executingColor;
                case "Завершена":
                    return doneColor;
                case "Отменена":
                    return cancelledColor
                default:
                    return MainText;
            }
        }

        const getPlaceImage = async (placeID: string) => {
            const pRes = await gstore.api.getPlace(placeID)
            if (pRes.result) {
                console.log('PLACE_RESULT22222', pRes.data.mainPhotoId);
                return pRes.data.mainPhotoId
            } else {
                console.log(423642378467823642384284)
                return;
            }
        }
        console.log('ODS', ods)
        const KEYS_TO_FILTERS = ['title', 'description'];

        const filteredOds = ods.filter(createFilter(this.state.searchValue, KEYS_TO_FILTERS))
        const searchUpdated = (term: string) => {
            this.setState({ searchValue: term })
        }

        return (
            <>

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
                                                        paddingVertical: 18, backgroundColor: MainBackground, width: '70%'
                                                    }}>
                                                        <View>
                                                            <Text style={{
                                                                fontSize: 16,
                                                                fontWeight: 'bold',
                                                                color: MainHeader
                                                            }}
                                                            >
                                                                {ord.title}
                                                            </Text>
                                                        </View>
                                                        <View>
                                                            <Text style={{
                                                                fontSize: 14,
                                                                fontWeight: 'normal',
                                                                color: '#A3A3A3'
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
                                    )
                    )})
            </View>
        );
    }
}

export default orders;
