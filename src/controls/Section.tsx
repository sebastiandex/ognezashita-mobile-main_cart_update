import React, { ReactNode } from "react";
import { Text, View } from "react-native";

import { MainBackground, MainHeader } from "../colors";

function Section({ text, children, contentStyle }: { text?: string, children: ReactNode, contentStyle?: any }) {
	return (
		<>
			<View style={{ marginBottom: 10 }}>
				{text ? (
					<View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
						<Text style={{ fontSize: 18, fontWeight: 'bold', color: MainHeader }}>{text}</Text>
					</View>
				) : null}
				<View
					style={Object.assign({
						paddingHorizontal: 25,
						paddingVertical: 20,
						backgroundColor: MainBackground,
						borderBottomColor: '#e0e0e0',
						borderBottomWidth: 1,
						borderTopColor: '#e0e0e0',
						borderTopWidth: 1,
					}, contentStyle || {})}
				>
					{children}
				</View>
			</View>
		</>
	);
}

export default Section;