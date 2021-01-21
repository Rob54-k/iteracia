// export class DataSourceListShiftModel {
//     public fullName: string = null;
//     public dateStart: string = null;
//     public dateEnd: string = null;
//     public typeCrane: string = null;
//     public submerged: number = null;
//     public unloaded: number = null;
//
//     constructor(data) {
//         if (data) {
//             this.data = data;
//         }
//     }
//
//     get data() {
//         return {
//             fullName: this.fullName,
//             dateStart: this.dateStart,
//             dateEnd: this.dateEnd,
//             typeCrane: this.typeCrane,
//             submerged: this.submerged,
//             unloaded: this.unloaded,
//         };
//     }
//
//     set data(data) {
//         console.log(data);
//         if (!data) {
//             return;
//         }
//
//         if (data.hasOwnProperty('fullName')) {
//             this.fullName = data.fullName;
//         }
//         if (data.hasOwnProperty('date')) {
//             this.dateStart = data.date.dataStart;
//         }
//         if (data.hasOwnProperty('dateEnd')) {
//             this.dateEnd = data.date.datedateEnd;
//         }
//         if (data.hasOwnProperty('typeCrane')) {
//             this.typeCrane = data.typeCrane;
//         }
//         if (data.hasOwnProperty('total')) {
//             this.submerged = data.total.submerged;
//         }
//         if (data.hasOwnProperty('total')) {
//             this.unloaded = data.total.unloaded;
//         }
//     }
// }
