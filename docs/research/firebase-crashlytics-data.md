# What does Firebase Crashlytics keep from an iOS crash?

Research for [issue #20](https://github.com/maximsan/getbrewpath/issues/20), part of [#3](https://github.com/maximsan/getbrewpath/issues/3). Sources checked on 2026-10-22.

## Short answer

When the app crashes, Crashlytics sends the crash to Google. The report holds the stack trace, the time, the app version, the device model, the operating system version and device state. Device state includes free memory and disk space, screen rotation and whether the device is jailbroken. Each report carries two random installation identifiers. Neither one is the advertising identifier. Neither one names the user. Google keeps the report and its identifiers for 90 days, then starts deleting them.

Crashlytics on iOS also sends a short session record at each app launch, before any crash. That record holds the app bundle identifier, operating system details, the SDK version and the network type.

Google acts as a processor for this data. It may process the data in any country where Google has facilities. On the App Store, Google declares Crashlytics data as "Crash Data" and "Other Diagnostic Data", not linked to the user and not used for tracking.

Crash reporting is on by default. The app can turn it off in its build settings and let the user turn it on, or off again, at runtime.

## Words used here

- **Crashlytics** is Google's crash reporting service, part of Firebase.
- **Firebase** is Google's toolkit for app developers.
- **A software development kit (SDK)** is the Firebase code compiled into the app.
- **A stack trace** is the list of program steps running at the moment of the crash.
- **A universally unique identifier (UUID)** is a random 128-bit number used as a label.
- **A Request for Comments (RFC)** is an internet standards document. RFC-4122 defines the UUID format.
- **The Crashlytics installation UUID** is a random identifier Crashlytics gives each install of the app.
- **The Firebase installation ID (FID)** is a second random identifier Firebase gives each install of the app.
- **The Firebase installations service (FIS)** is the Firebase service that issues the FID.
- **The identifier for advertisers (IDFA)** is Apple's advertising identifier for a device.
- **The central processing unit (CPU)** is the device's main chip. Its architecture is the chip family.
- **Random-access memory (RAM)** is the device's working memory.
- **The Native Development Kit (NDK)** is Android's toolkit for native code. It does not apply to iOS.
- **Hypertext Transfer Protocol Secure (HTTPS)** is the encrypted protocol for web traffic.
- **The United States (US)** is named where Firebase limits a service to one region.
- **A dSYM file** holds the debug symbols that turn raw addresses into function names.
- **FirebaseSessions** is a Firebase library that Crashlytics depends on. It records app sessions.
- **The privacy manifest** is a file Apple requires inside an SDK, listing the data the SDK collects.
- **App Privacy Details** are the data labels Apple shows on an app's App Store page.
- **The General Data Protection Regulation (GDPR)** is the European Union privacy law.
- **The California Consumer Privacy Act (CCPA)** is California's privacy law.
- **The California Privacy Rights Act (CPRA)** is the law that amends and expands the CCPA.
- **A processor** handles personal data on a customer's behalf and under the customer's instructions.
- **A controller** decides why and how personal data is processed.
- **The Data Processing and Security Terms** are Google's contract on handling data sent to Firebase.
- **`setCrashlyticsCollectionEnabled`** is the Crashlytics call that turns reporting on or off at runtime.
- **ADR-0034** is the app's decision that the launch build sends crash reports and nothing else.

## Facts

### What a crash report holds

- Firebase lists what Crashlytics collects under "Examples of information collected by Crashlytics". The list, quoted from the page:
  - "An RFC-4122 UUID which permits us to deduplicate crashes"
  - "The Crashlytics Installation UUID"
  - "The Firebase installations ID (FID)"
  - "The Firebase session ID, which is a random UUID generated to tag events with a session"
  - "The timestamp of when the crash occurred"
  - "The app's bundle identifier and full version number"
  - "The device's operating system name and version number"
  - "A boolean indicating whether the device was jailbroken/rooted"
  - "The device's model name, CPU architecture, amount of RAM and disk space"
  - "The uint64 instruction pointer of every frame of every currently running thread"
  - "If available in the runtime, the plain-text method or function name containing each instruction pointer."
  - "If an exception was thrown, the plain-text class name and message value of the exception"
  - "If a fatal signal was raised, its name and integer code"
  - "For each binary image loaded into the application, its name, UUID, byte size, and the uint64 base address at which it was loaded into RAM"
  - "A boolean indicating whether or not the app was in the background at the time it crashed"
  - "An integer value indicating the rotation of the screen at the time of crash"
  - "A boolean indicating whether the device's proximity sensor was triggered"
  - "The contents of version-control-info.textproto", for Android apps with version control integration only.

  Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Examples of information collected by Crashlytics".
- The same page's product table lists Crashlytics data as "Crashlytics Installation UUIDs", "Firebase installations ID", "Crash traces" and "Breakpad minidump formatted data (NDK crashes only)". Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Examples of end-user data processed by Firebase".
- Firebase says why: "Firebase Crashlytics uses crash stack traces to associate crashes with a project, send email alerts to project members and display them in the Firebase Console, and help Firebase customers debug crashes. It uses Crashlytics Installation UUIDs to measure the number of users impacted by a crash and minidump data to process NDK crashes." Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "How it helps".
- Minidump data applies to Android native crashes only. The page says: "Firebase Crashlytics stores minidump data only temporarily in order to process NDK crashes." Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy).
- The iOS SDK's App Store disclosure page says Crashlytics always "Collects stack traces and relevant application state when an application crashes" and "Collects device and OS information to assist with debugging crashes." Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "FirebaseCrashlytics".
- The page lists what is collected only if the developer adds it: "Collects any custom keys, logs, and free-text user IDs that developers attach to crash reports. Also collects any developer-defined non-fatal events with custom stack traces." Breadcrumb logs are collected only "if Crashlytics is used together with Google Analytics". Remote Config template data is collected only if the Remote Config SDK is also in the app. Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "FirebaseCrashlytics", "Usage dependent".
- The Firebase privacy page was last modified on September 15, 2026. Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), header.

### Retention

- Firebase says: "Firebase Crashlytics keeps crash stack traces, extracted minidump data, and associated identifiers (including Crashlytics Installation UUIDs and Firebase installation IDs) for 90 days before starting the process of removing it from live and backup systems." Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Retention".
- Firebase installation IDs are kept "until the Firebase customer makes an API call to delete the ID. After the call, data is removed from live and backup systems within 180 days." Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Firebase installations".
- Clearing a user identifier in the app does not delete old reports. The docs say: "Clearing a user identifier does not remove existing Crashlytics records. If you need to delete records associated with a user ID, contact Firebase support." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Set user identifiers".

### Identifiers

- The Firebase installations service "provides a Firebase installation ID (FID) for each installed instance of a Firebase app." Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations).
- "Firebase installation IDs are different for every installation of every application; different applications on the same device have different Firebase installation IDs." Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations), "Delete a Firebase installation".
- The FID changes on "Uninstallation or reinstallation of the app", when "The end user clears the cache of the app or the device", and after 270 days of inactivity. A new FID is then assigned. Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations), "Monitor the FID lifecycle".
- After a deletion, "FIS creates a new ID within a few days. Firebase considers the newly-created ID to be a new Firebase installation, and doesn't associate it with the previous ID or data in any way." Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations), "Delete a Firebase installation".
- Firebase says: "Data tied to a Firebase installation is generally not personally identifying." Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations), "Delete a Firebase installation".
- Crashlytics "rotates the Crashlytics installation UUID based on changes to the app instance's Firebase installation ID." Source: [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations), table of services.
- Crashlytics collects no advertising identifier and no user account by default. The IDFA appears nowhere in the Crashlytics data lists. User IDs are collected only when the developer calls `setUserIdentifier`. Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Examples of information collected by Crashlytics", and [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "Usage dependent".
- The user identifier is optional. The docs say: "assign each user a unique identifier in the form of an ID number, token, or hashed value". To clear it, "reset the value to a blank string." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Set user identifiers".
- Custom keys are optional. "Crashlytics supports a maximum of 64 key-value pairs." "Each key-value pair can be up to 1 kB in size." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Add custom keys".
- Custom logs are optional. "Crashlytics limits logs to 64kB and deletes older log entries when logs for a session go over that limit." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Add custom log messages".
- The Crashlytics SDK's privacy manifest declares `NSPrivacyTracking` as false and lists no tracking domains. Source: [Crashlytics PrivacyInfo.xcprivacy in firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Crashlytics/Resources/PrivacyInfo.xcprivacy).

### Google's role and where data is processed

- "Firebase customers typically act as the 'data controller' (GDPR) or 'business' (CCPA/CPRA) for any personal data or information about their end-users they provide to Google in connection with their use of Firebase, and Google generally operates as a 'data processor' (GDPR) or 'service provider' (CCPA/CPRA)." Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Firebase support for GDPR and CCPA".
- The Data Processing and Security Terms say, where European data protection law applies: "Google is a processor of that Customer Personal Data under European Data Protection Law". The customer "is a controller or processor, as applicable". Source: [Firebase Data Processing and Security Terms](https://firebase.google.com/terms/data-processing-terms), section 5.1.1.
- The terms cover Crashlytics. They say: "With respect to the Firebase Crashlytics and Firebase App Distribution Terms of Service under which Google has agreed to provide Firebase Crashlytics and Firebase App Distribution Services, these Terms were formerly known as the 'Crashlytics and App Distribution Data Processing and Security Terms.'" Source: [Firebase Data Processing and Security Terms](https://firebase.google.com/terms/data-processing-terms), introduction. Last modified August 21, 2024.
- Location: "Customer Data may be processed in any country in which Google or its Subprocessors maintain facilities." Source: [Firebase Data Processing and Security Terms](https://firebase.google.com/terms/data-processing-terms), section 10.1.
- The privacy page lists Crashlytics under "Global services". It says: "The majority of Firebase services run on global Google infrastructure. They could process data at any of the Google Cloud Platform locations or Google data center locations." Only Firebase Authentication is listed as US-only. Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Data storage and processing locations".
- Crashlytics encrypts data at rest. Firebase services encrypt data in transit using HTTPS. Source: [Privacy and Security in Firebase](https://firebase.google.com/support/privacy), "Data encryption".
- At the end of the contract: "Customer instructs Google to delete all remaining Customer Data (including existing copies) from Google's systems at the end of the Term". Google does so "within a maximum period of 180 days", after a recovery period of up to 30 days. Source: [Firebase Data Processing and Security Terms](https://firebase.google.com/terms/data-processing-terms), section 6.2.
- The Crashlytics Terms of Service forbid collecting personal data through the service unless needed: the developer "will not enable collection of personally identifiable information via the Services unless it is necessary to communicate with users about the Applications" and the user has consented. Source: [Firebase Crashlytics and Firebase App Distribution Terms of Service](https://firebase.google.com/terms/crashlytics), "Data Collection and Use". Last updated June 1, 2023.

### Apple's App Store disclosure

- Apple's data types under "Diagnostics" are: "Crash Data: Such as crash logs", "Performance Data: Such as launch time, hang rate, or energy use" and "Other Diagnostic Data: Any other data collected for the purposes of measuring technical diagnostics related to the app". Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Types of data".
- Apple defines "Device ID" as "Such as the device's advertising identifier, or other device-level ID". Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Identifiers".
- The developer must declare data collected by third-party code: "You'll need to provide information about your app's privacy practices, including the practices of third-party partners whose code you integrate into your app, in App Store Connect." Third-party partners include "third-party SDKs". Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), introduction and "Data collection".
- Apple says data is "linked to the user" when it is linked to "the user's identity (via their account, device, or other details)". Data is not linked only if identifiers are stripped before collection and the developer never links it back. Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Data linked to the user".
- Apple defines tracking as "linking data collected from your app about a particular end-user or device, such as a user ID, device ID, or profile, with Third-Party Data for targeted advertising or advertising measurement purposes, or sharing data collected from your app about a particular end-user or device with a data broker." Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Tracking".
- Crash data collected on an ongoing basis must be declared. Optional disclosure needs all of four criteria, including that collection "occurs only in infrequent cases that are not part of your app's primary functionality" and that "the user affirmatively chooses to provide the data for collection each time". Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Optional disclosure".
- The Crashlytics SDK's privacy manifest declares two data types: "Crash Data" and "Other Diagnostic Data". Both are declared as not linked to the user and not used for tracking. Both have the purpose "App Functionality". Source: [Crashlytics PrivacyInfo.xcprivacy in firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Crashlytics/Resources/PrivacyInfo.xcprivacy).
- Firebase says its manifests cover only the default collection: "Firebase's privacy manifests disclose data that is always collected and collected by default. It is your responsibility to ensure your privacy nutrition labels are accurate based on your app's actual usage of Firebase." Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection).
- FirebaseCore "Does not collect data." Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "FirebaseCore".
- Apple requires a privacy policy link on the product page: "Privacy Policy (Required)". Source: [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/), "Privacy links".

### Data sent before the first crash

- On iOS, the Crashlytics library depends on FirebaseSessions. Source: [Package.swift in firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Package.swift), target "FirebaseCrashlytics", and [FirebaseCrashlytics.podspec](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/FirebaseCrashlytics.podspec).
- The Flutter plugin `firebase_crashlytics` depends on the native `Firebase/Crashlytics` pod. Source: [firebase_crashlytics.podspec in flutterfire](https://github.com/firebase/flutterfire/blob/main/packages/firebase_crashlytics/firebase_crashlytics/ios/firebase_crashlytics.podspec).
- FirebaseSessions always "Collects metadata about app performance, such as the bundle ID, OS information, SDK version, and network connection type to monitor app quality." It also "Collects usage data such as the time an app was backgrounded to group performance metrics into user sessions". Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "FirebaseSessions".
- FirebaseSessions sends a session start event when a session begins. It sends nothing when every dependent product has data collection off. The code says: "Wait until all expected subscribers have registered before doing any data collection." Then: `guard isAnyDataCollectionEnabled else { loggedEventCallback(.failure(.DataCollectionError)); return }`. Source: [FirebaseSessions.swift in firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/FirebaseSessions/Sources/FirebaseSessions.swift).
- Firebase says the Firebase user agent, "device, OS, app bundle ID, and developer platform", is sent by most SDKs. "The user agent is never linked to a user or device identifier". Source: [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection), "Firebase user agent".
- Not found: a Firebase page that states, in plain words, that Crashlytics sends nothing before the first crash. The FirebaseSessions dependency shows the opposite for iOS.

### Turning reporting off and on

- "By default, Crashlytics automatically collects crash reports for all your app's users." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- To turn automatic collection off on iOS, add the key `FirebaseCrashlyticsCollectionEnabled` with value `false` to `Info.plist`. Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- The native SDK reads that key. The code says: `NSString *const FIRCLSCrashlyticsCollectionKey = @"FirebaseCrashlyticsCollectionEnabled";`. Source: [FIRCLSDataCollectionArbiter.m in firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Crashlytics/Crashlytics/DataCollection/FIRCLSDataCollectionArbiter.m).
- To turn collection on at runtime, call `FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(true)`. "The override value persists across all subsequent launches of your app". Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- To turn it off again, pass `false`. The change "will apply the next time the user launches the app and will persist across all subsequent launches for that user." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- While off, crashes stay on the device: "When data collection is disabled for a user, Crashlytics will store crash information locally on the device. If data collection is subsequently enabled, any crash information stored on the device will be sent to Crashlytics for processing." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- Firebase warns: "If you enable opt-in reporting by disabling automatic reporting, you will reduce the accuracy of your app's event count and crash-free metrics". Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Enable opt-in reporting".
- Timing: "For Flutter apps, fatal reports are sent to Crashlytics in real-time without the need for the user to restart the application. Non-fatal reports are written to disk to be sent along with the next fatal report or when the app restarts." Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Get breadcrumb logs" note.
- Crash Insights compares the app's "anonymized stack traces to traces from other Firebase apps". The owner can opt out in the Firebase console. Source: [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports), "Manage Crash Insights data".
- The Flutter setup uploads dSYM files to Crashlytics automatically with Flutter 3.12.0 or later and the plugin 3.3.4 or later. Those files hold the app's symbols, not user data. Source: [Get started with Firebase Crashlytics (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/get-started), "Step 3".

## What this means for the app's Privacy Policy

- The policy can say: when the app crashes, a crash report goes to Firebase Crashlytics, a Google service.
- It can list what the report holds. That is: the crash stack trace, the time, the app version, the device model and the iOS version. Also: memory and disk space, screen rotation, and whether the device is jailbroken.
- It can say the report carries a random installation identifier. The identifier changes when the app is reinstalled. It is not the advertising identifier. It is not the user's account.
- It can say Google keeps crash reports for 90 days, then deletes them.
- It can say the app also sends a short session record at launch: the app bundle identifier, iOS version, SDK version and network type.
- It can say Google processes the data on the app's behalf, in Google data centres worldwide.
- Not in the data by default: user IDs, custom keys and custom logs. The policy should not promise them absent if the app later adds them. ADR-0034 records that the launch build adds nothing beyond crash reports.
- On the App Store, the app's privacy label must declare "Crash Data" and "Other Diagnostic Data". Both are not linked to the user and not used for tracking. That matches the SDK's own manifest.

## Open decisions for the owner

1. Whether to keep crash reporting on by default, or add an opt-in toggle. Firebase supports both. An opt-in lowers the accuracy of crash-free metrics.
2. Whether the policy mentions the FirebaseSessions launch record. It is sent on every launch, not only on crashes.
3. Whether the policy states the 90-day retention as Google's number, since it comes from Google's page and may change.

## Sources

- [Privacy and Security in Firebase](https://firebase.google.com/support/privacy)
- [Prepare for Apple's App Store data disclosure requirements](https://firebase.google.com/docs/ios/app-store-data-collection)
- [Manage Firebase installations](https://firebase.google.com/docs/projects/manage-installations)
- [Customize your Firebase Crashlytics crash reports (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/customize-crash-reports)
- [Customize your Firebase Crashlytics crash reports (hub page)](https://firebase.google.com/docs/crashlytics/customize-crash-reports?platform=flutter)
- [Get started with Firebase Crashlytics (Flutter)](https://firebase.google.com/docs/crashlytics/flutter/get-started)
- [Get started with Firebase Crashlytics (hub page)](https://firebase.google.com/docs/crashlytics/get-started?platform=flutter)
- [Customize your Firebase Crashlytics crash reports (Apple platforms)](https://firebase.google.com/docs/crashlytics/ios/customize-crash-reports)
- [Firebase Data Processing and Security Terms](https://firebase.google.com/terms/data-processing-terms)
- [Firebase Crashlytics and Firebase App Distribution Terms of Service](https://firebase.google.com/terms/crashlytics)
- [App privacy details on the App Store](https://developer.apple.com/app-store/app-privacy-details/)
- [Crashlytics PrivacyInfo.xcprivacy in firebase-ios-sdk at commit 81e7067](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Crashlytics/Resources/PrivacyInfo.xcprivacy)
- [Package.swift in firebase-ios-sdk at commit 81e7067](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Package.swift)
- [FirebaseCrashlytics.podspec in firebase-ios-sdk at commit 81e7067](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/FirebaseCrashlytics.podspec)
- [FirebaseSessions.swift in firebase-ios-sdk at commit 81e7067](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/FirebaseSessions/Sources/FirebaseSessions.swift)
- [FIRCLSDataCollectionArbiter.m in firebase-ios-sdk at commit 81e7067](https://github.com/firebase/firebase-ios-sdk/blob/81e706741b26e6e691b49ecfa19d3e9aa88c0bec/Crashlytics/Crashlytics/DataCollection/FIRCLSDataCollectionArbiter.m)
- [firebase_crashlytics.podspec in flutterfire](https://github.com/firebase/flutterfire/blob/main/packages/firebase_crashlytics/firebase_crashlytics/ios/firebase_crashlytics.podspec)
- [ADR-0034 in the app repo](https://github.com/maximsan/brewpath/blob/main/docs/adr/0034-launch-sends-crash-reports-and-analytics-follows-in-the-first-update.md)
