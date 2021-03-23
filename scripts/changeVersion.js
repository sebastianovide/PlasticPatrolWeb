import plist from 'plist';
import { readFileSync, writeFileSync } from 'fs';

const infoFilePath = "ios/App/App/Info.plist";
const gradleFilePath = "android/app/build.gradle";

// read version
const version = process.env.REACT_APP_VERSION || "1.1.1";

// Android
const versionSplit = version.split(".");
const newAndroidVersionName = versionSplit[0] * 10000000 + versionSplit[1] * 10000 + versionSplit[2];
console.log("android-versionName:", newAndroidVersionName);
const gradleContent = readFileSync(gradleFilePath, 'utf8');
const regex = /versionName \".*\"/;
const newGradleContent = gradleContent.replace(regex, `versionName "${newAndroidVersionName}"`);
writeFileSync(gradleFilePath, newGradleContent)

// IOS
const newIosCFBundleShortVersionString = version;
console.log("ios-CFBundleShortVersionString:", newIosCFBundleShortVersionString);
const obj = plist.parse(readFileSync(infoFilePath, 'utf8'));
obj.CFBundleShortVersionString = newIosCFBundleShortVersionString;
writeFileSync(infoFilePath, plist.build(obj))