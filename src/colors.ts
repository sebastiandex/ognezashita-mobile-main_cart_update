// export const MainBackground = '#312D2C';
// export const MainBackgroundLight = '#404040';
// export const MainText = '#e0e0e0';
// export const MainHeader = '#f0f0f0';
// export const MainLight = '#D59C0D';
// export const MainHighlight = '#FEED01';
// export const MainMuted = '#808080';


import gstore from "./stores/gstore";

export const MainBackground = gstore.colorScheme === 'dark' ? '#191919' : 'white';
export const MainBackgroundNav = '#38393A';
export const MainBackgroundDark = '#191919';
export const MainBackgroundLight = 'white';
export const MainText = gstore.colorScheme === 'dark' ? 'white' : 'black';
export const descriptionText = gstore.colorScheme === 'dark' ? '#949494' : '#575757';
export const MainHeader = 'black';
export const MainLight = '#D59C0D';
export const MainHighlight = 'yellow';
export const MainMuted = '#808080';
export const MainBorder = '#e0e0e0';
export const MainOrange = '#F48E39';
export const IconGrey = '#A3A3A3';
export const MainBlack = '#191919';
// export const MainBlack = '#FFFFFF';
export const MainGrey = '#38393A';
export const MainWhite = '#FFFFFF';
export const createdColor = '#F48E39';
export const executingColor = MainText;
export const doneColor = '#4CBD57';
export const cancelledColor = '#E73838';
export const searchBackGround = gstore.colorScheme === 'dark' ? '#2B2B2B' : '#E5E5E5';
export const cartColor = gstore.colorScheme === 'dark' ? '#FFFFFF' : 'rgba(40, 40, 40, 0.4)';
export const borderColor = gstore.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5';
export const inputColor = gstore.colorScheme === 'dark' ? '#262626' : '#E3E3E3';
