import UserAPI from "helpers/api/user";
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import DailyEventAPI from "helpers/api/dailyEvent";
import { MODALACTION } from "config/constant";
import { getDayName } from "utils/dayFormat";
import Swal from "sweetalert2";

const { CREATE, EDIT } = MODALACTION

interface Props {
  selectedData: any;
  action: any;
  toggle: any;
  isOpen: boolean;
  setLoadingData: any;
}

const ModalForm: FC<Props> = ({ selectedData, action, toggle, isOpen, setLoadingData }) => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    announcer: [],
    day: '',
    startHour: '00:00',
    endHour: '00:00',
  })
  const [selectedAnn, setSelectedAnn] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any>([]);

  const dayOpts = [
    { value: '1', label: 'Senin' },
    { value: '2', label: 'Selasa' },
    { value: '3', label: 'Rabu' },
    { value: '4', label: 'Kamis' },
    { value: '5', label: 'Jumat' },
    { value: '6', label: 'Sabtu' },
    { value: '7', label: 'Minggu' },
  ]

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(field => field !== '');
    setDisabled(!allFieldsFilled);
  }, [formData]);

  useEffect(() => {
    const getDetail = async () => {
      await DailyEventAPI.getDetail({ id: selectedData })
        .then((res: any) => {
          const data: any = res.data;
          const temp: { value: string; label: string }[] = [];

          data.announcer.map((item: any) => {
            temp.push({
              value: item.id,
              label: item.fullname
            })
            return null
          })
          
          setFormData((prev: any) => ({ 
            ...prev, 
            title: data.title, 
            desc: data.desc,
            announcer: data.announcer.map((item: any) => item.id),
            day: data.day, 
            startHour: data.startHour, 
            endHour: data.endHour, 
          }));
          setSelectedAnn(temp);
          setSelectedDay({
            value: data.day,
            label: getDayName(data.day)
          });
        })
        .catch((err) => console.log(err));
    };

    if (action === EDIT && selectedData) {
      getDetail();
    }
  }, [selectedData]);

  const [listAnn, setListAnn] = useState<any[]>([]);
  useEffect(() => {
    const getAnn = async () => {
      await UserAPI.getListAnn()
        .then((res: any) => {
          const temp: { value: string; label: string }[] = [];
          res.map((item: any) => {
            temp.push({
              value: item.id,
              label: item.fullname
            })
            return null
          })
          setListAnn(temp)
        })
        .catch((err) => console.log(err));
    };

    getAnn();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectAnnouncer = (data:any) => {
    const selectedValues = data.map((item: any) => item.value)
    setFormData((prev: any) => ({ ...prev, announcer: selectedValues }));
    setSelectedAnn(data);
  } 
  
  const handleSelectWeek = (data:any) => {
    setFormData((prev: any) => ({ ...prev, day: data.value }));
    setSelectedDay(data)
  }

  const handleSubmit = async () => {
    setLoading(true);
    setDisabled(true);

    const payload = {
      title: formData.title,
      desc: formData.desc,
      announcer: formData.announcer,
      day: formData.day,
      startHour: formData.startHour,
      endHour: formData.endHour,
    }
    
    if (action === CREATE) {
      await DailyEventAPI.create(payload)
        .then((res: any) => {
          Swal.fire({ text: res.message, icon: "success" });
          toggle();
          setLoadingData(true);
        })
        .catch((err) => {
          Swal.fire({ text: err, icon: "error" });
        });
    } else if(action === EDIT) {
      await DailyEventAPI.update({ id: selectedData }, payload)
        .then((res: any) => {
          Swal.fire({ text: res.message, icon: "success" });
          toggle();
          setLoadingData(true);
        })
        .catch((err) => {
          Swal.fire({ text: err, icon: "error" });
        });
    }
    
  }

  return (
    <Modal isOpen={isOpen} toggle={() => toggle()} size="md">
      <ModalHeader toggle={() => toggle()}>{action === CREATE ? 'Tambah Acara' : 'Detail Acara'}</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Judul <span className="text-danger">*</span>
            </label>
            <input
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Deskripsi <span className="text-danger">*</span>
            </label>
            <textarea 
              name="desc" 
              className="form-control"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Penyiar <span className="text-danger">*</span>
            </label>
            <Select 
              value={selectedAnn}
              options={listAnn}
              isMulti
              onChange={(selected:any) => handleSelectAnnouncer(selected)}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Hari <span className="text-danger">*</span>
            </label>
            <Select 
              value={selectedDay}
              options={dayOpts}
              onChange={(selected:any) => handleSelectWeek(selected)}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Jam Mulai <span className="text-danger">*</span>
            </label>
            <Flatpickr
              data-provider="timepickr"
              data-time-inline="00:00"
              value={formData.startHour}
              className="form-control"
              options={{
                inline: true,
                enableTime: true,
                noCalendar: true,
                time_24hr: true
              }}
              onChange={(date, time) => {
                setFormData((prev: any) => ({ ...prev, startHour: time }));
              }}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Jam Selesai <span className="text-danger">*</span>
            </label>
            <Flatpickr
              data-provider="timepickr"
              data-time-inline="00:00"
              value={formData.endHour}
              className="form-control"
              options={{
                inline: true,
                enableTime: true,
                noCalendar: true,
                time_24hr: true
              }}
              onChange={(date, time) => {
                setFormData((prev: any) => ({ ...prev, endHour: time }));
              }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn btn-soft-danger btn-sm"
          onClick={() => toggle()}
        >
          Batal
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={disabled}
          onClick={handleSubmit}
        >
          {loading ? <Spinner size="sm" /> : 'Simpan'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalForm;
