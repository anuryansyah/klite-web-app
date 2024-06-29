import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Col, Container, Row, Spinner, } from "reactstrap";
import { WEB_TITLE } from "Components/constants/general";
import BreadCrumb from "Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";

import "./styles.css";
import ScheduleAPI from "helpers/api/schedule";
import Swal from "sweetalert2";
import { format } from "date-fns";
import ModalForm from "./ModalForm";

const DailyEvent = () => {
  document.title = `Jadwal Acara | ${WEB_TITLE}`;
  
  const [date, setDate] = useState(new Date());
  const [disabled, setDisabled] = useState(false);
  const [selectedData, setSelectedData] = useState('');
  const [showModalForm, setShowModalForm] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [date]);

  const changeDate = (day: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + day);
    setDate(newDate);
    setLoadingData(true);
  };

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    const getData = async () => {
      const params = {
        date: format(date, 'yyyy-MM-dd'),
      };
      await ScheduleAPI.getList(params)
        .then((res: any) => {
          setData(res.data);
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
  
  const createEvent = async (type: string) => {
    const payload = {
      type,
      date: format(date, 'yyyy-MM-dd')
    }
    await ScheduleAPI.create(payload)
      .then((res: any) => {
        Swal.fire({ text: res.message, icon: "success" });
      })
      .catch((err) => {
        Swal.fire({ text: err, icon: "error" });
      });

    setLoadingData(true);
  }
  
  const handleNotification = async () => {
    const payload = {
      date: format(date, 'yyyy-MM-dd')
    }
    await ScheduleAPI.sendNotification(payload)
      .then((res: any) => {
        Swal.fire({ text: res.message, icon: "success" });
      })
      .catch((err) => {
        Swal.fire({ text: err, icon: "error" });
      });

    setLoadingData(true);
  }

  const toggleReset = () => {
    Swal.fire({
      // title: "Are you sure?",
      text: "Yakin ingin mereset jadwal hari ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const params = {
          date: format(date, 'yyyy-MM-dd')
        }
        await ScheduleAPI.reset(params)
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

  const toggleDelete = (id: string) => {
    Swal.fire({
      // title: "Are you sure?",
      text: "Yakin ingin menghapus acara ini dari jadwal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const params = { id }
        await ScheduleAPI.delete(params)
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

  const toggleModal = () => {
    setShowModalForm((prevState) => !prevState);
  };
  const toggleDetail = (id: string) => {
    setSelectedData(id);
    setShowModalForm((prevState) => !prevState);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Jadwal Acara" pageTitle="K-LITE" />

          <Row>
            <Col xl={3}>
              <Card>
                <CardBody className="date-picker-wrapper">
                  <Flatpickr
                    className="form-control schedule-event"
                    value={date}
                    options={{
                      dateFormat: "d M, Y",
                      inline: true,
                      locale: Indonesian,
                    }}
                    onChange={([selectedDate]) => {
                      setDate(selectedDate);
                      setLoadingData(true);
                    }}
                  />
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => createEvent('daily')}
                      disabled={disabled}
                    >
                      Dapatkan Acara Harian
                    </button>
                  </div>
                  <div className="mt-2">
                    <button 
                      className="btn btn-secondary w-100"
                      onClick={() => createEvent('special')}
                      disabled={disabled}
                    >
                      Dapatkan Acara Special
                    </button>
                  </div>
                  <div className="mt-2">
                    <button 
                      className="btn btn-danger w-100"
                      onClick={toggleReset}
                      disabled={disabled || data.length === 0}
                    >
                      Reset Acara
                    </button>
                  </div>
                </CardBody>
                <CardFooter>
                  <div>
                    <button 
                      className="btn btn-info w-100"
                      onClick={handleNotification}
                      disabled={disabled || data.length === 0}
                    >
                      Ingatkan Penyiar
                    </button>
                  </div>
                </CardFooter>
                <CardFooter>
                  <Row>
                    <Col>
                      <button className="btn btn-light w-100" onClick={() => changeDate(-1)}>
                        <i className="ri-arrow-left-s-line align-middle" />
                      </button>
                    </Col>
                    <Col>
                      {loadingData && (
                        <button className="btn btn-light w-100" disabled>
                          <Spinner size="sm" />
                        </button>
                      )}
                    </Col>
                    <Col>
                      <button className="btn btn-light w-100" onClick={() => changeDate(1)}>
                        <i className="ri-arrow-right-s-line align-middle" />
                      </button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
            <Col xl={9}>
              <Row>
                {!loadingData && (
                  data.length > 0 ? (
                    (data.map((item: any, i: number) => (
                      <Col xl={4} key={i}>
                        <Card className="card-height-100">
                          <CardBody>
                            <div className="d-flex flex-column h-100">
                              <div className="d-flex">
                                <div className="flex-grow-1">
                                  {item.category === 'Harian' ? (
                                    <span className="badge bg-primary-subtle text-primary p-2 mb-3">{item.category}</span>
                                  ) : (
                                    <span className="badge bg-secondary-subtle text-secondary p-2 mb-3">{item.category}</span>
                                  )}
                                </div>
                                <div className="flex-shrink-0">
                                  {item.conflict && <span className="badge bg-danger text-white p-2 mb-3">{item.conflict}</span>}
                                </div>

                              </div>
                              <div className="d-flex mb-2">
                                <div className="flex-grow-1">
                                  <p>{item.title}</p>
                                  <p className="text-muted text-truncate-two-lines mb-3">{item.desc}</p>
                                </div>
                              </div>
                              <div className="mt-auto">
                                {item.announcer}
                              </div>
                            </div>
                          </CardBody>
                          <div className="card-footer bg-transparent border-top-dashed py-2">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                <div className="text-muted">{item.startHour} - {item.endHour}</div>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="d-flex gap-1 align-items-center">
                                  {/* {!disabled && (
                                    <button className="btn btn-soft-info btn-sm" onClick={() => toggleDelete(item.id)}>
                                      <i className="ri-notification-line align-middle" />
                                    </button>
                                  )} */}
                                  <button className="btn btn-soft-secondary btn-sm" onClick={() => toggleDetail(item.id)}>
                                    <i className="ri-eye-line align-middle" />
                                  </button>
                                  {!disabled && (
                                    <button className="btn btn-soft-danger btn-sm" onClick={() => toggleDelete(item.id)}>
                                      <i className="ri-delete-bin-line align-middle" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    )))
                  ) : (
                    <div className="alert alert-warning text-center" role="alert">
                      Tidak ada acara. Silakan tambah acara.
                    </div>
                  )
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      {showModalForm && (
        <ModalForm
          selectedData={selectedData}
          toggle={toggleModal}
          isOpen={showModalForm}
          setLoadingData={setLoadingData}
        />
      )}
    </React.Fragment>
  );
};

export default DailyEvent;
