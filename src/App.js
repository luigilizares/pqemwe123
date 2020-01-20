// @flow
import React, { useState } from "react";
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import readXlsxFile from "read-excel-file";
// import jexcel from "json2excel";
import XLSX from "xlsx";

const App = () => {
  const [state, setState] = useState({
    loading: false,
    data: []
  });

  const handleOnChange = e => {
    setState({ loading: true });
    const data = [];
    readXlsxFile(e.target.files[0]).then(rows => {
      // `rows` is an array of rows
      // each row being an array of cells.
      //setState({ loading: false, data: rows });

      rows.forEach((element, index) => {
        const persona = {
          codigo: element[1],
          apellidoMaterno: element[2],
          apellidoPaterno: element[3],
          nombres: element[4],
          fecha: element[9],
          horaIngreso: element[10]
        };

        if (index > 0) {
          if (
            data.length > 0 &&
            data[data.length - 1].codigo === persona.codigo
          ) {
            data[data.length - 1].horaSalida = persona.horaIngreso;
          } else {
            data.push(persona);
          }
        }
      });
      setState({ loading: false, data: data });
    });
  };

  const handleDownload = () => {
    const createXLSLFormatObj = [];

    const xlsHeader = [
      "Código",
      "Apellido Paterno",
      "Apellido Materno",
      "Nombres",
      "Fecha",
      "Hora de Ingreso",
      "Hora de Salida"
    ];

    createXLSLFormatObj.push(xlsHeader);

    state.data.forEach((value, index) => {
      const innerRowData = [];

      Object.keys(value).forEach(function(key, idx) {
        innerRowData.push(value[key]);
      });

      console.log(innerRowData);

      createXLSLFormatObj.push(innerRowData);
    });

    /* File Name */
    const filename = "FreakyJSON_To_XLS.xlsx";

    /* Sheet Name */
    const ws_name = "FreakySheet";

    if (typeof console !== "undefined") console.log(new Date());
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* Write workbook and Download */
    if (typeof console !== "undefined") console.log(new Date());
    XLSX.writeFile(wb, filename);
    if (typeof console !== "undefined") console.log(new Date());

    // var data = {
    //   sheets: [
    //     {
    //       header: {
    //         codigo: "Código",
    //         apellidoPaterno: "Apellido Paterno",
    //         apellidoMaterno: "Apellido Materno",
    //         nombres: "Nombres",
    //         fecha: "Fecha",
    //         horaIngreso: "Hora de Ingreso",
    //         horaSalida: "Hora de Salida"
    //       },
    //       items: state.data,
    //       sheetName: "sheet1"
    //     }
    //   ],
    //   filepath: "j2x.xlsx"
    // };

    // jexcel.j2e(data, function(err) {
    //   console.log(err);
    //   console.log("finish");
    // });
  };

  return (
    <div>
      <input type="file" id="input" onChange={handleOnChange} />
      {state.loading && <div>Cargando...</div>}
      <button onClick={handleDownload}>descargar</button>
    </div>
  );
};

export default App;
