export function createFunction (code, errors) {
    try {
        return new Function(code)
    } catch (err) {
        console.log(err)
    }
}
