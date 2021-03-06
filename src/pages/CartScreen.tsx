import {autobind} from "core-decorators";
import {observable} from "mobx";
import {observer} from "mobx-react";
import React, {PureComponent} from "react";
import {
    FlatList,
    Image,
    ListRenderItemInfo,
    Text,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    MainOrange
} from "../colors";
import FButton from "../controls/FButton";
import Section from "../controls/Section";

import gstore, {ICartItem} from "../stores/gstore";

@observer
class CartScreen extends PureComponent<{ navigation: any }> {

    @observable mode: 'cart' | 'order' = gstore.me!.role === 'user' ? 'cart' : 'order';

    dispose: any = null;

    @autobind
    renderItem({item, index}: ListRenderItemInfo<ICartItem>) {
        return (
            <TouchableWithoutFeedback onPress={() => {
            }}>
                <View style={{
                    flexDirection: 'row',
                    // marginHorizontal: 20,
                    paddingVertical: 18,
                    paddingHorizontal: 20,
                    backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
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
                               style={{width: 70, height: 70, resizeMode: 'contain'}}
                        />
                    </View>
                    <View style={{flexShrink: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                        <View><Text
                            style={{fontSize: 14, fontWeight: '400', color: gstore.colorSheme === 'dark' ? 'white' : 'black',}}>{item.itemTitle}</Text></View>

                        <View style={{marginBottom: 18, marginTop: 8}}>
                            <Text
                                style={{fontSize: 14, color: gstore.colorSheme === 'dark' ? '#949494' : '#575757'}}>????????????????????: {item.amount}
                            </Text>
                        </View>
                        <View>
                            <Text style={{color: MainOrange}}>??????????: {item.address}</Text>
                        </View>
                        {/*<View><Text style={{ color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '')}</Text></View>*/}
                    </View>
                    <View style={{
                        flexBasis: 85,
                        // marginLeft: 10,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        flexShrink: 0
                        // flexGrow: 0
                    }}>
                        <TouchableOpacity onPress={() => {
                            gstore.cart.splice(index, 1);
                        }}>

                            <Icon name="times" size={24} color="#c0c0c0"/>

                        </TouchableOpacity>

                        <Text style={{
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            color: gstore.colorSheme === 'dark' ? 'white' : 'black',
                            fontWeight: '600',
                            fontSize: 18,
                            marginTop: 15,
                            marginLeft: 'auto'
                        }}>
                            {parseFloat(String(item.price || 0)) ? `${parseFloat(String(item.price))}???` : null}
                            {/*{parseFloat(String(item.price || 0)) ? `999999???` : null}*/}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderCart() {
        const goods: ICartItem[] = [];
        const services: ICartItem[] = [];
        gstore.cart.map((item) => {
            if (item.isService) {
                services.push(item)
            } else {
                goods.push(item)
            }
        })

        return (
            //
            // <View style={{backgroundColor: MainBackground}}>
            // <View style={{ backgroundColor: MainBackground, flexGrow: 1 }}>
            //     {gstore.cart.length ? (
            <FlatList
                style={{flex: 1}}
                data={gstore.cart.map(d => d)}
                keyExtractor={(item, index) => String(index)}
                renderItem={this.renderItem}
                // ListHeaderComponent={<View style={{
                //     width: '100%',
                //     justifyContent: 'flex-start',
                //     alignItems: 'flex-start',
                //     marginTop: 24,
                //     marginLeft: 20
                // }}>
                //     <Text
                //         style={{
                //             color: '#282828',
                //             fontSize: 24,
                //             fontWeight: '600'
                //         }}>????????????</Text>
                // </View>}
                ListFooterComponent={
                    <View style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 45,
                        paddingBottom: 120,
                        backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white'
                    }}>
                        <FButton onPress={() => {
                            this.mode = 'order';
                        }} big>?????????????? ????????????</FButton>

                        <View style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 0,
                            backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white'
                        }}>
                            <TouchableOpacity onPress={() => {
                                gstore.cart = [];
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white'
                                }}>
                                    <Text style={{fontWeight: '400', color: '#949494'}}>
                                        ???????????????? ??????????????
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
            //             ) : (
            //                 <>
            //                     <View style={{
            //                         alignItems: 'center',
            //                         justifyContent: 'center',
            //                         marginTop: 50,
            //                         width: '70%',
            //                         alignSelf: 'center'
            //                     }}>
            //                         <Text style={{textAlign: 'center', fontSize: 16, color: '#606060', lineHeight: 26}}>????????????????
            //                             ???????????? ?????? ???????????? ?? ?????????????? ?????? ???????????????? ????????????.</Text>
            //                     </View>
            //                     <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
            //                         <FButton onPress={() => {
            //                             this.props.navigation.jumpTo('Services');
            //                         }}>?????????????? ?? ?????????????? ?? ??????????????</FButton>
            //                     </View>
            //                 </>
            //             )
            // }
            //         </View>

        );
    }

    @observable selectedIdx = 0;
    @observable title = '';
    @observable description = '';

    @observable cartLoading = false;

    renderOrder() {
        return (

            <View style={{
                backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
                paddingTop: 20,
                flexGrow: 1
            }}>
                <View style={{borderBottomColor: gstore.colorSheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5', borderBottomWidth: 1}}>
                    <Section noBorder text="????????????????"
                             contentStyle={{
                                 fontSize: 15,
                                 paddingVertical: 10,
                                 // paddingTop: 0,
                                 paddingLeft: 12,
                                 paddingRight: 12,
                                 marginLeft: 20,
                                 marginRight: 20,
                                 backgroundColor: gstore.colorSheme === 'dark' ? '#262626' : '#E3E3E3',
                                 borderWidth: 0,
                                 borderRadius: 8,
                                 marginBottom: 20
                             }}>
                        <TextInput
                            style={{
                                paddingVertical: 0, paddingLeft: 1,
                                paddingTop: 5, textAlignVertical: 'center',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                color: gstore.colorSheme === 'dark' ? 'white' : 'black'
                            }}
                            // placeholder="???????????????? ????????????"
                            placeholderTextColor={gstore.colorSheme === 'dark' ? '#949494' : '#575757'}
                            value={this.title}
                            onChangeText={text => this.title = text}
                        />
                    </Section>
                </View>
                <View style={{borderBottomColor: gstore.colorSheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5', borderBottomWidth: 1, marginTop: 15}}>
                <Section noBorder text="????????????????" contentStyle={{
                    paddingVertical: 10,
                    paddingLeft: 12,
                    paddingRight: 12,
                    marginLeft: 20,
                    marginRight: 20,
                    backgroundColor: gstore.colorSheme === 'dark' ? '#262626' : '#E3E3E3',
                    borderRadius: 8,
                    marginBottom: 20
                }}>
                    <TextInput
                        style={{
                            fontSize: 15,
                            height: 100,
                            width: '100%',
                            paddingVertical: 0,
                            paddingLeft: 1,
                            paddingTop: 5,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            textAlignVertical: 'top',
                            color: gstore.colorSheme === 'dark' ? 'white' : 'black'
                        }}
                        // placeholder="????????????????"
                        multiline={true}
                        value={this.description}
                        onChangeText={text => this.description = text}
                    />
                </Section>
                </View>

                {
                    gstore.me!.role === 'user' ? (
                        <Section text="??????????????">
                            {gstore.cart.map((c, idx) => (
                                <View key={idx} style={{marginBottom: 5}}>
                                    <Text>{c.amount} x {c.itemTitle}</Text>
                                </View>
                            ))}
                        </Section>
                    ) : null
                }

                <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
                    <FButton
                        buttonStyle={{backgroundColor: '#4CBD57'}}
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
                        loading={this.cartLoading} big
                    >
                        ?????????????? ????????????
                    </FButton>
                </View>

            </View>
        )
            ;
    }

    render() {
        return this.mode === 'cart' ? this.renderCart() : this.renderOrder();
    }
}

export default CartScreen;
