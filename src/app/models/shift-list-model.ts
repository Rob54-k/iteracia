export class ShiftListModel {
    public fullName: string;
    public dateStart: string;
    public dateEnd: string;
    public submerged: number;
    public unloaded: number;
    public typeCrane: string;
    public id: number;

    static prepareDate(data: any) {
        return  {
            fullName: data.fullName,
            dateStart: data.date.dateStart,
            dateEnd: data.date.dateEnd,
            submerged: data.total.submerged,
            unloaded: data.total.unload,
            typeCrane: data.typeCrane,
            id: data.id
        }
    }
}
