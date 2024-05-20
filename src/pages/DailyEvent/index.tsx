import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row } from "reactstrap";
import { useTable } from "react-table";
import { WEB_TITLE } from "Components/constants/general";
import BreadCrumb from "Components/Common/BreadCrumb";
import Filter from "./Filter";
import { timeFormat } from "utils/timeFormat";
import ModalForm from "./ModalForm";
import DailyEventAPI from "helpers/api/dailyEvent";
import { getDayName } from "utils/dayFormat";
import { MODALACTION } from "config/constant";
import Swal from 'sweetalert2'

const { CREATE, EDIT } = MODALACTION

const DailyEvent = () => {
  document.title = `Acara Harian | ${WEB_TITLE}`;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  // Navigation arrows enable/disable state
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);
  // Onclick handlers for the butons
  const onNextPage = () => {
    setCurrentPage(currentPage + 1);
    setLoadingData(true);
  };
  const onPrevPage = () => {
    setCurrentPage(currentPage - 1);
    setLoadingData(true);
  };
  // Disable previous and next buttons in the first and last page respectively
  useEffect(() => {
    if (totalPage === currentPage) {
      setCanGoNext(false);
    } else {
      setCanGoNext(true);
    }
    if (currentPage === 1) {
      setCanGoBack(false);
    } else {
      setCanGoBack(true);
    }
  }, [totalPage, currentPage]);

  const [loadingData, setLoadingData] = useState(true);

  const [action, setAction] = useState('');
  
  const [showModalForm, setShowModalForm] = useState(false);
  const toggleModal = () => {
    setAction(CREATE);
    setShowModalForm((prevState) => !prevState);
  };

  const [selectedData, setSelectedData] = useState('');
  const toggleDetail = (id: string) => {
    setSelectedData(id);
    setAction(EDIT);
    setShowModalForm((prevState) => !prevState);
  }
  const toggleDelete = (id: string) => {
    Swal.fire({
      // title: "Are you sure?",
      text: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DailyEventAPI.delete({ id })
          .then((res: any) => {
            Swal.fire({ text: res.message, icon: "success" });
            setLoadingData(true);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({ text: err, icon: "error" });
          });
      }
    });
  }

  const [filter, setFilter] = useState({
    keywords: "",
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...filter,
      };
      await DailyEventAPI.getList(params)
        .then((res: any) => {
          setData(res.data);
          setTotalPage(res.totalPage);
          setTotalRow(res.totalRow);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
        });
    };
    if (loadingData) {
      getData();
    }
  }, [loadingData]);

  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: (d: any, i: number) => i + 1,
      },
      {
        Header: "Judul Acara",
        accessor: "title",
      },
      // {
      //   Header: "Deskripsi",
      //   accessor: "desc",
      // },
      {
        Header: "Penyiar",
        accessor: "announcer",
      },
      {
        Header: "Hari",
        accessor: (d: any) => {
          return getDayName(d.day);
        },
      },
      {
        Header: "Jam Mulai",
        accessor: "startHour",
      },
      {
        Header: "Jam Selesai",
        accessor: "endHour",
      },
      {
        Header: "Dibuat Pada",
        accessor: (d: any) => {
          return timeFormat({
            dateTime: d.createDate,
            formatStr: 'dd MMM yyyy',
          });
        },
      },
      {
        Header: "Dibuat Oleh",
        accessor: "createBy",
      },
      // {
      //   Header: "Diubah Pada",
      //   accessor: (d: any) => {
      //     return timeFormat({
      //       dateTime: d.updateDate,
      //       formatStr: 'dd MMM yyyy',
      //     }) || '';
      //   },
      // },
      // {
      //   Header: "Diubah Oleh",
      //   accessor: "update By",
      // },

      {
        Header: "Aksi",
        accessor: (d: any) => {
          return (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  toggleDetail(d.id);
                }}
              >
                Detail
              </button>
              <button
                onClick={() => toggleDelete(d.id)}
                className="btn btn-sm btn-soft-danger"
              >
                Hapus
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const { getTableProps, headerGroups, headers, prepareRow, rows } = useTable({ columns, data });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Acara Harian" pageTitle="K-LITE" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <Filter filter={filter} setFilter={setFilter} setLoadingData={setLoadingData} />
                    <button className="btn btn-soft-primary" onClick={toggleModal}>
                      <i className="ri-add-circle-line align-middle me-1" />
                      Tambah
                    </button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-hover" {...getTableProps()}>
                      <thead>
                        {headerGroups.map((headerGroup: any) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {loadingData ? (
                          <tr>
                            <td colSpan={headers.length} className="text-center">
                              <i className="fas fa-spinner fa-pulse me-2" />
                              Memuat data
                            </td>
                          </tr>
                        ) : (
                          (rows.length > 0 &&
                            rows.map((row: any, i: number) => {
                              prepareRow(row);
                              return (
                                <tr key={i} {...row.getRowProps()}>
                                  {row.cells.map((cell: any) => {
                                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                  })}
                                </tr>
                              );
                            })) || (
                            <tr>
                              <td colSpan={headers.length} className="text-center">
                                Data tidak tersedia.
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <select
                        className="form-select w-auto"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setLoadingData(true);
                        }}
                      >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                          </option>
                        ))}
                      </select>
                      <div>
                        Total Data:{' '}
                        <strong className=" text-nowrap ">
                          {totalRow}
                        </strong>
                      </div>
                    </div>
                    <div>
                      Page{" "}
                      <strong className=" text-nowrap ">
                        {currentPage} of {totalPage}
                      </strong>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={() => onPrevPage()} disabled={!canGoBack}>
                        <i className="ri-arrow-left-s-line align-middle" />
                      </button>
                      <button className="btn btn-primary" onClick={() => onNextPage()} disabled={!canGoNext}>
                        <i className="ri-arrow-right-s-line align-middle" />
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {showModalForm && (
        <ModalForm
          selectedData={selectedData}
          action={action}
          toggle={toggleModal}
          isOpen={showModalForm}
          setLoadingData={setLoadingData}
        />
      )}
    </React.Fragment>
  );
};

export default DailyEvent;
