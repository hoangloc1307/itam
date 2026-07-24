export const ATTRIBUTE_DATA_TYPES = ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'BOOLEAN'] as const;
export type AttributeDataType = (typeof ATTRIBUTE_DATA_TYPES)[number];
