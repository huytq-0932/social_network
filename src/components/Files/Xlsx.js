import XLSX from 'xlsx';

export default class xlsxReader {
    static readFileFromInput = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = ({
                target: {
                    result
                }
            }) => {
                const wb = XLSX.read(result, {
                    type: rABS ? "binary" : "array",
                    cellDates: true,
                    dateNF: 'yyyy/mm/dd;@'
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, {
                    header: 1
                });
                resolve(data)
            };
            reader.onabort = () => {
                reject()
                console.log('file reading was aborted');
            }
            reader.onerror = () => {
                reject()
                console.log('file reading has failed');
            }

            if (rABS) reader.readAsBinaryString(file);
            else reader.readAsArrayBuffer(file);
        })
    }
}