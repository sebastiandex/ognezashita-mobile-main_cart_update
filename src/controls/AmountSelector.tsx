import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import gstore from "../stores/gstore";

export default function AmountSelector({ value, onValue }: { value: number, onValue: (a: number) => void }) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
			<TouchableOpacity onPress={() => value > 1 ? onValue(value - 1) : null}>
				<View style={{ marginRight: 20, borderColor: '#2A5EE4', borderWidth: 2, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
					<Text style={{ fontSize: 18, marginTop: -1, fontWeight: 'bold', color: '#2A5EE4' }}>-</Text>
				</View>
			</TouchableOpacity>
			<View><Text style={{ fontSize: 24, fontWeight: '600', color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{value}</Text></View>
			<TouchableOpacity onPress={() => onValue(value + 1)}>
				<View style={{ marginLeft: 20, borderColor: '#2A5EE4', borderWidth: 2, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
					<Text style={{ fontSize: 18, marginTop: -1, fontWeight: 'bold', color: '#2A5EE4' }}>+</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}
