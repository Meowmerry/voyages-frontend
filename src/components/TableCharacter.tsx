/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Table, Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, TablePagination } from "@mui/material";
import { useGetOptionsQuery } from '../fetchAPI/fetchApiService'
import { useSelector } from "react-redux";
import { VoyageOptionsValue, Flatlabel, IsShowProp, Options } from '../share/TableRangeSliderType'
import { StyledTableRow } from "../styleMUI";
import Autocompleted from "./Autocompleted";
import { setValue } from "../redux/rangeSliderSlice";
import {fetchOptionsData} from '../fetchAPI/fetchOptionsData'
import { RootState } from "../redux/store";


const TableCharacter = () => {
  const datas = useSelector((state:RootState) =>  state.getOptions.value);
  const [optionsLabel, setOptionsLabel] = useState<Flatlabel[]>([]);

  const {data,isLoading,isSuccess } = useGetOptionsQuery(datas);
  const colunmName = ["Label", "Auto Complete", "Display"];
  const [isShow, setIsShow] = useState<IsShowProp>({});

  const [value, setValue] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Loading</h1>
      </div>
    );
  }
  console.log('optionsLabel', optionsLabel)
  useEffect(() => {
    if (isSuccess) {
      const fetchData = async () => {
        const options = await fetchOptionsData(data as Options);
        setOptionsLabel(options);
      }
      fetchData();
    }
  }, [isSuccess, data]);


  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };



  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {colunmName.map((value, key) => (
                <TableCell
                  key={"title-" + key}
                  style={{ width: "33%", color: "#389c90", borderRight: '1px solid #ddd' }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {optionsLabel?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
              return (
                (
                  <StyledTableRow
                    key={`row${row.key}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      style={{ cursor: "pointer" }}
                      // onClick={() => handleShowRangeSlide(row)}
                      component="th"
                      scope="row"
                    >
                      <div> {row.label}</div>
                    </TableCell>
                    <TableCell>
                      {isShow[row.key] &&
                          <Autocompleted
                            keyOption={row.key}
                            label={row.label}
                            value={value}
                            setValue={setValue}
                          />
                      }
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {/* {isShow[row.key] &&
                        <><div>{row.key}</div>
                          {rangeValue?.[row.key] && <div>{`${(rangeValue?.[row.key][0])} - ${(rangeValue?.[row.key][1])}`}</div>}
                          <div style={{ color: 'red' }}>{rangeValue && message}</div>
                        </>
                      } */}
                    </TableCell>
                  </StyledTableRow>
                )
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        spacing={2}
        margin={2}
        direction="row"
        justifyContent="flex-end"
      >
      Box
      </Stack>
    </Box>
  );
}

export default TableCharacter;