import { noop } from "../src/util";
import { createContext } from "../src/createContext";
const Empty = 0;
const Pending = 1;
const Resolved = 2;
const Rejected = 3;

export function createResource(loadResource, hash) {
    const resource = {
        read(cache, key) {
            if (hash === undefined) {
                return cache.read(resource, key, loadResource, key);
            }
            const hashedKey = hash(key);
            return cache.read(resource, hashedKey, loadResource, key);
        },
        preload(cache, key) {
            if (hash === undefined) {

                cache.preload(resource, key, loadResource, key);
                return;
            }
            const hashedKey = hash(key);
            cache.preload(resource, hashedKey, loadResource, key);
        },
    };
    return resource;
}

let CACHE_TYPE = 0xcac4e;


export function createCache(invalidator) {
    const resourceCache = new Map();

    function getRecord(resourceType, key) {
        let recordCache = resourceCache.get(resourceType);
        if (recordCache !== undefined) {
            const record = recordCache.get(key);
            if (record !== undefined) {
                return record;
            }
        } else {
            recordCache = new Map();
            resourceCache.set(resourceType, recordCache);
        }

        const record = {
            status: Empty,
            suspender: null,
            value: null,
            error: null,
        };
        recordCache.set(key, record);
        return record;
    }

    function load(emptyRecord, suspender) {
        const pendingRecord = emptyRecord;
        pendingRecord.status = Pending;
        pendingRecord.suspender = suspender;
        suspender.then(
            value => {
                // Resource loaded successfully.
                const resolvedRecord = pendingRecord;
                resolvedRecord.status = Resolved;
                resolvedRecord.suspender = null;
                resolvedRecord.value = value;
            },
            error => {
                // Resource failed to load. Stash the error for later so we can throw it
                // the next time it's requested.
                const rejectedRecord = pendingRecord;
                rejectedRecord.status = Rejected;
                rejectedRecord.suspender = null;
                rejectedRecord.error = error;
            }
        );
    }

    const cache = {
        invalidate() {
            invalidator();
        },
        preload(resourceType, key, miss, missArg) {
            const record = getRecord(resourceType, key);
            switch (record.status) {
            case Empty:
                // Warm the cache.
                var suspender = miss(missArg);
                load(record, suspender);
                return;
            case Pending:
                // There's already a pending request.
                return;
            case Resolved:
                // The resource is already in the cache.
                return;
            case Rejected:
                // The request failed.
                return;
            }
        },
        read(resourceType, key, miss, missArg) {
            const record = getRecord(resourceType, key);
            switch (record.status) {
            case Empty:
                // Load the requested resource.
                var suspender = miss(missArg);
                load(record, suspender);
                throw suspender;
            case Pending:
                // There's already a pending request.
                throw record.suspender;
            case Resolved:
                return record.value;
            case Rejected:
            default:
                // The requested resource previously failed loading.
                var error = record.error;
                throw error;
            }
        },
    };

    cache.$$typeof = CACHE_TYPE;

    return cache;
}
const globalCache = createCache(noop);
export const SimpleCache = createContext(globalCache);

// https://dev.to/swyx/a-walkthrough-of-that-react-suspense-demo--4j6ahttps://dev.to/swyx/a-walkthrough-of-that-react-suspense-demo--4j6a