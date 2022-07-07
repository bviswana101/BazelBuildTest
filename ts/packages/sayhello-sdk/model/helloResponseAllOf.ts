/**
 *********************************************************************
 * Licensed Materials - Property of IBM
 * Restricted Materials of IBM
 * 5900-A1Y
 *
 * © Copyright IBM Corp. 2020 All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *********************************************************************
*/

/**
 * NOTE: This file is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * Do not edit this file manually.
 */

// @ts-ignore
import { RequestFile } from '../api';

export interface HelloResponseAllOf {
    /**
    * message
    */
    'message'?: HelloResponseAllOf.MessageEnum;
}

export class HelloResponseAllOfImpl implements HelloResponseAllOf {
    'message'?: HelloResponseAllOf.MessageEnum;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "message",
            "baseName": "message",
            "type": "HelloResponseAllOf.MessageEnum"
        }    ];

    static getAttributeTypeMap() {
        return HelloResponseAllOfImpl.attributeTypeMap;
    }
}

export namespace HelloResponseAllOf {
    export enum MessageEnum {
        Hi = 'hi',
        Hello = 'hello'
    }
}
