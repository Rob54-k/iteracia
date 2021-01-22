export interface DataForDialog {
    craneOne: [
        {car: string, submerged?: number, unload?: number}
    ];
    craneTwo: [
        {car: string, submerged?: number, unload?: number}
    ];
    date: {dateStart: string, dateEnd: string};
    fullName: string;
    id: number;
    total: {submerged: number, unload: number};
    typeCrane: string;
}
