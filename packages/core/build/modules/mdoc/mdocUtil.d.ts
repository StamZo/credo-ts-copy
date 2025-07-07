export declare function nameSpacesRecordToMap<NamespaceValue, NameSpaces extends Record<string, Record<string, NamespaceValue>>>(nameSpaces: NameSpaces): Map<string, Map<string, NamespaceValue>>;
export declare function namespacesMapToRecord<NamespaceValue, NameSpaces extends Map<string, Map<string, NamespaceValue>>>(nameSpaces: NameSpaces): Record<string, Record<string, NamespaceValue>>;
