import React from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { WEB_TITLE } from "Components/constants/general";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import listPlugin from '@fullcalendar/list';

// "@fullcalendar/bootstrap": "^6.1.9",
// "@fullcalendar/core": "^6.1.9",
// "@fullcalendar/daygrid": "^6.1.9",
// "@fullcalendar/interaction": "^6.1.9",
// "@fullcalendar/list": "^6.1.9",
// "@fullcalendar/react": "^6.1.9",

const Dashboard = () => {
  document.title = `Dashboard | ${WEB_TITLE}`;

  const events = [
    {
      id: 'p',
      title: 'Papap Jadi Freeman',
      start: '2024-05-18',
      className: "bg-primary-subtle text-primary"
    },
    {
      id: 'a',
      title: 'Bareng Ima',
      start: '2024-05-23',
      className: "bg-primary-subtle text-primary"
    },
    {
      id: 'b',
      title: 'Ngopskuy',
      start: '2024-05-23',
      className: "bg-primary-subtle text-primary"
    },
  ]

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
              <p className="mb-0">Ini adalah Quote</p>
              <p className="text-muted mb-0">Penulis Quote</p>
            </Col>
          </Row>

          <Row>
            <Col xl={9}>
              <Card className="card-h-100">
                <CardBody>
                  <FullCalendar
                    plugins={[
                      BootstrapTheme,
                      dayGridPlugin,
                      interactionPlugin,
                      listPlugin
                    ]}
                    initialView="dayGridMonth"
                    slotDuration={"00:15:00"}
                    handleWindowResize={true}
                    themeSystem="bootstrap"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                    }}
                    events={events}
                    editable={false}
                    droppable={false}
                    selectable={true}
                    dateClick={(arg: any) => console.log(arg.dateStr)}
                    // eventClick={(arg: any) => console.log(arg.event.title)}
                    // drop={onDrop}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col xl={3}>
              <Card>
                <CardHeader className="text-center fw-semibold">Jadwal Saya</CardHeader>
                <CardBody>
                  <p className="text-center text-muted m-0">Tidak ada jadwal hari ini.</p>
                </CardBody>
              </Card>
              <Card>
                <CardHeader className="text-center fw-semibold">Program Spesial</CardHeader>
                <CardBody>
                  <p className="text-center text-muted m-0">Tidak ada Program Spesial hari ini.</p>
                </CardBody>
              </Card>
              <Card>
                <CardHeader className="text-center fw-semibold">Program Harian</CardHeader>
                <CardBody>
                  <p className="text-center text-muted m-0">Tidak ada Program Harian hari ini.</p>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
