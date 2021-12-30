import RNPermissions, { PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';

import {Alert, Appearance, NativeModules} from 'react-native';
import { Platform } from 'react-native';
import {cancelledColor, createdColor, doneColor, executingColor, MainText} from "../colors";
import gstore from "../stores/gstore";

const ImagePicker = NativeModules.ImageCropPicker;

export default async function getPermissionAsync(permission: Permission) {
	const status = await RNPermissions.check(permission);

	console.log(status);

	if (
		status === RESULTS.DENIED ||
		status === RESULTS.BLOCKED ||
		status === RESULTS.GRANTED
	) {
		console.log('if statement');

		const reqStatus = await RNPermissions.request(permission);

		console.log({ reqStatus });

		if (reqStatus === RESULTS.GRANTED) {
			return true;
		} else if (reqStatus === RESULTS.BLOCKED || reqStatus === RESULTS.DENIED) {
			Alert.alert('cannot be done');
			return false;
		}
	}

	return true;
}

export async function pickImageAsync(onSend: (images: {uri: string, type: string, name: string }[]) => void) {
	if (await getPermissionAsync(Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY)) {
	  ImagePicker.openPicker({
		width: 500,
		height: 500,
		cropping: true,
		cropperCircleOverlay: true,
		sortOrder: 'none',
		compressImageMaxWidth: 1000,
		compressImageMaxHeight: 1000,
		compressImageQuality: 1,
		compressVideoPreset: 'MediumQuality',
		includeExif: true,
	  })
		.then((image: any) => {
		  console.log('received image', image);

		  return onSend([
			{
			  uri: image.path,
			  type: image.mime,
			  name: image.path.split('/').reverse()[0],
			},
		  ]);
		})
		.catch((e: any) => {
		  console.log(e);
		  // Alert.alert(e.message ? e.message : e);
		});
	}

	// Alert.alert('pick image async false');
}
export const statusColor = (status: any) => {
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

export const changeTheme = () => {
	gstore.userTheme = true;
	if (gstore.colorScheme === 'dark') {
		gstore.chosenTheme = 'light'
	} else {
		gstore.chosenTheme = 'dark'
	}
	console.log('COLORTHEME', gstore.colorScheme)
	console.log('SYSTEMTHEME', Appearance.getColorScheme())
}
