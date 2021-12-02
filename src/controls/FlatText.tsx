import React from 'react';
import { View, Text, Linking } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import gstore from '../stores/gstore';
import FButton from './FButton';

export default function FlatText({ text, style, children, callUs }: { text: string, style?: any, children?: any, callUs?: boolean }) {
	return (
		<View style={Object.assign({ alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 30, width: '90%', alignSelf: 'center' }, style || {})}>
			<Text style={{ textAlign: 'center', fontSize: 16, color: '#404040', lineHeight: 24 }}>{text}</Text>
			{callUs && (<FButton style={{ marginTop: 40 }} onPress={() => { Linking.openURL('tel:' + gstore.mainPhone); }}><Icon name="phone" />   Позвонить нам</FButton>)}
			{children}
		</View>
	)
}