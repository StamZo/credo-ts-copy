import type { Extension as AsnExtension } from '@peculiar/asn1-x509';
import type { JsonGeneralNames, TextObject } from '@peculiar/x509';
import { Extension, GeneralNames } from '@peculiar/x509';
export declare class IssuerAlternativeNameExtension extends Extension {
    names: GeneralNames;
    static NAME: string;
    constructor(data: JsonGeneralNames | ArrayBufferLike, critical?: boolean);
    onInit(asn: AsnExtension): void;
    toTextObject(): TextObject;
}
