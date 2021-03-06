import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import gstore from "../stores/gstore";

function Section({ text, children, contentStyle, noBorder }: { text?: string, children: ReactNode, contentStyle?: any, noBorder?: boolean }) {
	return (
		<>
			<View style={{ marginBottom: 10 }}>
				{text ? (
					<View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
						<Text style={{ fontSize: 18, fontWeight: 'bold', color: gstore.colorSheme === 'dark' ? 'white' : 'black' }}>{text}</Text>
					</View>
				) : null}
				<View
					style={Object.assign({
						paddingHorizontal: 20,
						paddingVertical: 20,
						backgroundColor: gstore.colorSheme === 'dark' ? '#191919' : 'white',
						borderBottomColor: '#E5E5E5',
						borderBottomWidth: noBorder ? 0 : 1,
						borderTopColor: '#E5E5E5',
						borderTopWidth: noBorder ? 0 : 1,
					}, contentStyle || {})}
				>
					{children}
				</View>
			</View>
		</>
	);
}

export default Section;
