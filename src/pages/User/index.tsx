import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader, Col, Container, Row } from "reactstrap";
import { useTable } from "react-table";
import { WEB_TITLE } from "Components/constants/general";
import BreadCrumb from "Components/Common/BreadCrumb";
import UserAPI from "helpers/api/user";
import Filter from "./Filter";
import { timeFormat } from "utils/timeFormat";
import ModalForm from "./ModalForm";
import Swal from "sweetalert2";

const User = () => {
  document.title = `User | ${WEB_TITLE}`;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
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

  const [showModalAdd, setShowModalAdd] = useState(false);

  const toggleModal = () => {
    setShowModalAdd((prevState) => !prevState);
  };

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
      await UserAPI.getList(params)
        .then((res: any) => {
          setData(res.data);
          setTotalPage(res.totalPage);
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

  const toggleDelete = (id: string) => {
    Swal.fire({
      text: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const params = { id }
        await UserAPI.delete(params)
          .then((res: any) => {
            Swal.fire({ text: res.message, icon: "success" });
            setLoadingData(true);
          })
          .catch((err: any) => {
            console.log(err);
            Swal.fire({ text: err, icon: "error" });
          });
      }
    });
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "No",
        accessor: (d: any, i: number) => i + 1,
      },
      {
        Header: "Nama Lengkap",
        accessor: "fullname",
      },
      {
        Header: "Email",
        accessor: "username",
      },
      {
        Header: "No. Handphone",
        accessor: "phoneNumber",
      },
      {
        Header: "Role",
        accessor: "role.roleDesc",
      },
      {
        Header: "Notifikasi",
        accessor: (d: any) => {
          return d.notification ? <span className="badge bg-success p-2">Ya</span> : <span className="badge bg-danger p-2">Tidak</span>
        },
      },
      {
        Header: "Status",
        accessor: (d: any) => {
          switch (d.status) {
            case 0:
              return <span className="badge bg-info p-2">Baru</span>;
            case 1:
              return <span className="badge bg-success p-2">Aktif</span>;
            default:
              return <span className="badge bg-danger p-2">Non-Aktif</span>;
          }
        },
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
        Header: "Aksi",
        accessor: (d: any) => {
          return (
            <div className="d-flex gap-1">
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
          <BreadCrumb title="User" pageTitle="K-LITE" />

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
      {showModalAdd && (
        <ModalForm
          toggle={toggleModal}
          isOpen={showModalAdd}
          setLoadingData={setLoadingData}
        />
      )}
    </React.Fragment>
  );
};

export default User;
