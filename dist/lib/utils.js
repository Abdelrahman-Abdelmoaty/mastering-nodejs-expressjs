"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeFields = void 0;
function excludeFields(obj, keys) {
    const filteredEntries = Object.entries(obj).filter(([key]) => !keys.includes(key));
    return Object.fromEntries(filteredEntries);
}
exports.excludeFields = excludeFields;
//# sourceMappingURL=utils.js.map