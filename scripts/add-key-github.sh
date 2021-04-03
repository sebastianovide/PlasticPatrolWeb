#!/bin/sh
set -eo pipefail

# see https://engineering.talkdesk.com/test-and-deploy-an-ios-app-with-github-actions-44de9a7dcef6

# Put the provisioning profile in place
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp "./Geovation_CI.mobileprovision" ~/Library/MobileDevice/Provisioning\ Profiles/

security create-keychain -p github build.keychain
security import ./dist.cer -t agg -k ~/Library/Keychains/build.keychain -P "" -A
security import ./apple.p12 -t agg -k ~/Library/Keychains/build.keychain -P "" -A

security list-keychains -s ~/Library/Keychains/build.keychain
security default-keychain -s ~/Library/Keychains/build.keychain
security unlock-keychain -p github ~/Library/Keychains/build.keychain
security set-keychain-settings ~/Library/Keychains/build.keychain # Set no auto-lock timeout

security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k github ~/Library/Keychains/build.keychain
