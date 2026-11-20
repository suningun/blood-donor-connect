export const toFirestoreFields = (obj) => ({
    fields: Object.fromEntries(
        Object.entries(obj).map(([key, val]) => {
        if (typeof val === "string") return [key, { stringValue: val }];
        if (typeof val === "number") return [key, Number.isInteger(val) ? { integerValue: val } : { doubleValue: val }];
        if (typeof val === "boolean") return [key, { booleanValue: val }];
        if (val instanceof Date) return [key, { timestampValue: val.toISOString() }];
        return [key, { nullValue: null }];
        })
    ),
});

export const fromFirestoreDoc = (doc) => ({
    id: doc.name.split("/").pop(),
    ...Object.fromEntries(
        Object.entries(doc.fields ?? {}).map(([key, val]) => [
        key,
        val.stringValue ?? val.integerValue ?? val.booleanValue ?? val.timestampValue ?? null,
        ])
    ),
});