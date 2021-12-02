import React from 'react';
import { View } from 'react-native';


export default function Centroid({ children, style }: { children?: any, style?: any }) {
	return (
		<View style={Object.assign({ flexGrow: 1, flexShrink: 1, alignItems: 'center', justifyContent: 'center' }, style ? style : {})}>
			{children}			
		</View>
	)
}