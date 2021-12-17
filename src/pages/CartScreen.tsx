import {autobind} from "core-decorators";
import {getObserverTree, observable} from "mobx";
import {observer} from "mobx-react";
import React, {PureComponent} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ListRenderItemInfo, SafeAreaView, ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {MainBackground, MainHeader, MainLight, MainMuted, MainOrange, MainText} from "../colors";
import FButton from "../controls/FButton";
import Section from "../controls/Section";

import gstore, {ICartItem} from "../stores/gstore";

@observer
class CartScreen extends PureComponent<{ navigation: any }> {

    @observable mode: 'cart' | 'order' = gstore.me!.role === 'user' ? 'cart' : 'order';

    dispose: any = null;

    @autobind
    renderItem({item, index}: ListRenderItemInfo<ICartItem>) {
        const navigation = this.props.navigation;
        return (
            <View style={{
                flexDirection: 'row',
                // marginHorizontal: 20,
                paddingVertical: 18,
                paddingHorizontal: 20,
                backgroundColor: MainBackground,
                borderBottomColor: '#e0e0e0',
                borderBottomWidth: 1
            }}>
                <View
                    style={{
                        flexBasis: 72,
                        height: 72,
                        borderRadius: 18,
                        overflow: 'hidden',
                        backgroundColor: '#E4E4E4',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexGrow: 0,
                        flexShrink: 0,
                        marginRight: 15
                    }}>
                    <Image source={{uri: gstore.api.fileLink(item.itemImageId)}}
                           style={{width: 70, height: 70, resizeMode: 'contain'}}/>
                </View>
                <View style={{flexGrow: 1, flexShrink: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <View><Text
                        style={{fontSize: 14, fontWeight: '400', color: MainHeader,}}>{item.itemTitle}</Text></View>

                    <View style={{marginBottom: 18, marginTop: 8}}>
                        <Text
                            style={{fontSize: 14, color: '#585858'}}>Количество: {item.amount}
                        </Text>
                    </View>
                    <View>
                        <Text style={{color: MainOrange}}>Адрес: {item.address}</Text>
                    </View>
                    {/*<View><Text style={{ color: MainText }}>{item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')}</Text></View>*/}
                </View>
                <View style={{
                    flexBasis: 85,
                    // marginLeft: 10,
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    flexShrink: 0,
                    flexGrow: 0
                }}>
                    <TouchableOpacity onPress={() => {
                        gstore.cart.splice(index, 1);
                    }}>

                        <Icon name="times" size={24} color="#c0c0c0"/>

                    </TouchableOpacity>

                    <Text style={{justifyContent: 'flex-end', alignItems: 'flex-end',color: '#585858', fontWeight: '600', fontSize: 18, marginTop: 15, marginLeft: 'auto'}}>
                        {parseFloat(String(item.price || 0)) ? `${parseFloat(String(item.price))}₽` : null}
                        {/*{parseFloat(String(item.price || 0)) ? `999999₽` : null}*/}
                    </Text>
                </View>
            </View>
            // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20, backgroundColor: MainBackground, borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }}>
            // 	<View style={{ flexGrow: 1, flexShrink: 1 }}>
            // 		{/*<View style={{ alignItems: 'center', justifyContent: 'center', flexBasis: 150, flexGrow: 0, flexShrink: 0, marginBottom: 15 }}>*/}
            // 		{/*	<Image source={{ uri: gstore.api.fileLink(item.itemImageId) }} style={{ width: 150, height: 150, borderRadius: 10, resizeMode: 'contain' }} />*/}
            // 		{/*</View>*/}
            // 		<View>
            // 			{/*<Image source={{ uri: item.itemImageId }} style={{ width: 100, height: 100, resizeMode: 'contain' }} />*/}
            // 			<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainHeader, }}>{item.itemTitle}</Text>
            // 		</View>
            // 		<View style={{ marginBottom: 12 }}><Text style={{ fontSize: 12, color: MainMuted }}>Количество: {item.amount}</Text></View>
            // 		<View><Text style={{ color: MainText }}>Адрес: {item.address}</Text></View>
            // 	</View>
            // 	<TouchableOpacity onPress={() => {
            // 		gstore.cart.splice(index, 1);
            // 	}}>
            // 		<View style={{ flexBasis: 20, marginLeft: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0, flexGrow: 0 }}>
            // 			<Icon name="times" size={20} color="#c0c0c0" />
            // 		</View>
            // 	</TouchableOpacity>
            // </View>
        );
    }

    renderCart() {
        console.log('CART_MAP', gstore.cart);
        const goods: ICartItem[] = [];
        const services: ICartItem[] = [];
        gstore.cart.map((item) => {
            if (item.isService) {
                services.push(item)
            } else {
                goods.push(item)
            }
        })
        console.log('goods', goods)
        console.log('services', services)

        return (
            <View style={{backgroundColor: MainBackground}}>
                {gstore.cart.length ? (<>

                    <FlatList
                        data={goods.map(d => d)}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={this.renderItem}
                        ListHeaderComponent={
                            <>
                            <View style={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginTop: 24,
                            marginLeft: 20
                        }}>
                            <Text
                            style={{
                            color: '#282828',
                            fontSize: 24,
                            fontWeight: '600'
                        }}>Инвентарь</Text>
                            </View>
                            </>
                        }
                    />

                    <FlatList
                        data={services.map(d => d)}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={this.renderItem}
                        ListHeaderComponent={<View style={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            marginTop: 24,
                            marginLeft: 20
                        }}>
                            <Text
                                style={{
                                    color: '#282828',
                                    fontSize: 24,
                                    fontWeight: '600'
                                }}>Услуги</Text>
                        </View>}
                    />
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 45}}>
                        <FButton onPress={() => {
                            this.mode = 'order';
                        }} big>Создать заявку</FButton>
                    </View>
                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 0}}>
                        <TouchableOpacity onPress={() => {
                            gstore.cart = [];
                        }}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 5
                            }}>
                                <Text style={{fontWeight: '400', color: '#949494'}}>
                                    Очистить корзину
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>) : (
                    <>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50,
                            width: '70%',
                            alignSelf: 'center'
                        }}>
                            <Text style={{textAlign: 'center', fontSize: 16, color: '#606060', lineHeight: 26}}>Добавьте
                                товары или услуги в корзину для создания заявки.</Text>
                        </View>
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
                            <FButton onPress={() => {
                                this.props.navigation.jumpTo('Services');
                            }}>Перейти к товарам и услугам</FButton>
                        </View>
                    </>
                )}
            </View>

        );
    }

@observable selectedIdx = 0;
@observable title = '';
@observable description = '';

@observable cartLoading = false;

renderOrder() {
    return(

<View style= { {
    backgroundColor: '#f0f0f0'
,
    flexGrow: 1
}
}>
<Section text="Название" contentStyle={{paddingVertical: 10}}>
    <TextInput
        style={{height: 40, width: '100%', paddingVertical: 0}}
        placeholder="Название заявки"
        value={this.title}
        onChangeText={text => this.title = text}
    />
</Section>

<Section text="Описание" contentStyle={{paddingVertical: 10}}>
    <TextInput
        style={{
            height: 100,
            width: '100%',
            paddingVertical: 0,
            paddingTop: 5,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlignVertical: 'top'
        }}
        placeholder="Описание"
        multiline={true}
        value={this.description}
        onChangeText={text => this.description = text}
    />
</Section>

{
    gstore.me!.role === 'user' ? (
        <Section text="Позиции">
            {gstore.cart.map((c, idx) => (
                <View key={idx} style={{marginBottom: 5}}>
                    <Text>{c.amount} x {c.itemTitle}</Text>
                </View>
            ))}
        </Section>
    ) : null
}

<View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
    <FButton
        onPress={async () => {
            // this.mode = 'cart';
            this.cartLoading = true;
            if (gstore.me!.role === 'user') {
                await gstore.api.addOrder({
                    title: this.title,
                    content: {
                        type: 'cart',
                        cart: gstore.cart,
                        description: this.description,
                    },
                    state: 'created',
                });
            } else {
                await gstore.api.addOrder({
                    title: this.title,
                    content: {
                        type: 'simple',
                        description: this.description,
                    },
                    state: 'created',
                });
            }
            await gstore.updateOrders();
            this.title = '';
            this.description = '';
            if (gstore.me!.role === 'user') {
                const newAddresses = [];
                for (let item of gstore.cart) {
                    if (!item.placeId && !gstore.savedAddresses.includes(item.address) && !gstore.selfAddresses.includes(item.address)) {
                        newAddresses.push(item.address);
                    }
                }
                if (newAddresses.length) {
                    const unqiueNewSavedAddresses = ([] as string[]).concat(gstore.savedAddresses, newAddresses.filter((e, i, a) => a.indexOf(e) === i));
                    await gstore.api.updateSavedAddresses(gstore.me!.id, unqiueNewSavedAddresses);
                    gstore.savedAddresses = unqiueNewSavedAddresses;
                }
            }
            this.cartLoading = false;
            gstore.cart = [];
            if (gstore.me!.role === 'user') {
                this.mode = 'cart';
            }
            this.props.navigation.jumpTo('Home');
        }}
        loading={this.cartLoading}
    >
        Создать заявку
    </FButton>
</View>

</View>
)
;
}

render()
{
    return this.mode === 'cart' ? this.renderCart() : this.renderOrder();
}
}

export default CartScreen;
