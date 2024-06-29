import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { WEB_TITLE } from "Components/constants/general";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import idLocale from "@fullcalendar/core/locales/id";
import DashboardAPI from "helpers/api/dashboard";
import { format } from "date-fns";
import ScheduleAPI from "helpers/api/schedule";
import { EVENT_TYPE } from "config/constant";

const Dashboard = () => {
  document.title = `Dashboard | ${WEB_TITLE}`;

  const [date, setDate] = useState(new Date());

  const [data, setData] = useState({
    isAnnouncer: false,
    schedule: [],
    events: [],
  });
  useEffect(() => {
    const getData = async () => {
      await DashboardAPI.get({})
        .then((res: any) => {
          setData(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    getData();
  }, []);

  const [eventData, setEventData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const params = {
        date: format(date, "yyyy-MM-dd"),
      };
      await ScheduleAPI.getListByUser(params)
        .then((res: any) => {
          setEventData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
  }, [date]);

  const getType = (type: string) => {
    switch (type) {
      case EVENT_TYPE.PAID:
        return 'Berbayar'
      case EVENT_TYPE.SEMI_BARTER:
        return 'Semi Barter'
      case EVENT_TYPE.FULL_BARTER:
        return 'Full Barter'
      default:
        break;
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mb-3 pb-1">
            <Col md={6}>
              <p className="fs-16 mb-1">Selamat Datang!</p>
              <p className="text-muted mb-0">Selamat Beraktivitas.</p>
            </Col>
            <Col md={6} className="text-end">
              <p className="mb-0">BOT Telegram</p>
              <a href="https://t.me/kliteEvent_bot" target="_blank" rel="noreferrer">@KliteEvent_bot</a>
            </Col>
          </Row>

          <Row>
            <Col xl={data.isAnnouncer ? 9 : 12}>
              <Card>
                <CardBody>
                  <FullCalendar
                    contentHeight={"auto"}
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    // slotDuration={"00:15:00"}
                    handleWindowResize={true}
                    themeSystem="bootstrap"
                    headerToolbar={{
                      left: "prev,next",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek,dayGridDay",
                    }}
                    locale={idLocale}
                    events={data.events}
                    // editable={false}
                    // droppable={false}
                    selectable={true}
                    dateClick={(arg: any) => setDate(arg.date)}
                    eventClick={(arg: any) => console.log(arg.event.title)}
                    // drop={onDrop}
                  />
                </CardBody>
              </Card>
            </Col>
            {data.isAnnouncer && (
              <Col xl={3}>
                <Card>
                  <CardHeader className="text-center fw-semibold">Jadwal Saya Hari Ini</CardHeader>
                  <CardBody className="pt-0">
                    <div className="list-group list-group-flush border-dashed">
                      {data.schedule.length > 0 ? (
                        data.schedule.map((item: any, i: number) => (
                          <div className="list-group-item px-0 py-3" key={i}>
                            <Row className="align-items-center g-3">
                              <div className="col">
                                <p className="m-0">{item.title}</p>
                              </div>
                              <div className="col-sm-auto">
                                <p className="text-muted m-0">
                                  {item.startHour} - {item.endHour}
                                </p>
                              </div>
                            </Row>
                          </div>
                        ))
                      ) : (
                        <div className="list-group-item px-0 py-3 text-center">
                          <p className="text-center text-muted m-0">Tidak ada jadwal hari ini.</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>

          <Row>
            {eventData.map((item: any, i: number) => (
              <Col xl={3} key={i}>
                <Card className="card-height-100">
                  <CardBody>
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <span className="badge bg-primary-subtle text-primary p-2 mb-3">{item.category}</span>
                        </div>
                        <div className="flex-shrink-0">{item.typeEvent && <span className="badge bg-secondary-subtle text-secondary p-2 mb-3">{getType(item.typeEvent)}</span>}</div>
                      </div>
                      <div className="d-flex mb-2">
                        <div className="flex-grow-1">
                          <p>{item.title}</p>
                          <p className="text-muted text-truncate-two-lines mb-3">{item.desc}</p>
                        </div>
                      </div>
                      <div className="mt-auto">{item.announcer}</div>
                    </div>
                  </CardBody>
                  <div className="card-footer bg-transparent border-top-dashed py-2">
                    <div className="text-muted text-center">
                      {item.startHour} - {item.endHour}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
