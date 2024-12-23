export interface InfoResponse {
    toon: ToonData,
    laff: LaffData,
    location: ToonLocationData,
    gags: GagsData,
    tasks: TaskData[],
    invasion: InvasionData,
}

export interface ToonData {
    id: string,
    name: string,
    species: string,
    headColor: string,
    style: string,
}

export interface LaffData {
    current: number,
    max: number,
}

export interface ToonLocationData {
    zone: string,
    neighborhood: string,
    district: string,
    instanceId: string | null
}

export interface GagsData {
    "Toon-Up": GagData | null,
    Trap: GagData | null,
    Lure: GagData | null,
    Sound: GagData | null,
    Throw: GagData | null,
    Squirt: GagData | null,
    Drop: GagData | null,
}

export interface GagData {
    gag: SingleGagData,
    organic: SingleGagData,
    experience: GagExperience,
}

export interface GagExperience {
    current: number,
    next: number,
}

export interface SingleGagData {
    level: number,
    name: string
}

export interface TaskData {
    objective: TaskObjective,
    from: TaskLocation,
    to: TaskLocation,
    reward: string,
    deletable: boolean,
}

export interface TaskObjective {
    text: string,
    where: string,
    progress: TaskProgress,
}

export interface TaskProgress {
    text: string,
    current: number,
    target: number,
}

export interface TaskLocation {
    name: string,
    building: string,
    zone: string,
    neighborhood: string,
}

export interface InvasionData {
    cog: string,
    quantity: number,
    mega: boolean
}