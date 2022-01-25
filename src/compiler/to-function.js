export function createFunction (code, errors) {
    try {
        return new Function(code)
    } catch (err) {
        errors.push({ err, code })
        return noop
    }
}
