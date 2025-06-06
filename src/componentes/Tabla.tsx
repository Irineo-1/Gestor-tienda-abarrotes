import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, TableSortLabel, IconButton
} from "@mui/material";
import { HeadersTabla } from "../interfaces/Tabla";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IProducto } from "@/interfaces/Iproducto";
import { GramosToKilos } from "@/utils/convercion";

type props = {
  headers: HeadersTabla<IProducto>[]
  data: IProducto[]
  editData?: (row: IProducto) => void
  deleteData?: (row: IProducto) => void
  acciones: boolean
}

export default function Tabla({headers, data, editData, deleteData, acciones}: props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof IProducto>("nombre" as keyof IProducto);
  
  const handleRequestSort = (property: keyof IProducto) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = [...data].sort((a, b) => {   

    if (a[orderBy] == null && b[orderBy] == null) return 0;
    if (a[orderBy] == null) return order === "asc" ? -1 : 1;
    if (b[orderBy] == null) return order === "asc" ? 1 : -1;
    
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((column) => (
                <TableCell key={column.titulo}>
                  <TableSortLabel
                    active={orderBy === column.valor}
                    direction={orderBy === column.valor ? order : "asc"}
                    onClick={() => handleRequestSort(column.valor as keyof IProducto)}
                  >
                    {column.titulo.charAt(0).toUpperCase() + column.titulo.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
                {acciones &&
                  <TableCell>
                    <TableSortLabel>Acciones</TableSortLabel>
                  </TableCell>
                }
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
              <TableRow key={row.id}>
                {headers.map((header) => (
                  <TableCell key={header.valor as string}>
                    {
                      (header.titulo == "kilaje")
                      ?
                        GramosToKilos(Number(row[header.valor]))
                      :
                        row[header.valor]
                    }
                  </TableCell>
                ))}
                {acciones &&
                  <TableCell>
                    <IconButton aria-label="ver" color="primary" onClick={() => editData && editData(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="eliminar" color="error" onClick={() => deleteData && deleteData(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
