export function getPid(id: string) {
    return id.split('.')[0]
}

export function getGuid(id: string) {
    return id.split('.')[1]
}

export function buildId(pid: string, guid: string) {
    return `${pid}.${guid}`
}