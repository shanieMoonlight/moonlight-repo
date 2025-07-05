const nxPreset = require('@nx/jest/preset').default;

if (!global.structuredClone) {
    global.structuredClone = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => structuredClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    cloned[key] = structuredClone(obj[key]);
                }
            }
            return cloned;
        }
        return obj;
    };
}

module.exports = { ...nxPreset };
