import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";

export default function AmountSelector({ value, onValue }: { value: number, onValue: (a: number) => void }) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
			<TouchableOpacity onPress={() => value > 1 ? onValue(value - 1) : null}>
				<View style={{ marginRight: 20, backgroundColor: '#f0f0f0', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
					<Text style={{ fontSize: 15, marginTop: -1, fontWeight: 'bold' }}>-</Text>
				</View>
			</TouchableOpacity>
			<View><Text style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</Text></View>
			<TouchableOpacity onPress={() => onValue(value + 1)}>
				<View style={{ marginLeft: 20, backgroundColor: '#f0f0f0', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
					<Text style={{ fontSize: 15, marginTop: -1, fontWeight: 'bold' }}>+</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}