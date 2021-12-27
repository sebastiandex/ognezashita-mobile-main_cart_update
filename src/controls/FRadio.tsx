import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {MainOrange, MainText} from "../colors";


export default function FRadio({ text, cmp, selected, onPress, style }: { style?: any, text?: string, cmp?: any, selected: boolean, onPress: () => void, }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={{ flexDirection: 'row', maxWidth: '80%', flexShrink: 0, marginBottom: 20 }}>
				<View style={Object.assign({
					marginRight: 10,
					width: 16,
					height: 16,
					marginTop: 2,
					borderRadius: 8,
					borderColor: '#F48E39',
					borderWidth: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'white' }, style ? style : {})}>
					{selected ? (<View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: MainOrange }} />) : null}
				</View>
				{cmp || (<Text style={{fontSize: 16, color: selected ? MainText : '#949494'}}>{text}</Text>)}
			</View>
		</TouchableOpacity>
	);
}
