# RetroStore SDK

<img src="https://github.com/shaeberling/retrostore/raw/master/docs/retrostore_logo.png" width="300">

## General information

The following contains some general information. It is followed by a detailed documentation of the REST API.

### What is the RetroStore and the RetroStore SDK?

**RetroStore** aims to be an open source app store that is home to often long forgotten games and apps on platforms from our past.

We have developed a cloud component that is running on Google Engine which allows us to manage retro applications and games for multiple platforms

In addition we have developped an API that enables RetroStore to be integrated into other projects and products.

For example, today we have integrations into software emulators (such as the TES-80 Android emulator) as well as genuine historic hardware, such as the TRS-80 through the help of an expansion board. Both of these integrations use the RetroStore API.

### Who is this SDK for?

If you are looking to include RetroStore into your project - be it a software emulator or a hardware project - this is the place to be. This repository contains documenation on the API and the existing SDKs.

### What does this SDK contain?

The RetroStore SDK reposirory contains a detailed documentation of the RetroStore REST API. In addition this repository also contains the official implementations of SDKs that use the API. We aim to always keep the up to date and in sync with the API. For example, we have a Java API (which is used in the Android TRS-80 emulator) as well as a tiny C implementation that is running on an ESP32 microprocessor which is the heart of the RetroCard expansion board for the TRS-80.

### Which retro platforms are supported?

RetroStore and the API have been designed to be platform agnostic. We started out with the TRS-80 which is why this support is most complete. If you are working on a new platform (C64, CoCo, Amiga, etc) then please file a feature request here and/or reach out to [Sascha](mailto:sascha@retrostore.org) to start a discussion on what features need to be added. Likewise, if there are features missing from already-supported platforms, follow the same process.

### Where to start?

If you are looking into integrating the RetroStore, feel free to reach out to sascha@retrostore.org or open a feature request in this repository. We are happy to help you with the integration.

When starting a new integration, there are two things you need: RetroStore 
If your project uses Java or can make use of the C implementation, great, go right ahead and use it. Again, if you have problems free free to reach out.

If you need support for a language that we do not have an SDK for yet you can either go ahead and implement it yourself based on the REST API documentation in this repository, or open a feature request here and we will look into creating it for you. Consider submitting your down implementation if you end up doing it yourself so others can profit from your work.

## REST API v1

*Latest update: January 12 2019*

The REST API uses HTTP `GET` requests. Requests are to be in JSON format whereas the response is given through protocol buffer messages.

All protocol buffer message formats can be found in the `ApiProtos.proto` file.

* All requests are HTTP `GET` requests.
* The base URL format for all requests is: **`https://retrostore.org/api/{request}`**.
* The request data in form of the JSON request object is to be sent as the body of the request.

***Note:** If you require support for different formats for either requests or responses, please file a feature request.*

The following is a list of all requests currently supported by RetroStore.

## `listApps`
Returns a list apps from the RetroStore including basic listing information.

### Parameters

| Name               | Type       | Description |
| ------------------ | ---------- |-------------|
| `start`            | `int`      | The index (0-based) of the first item to return. This is based on current query and can be used for paging.|
| `num`              | `int`      | The number of items to return. This is based on current query and can be used for paging.|
| `query`            | `string`   | Queries several fields of the items. Currently supports **title** and **description**. |
| `trs80.mediaTypes` | `string[]` | A list of media types. Items returned must have at least one of the media types listed, but not all. (This is a logical *OR* on the types.|

### Response

A list of apps including their basic listing information:
```proto
message App {
    // The ID to uniquely identify an app.
    string id = 1;
    // The name of the app.
    string name = 2;
    // The human readable version of this app.
    string version = 3;
    // The description of this app.
    string description = 4;
    // The original release year of the app.
    int32 release_year = 5;
    // URLs to screenshots for this app.
    repeated string screenshot_url = 6;
    // The author of the app (not the uploader).
    string author = 7;
    // Extension set for TRS80 apps.
    Trs80Extension ext_trs80 = 8;
}
```

Whereas the Trs80Extension contains information specific to items for that platform. Mainly which type of model the items supports:

```proto
message Trs80Extension {
    // The TRS-80 model type.
    Trs80Model model = 1;

    // The TRS-80 model types.
    enum Trs80Model {
        UNKNOWN_MODEL = 0;
        MODEL_I = 1;
        MODEL_III = 2;
        MODEL_4 = 3;
        MODEL_4P = 4;
    }
}
```
## `getApp`

Returns data for a single app, excluding the disk images.

### Parameters

| Name    | Type       | Description |
| ------- | ---------- |-------------|
| `appId` | `string`   | The ID of the app for which detailed information is to be retrieved. |

## Response

A single instance of the `App` object described in [`listApps`](#listApps) response above.

## `fetchMediaImages`

Fetches media images for an app.

### Parameters
| Name    | Type       | Description |
| ------- | ---------- |-------------|
| `appId` | `string`   | The ID of the app for which the media images are to be retrieved. |

### Response

A list of media images of the following format:

```proto
message MediaImage {
    // The type of this media image.
    MediaType type = 1;
    // The file name of this media image.
    string filename = 2;
    // The actual data of this media image.
    bytes data = 3;
    // When the image was uploaded.
    int64 uploadTime = 4;
    // An optional description of this media image describing its contents.
    string description = 5;
}
```

Whereas the `MediaType` is an enum defined like this:
```proto
enum MediaType {
    UNKNOWN = 0;
    DISK = 1;
    CASSETTE = 2;
    COMMAND = 3;
    BASIC = 4;
}
```


### Updates

- ***January 12 2019***
Added support for BASIC files for the TRS-80 platform (backwards compatible).
