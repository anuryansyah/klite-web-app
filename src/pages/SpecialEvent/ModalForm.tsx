import UserAPI from "helpers/api/user";
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { MODALACTION } from "config/constant";
import Swal from "sweetalert2";
import { Indonesian } from 'flatpickr/dist/l10n/id.js';
import SpecialEventAPI from "helpers/api/specialEvent";
import { format } from "date-fns";

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
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    announcer: [],
    date: '',
    startHour: '',
    endHour: '',
  })
  const [selectedAnn, setSelectedAnn] = useState<any>([]);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(field => field !== '');
    setDisabled(!allFieldsFilled);
  }, [formData]);

  useEffect(() => {
    const getDetail = async () => {
      await SpecialEventAPI.getDetail({ id: selectedData })
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
            type: data.type,
            announcer: data.announcer.map((item: any) => item.id),
            date: data.date,
            startHour: data.startHour, 
            endHour: data.endHour, 
          }));
          setSelectedAnn(temp);

          setLoadingDetail(false);
        })
        .catch((err) => console.log(err));
    };

    if (action === EDIT && selectedData) {
      getDetail();
    } else {
      setLoadingDetail(false);
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

  const [conflictHour, setConflictHour] = useState('')
  const handleChangeHour = (time: any) => {
    setFormData((prev: any) => ({ ...prev, endHour: time }));
    time <= formData.startHour ? setConflictHour('Jam Selesai tidak bisa lebih awal dari Jam Mulai.') : setConflictHour('');
  }
  
  const handleSelectAnnouncer = (data:any) => {
    const selectedValues = data.map((item: any) => item.value)
    setFormData((prev: any) => ({ ...prev, announcer: selectedValues }));
    setSelectedAnn(data);
  }

  const handleDateChange = (date: any, name: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setDisabled(true);

    const payload = {
      title: formData.title,
      desc: formData.desc,
      announcer: formData.announcer,
      date: format(formData.date, 'yyyy-MM-dd') ,
      startHour: formData.startHour,
      endHour: formData.endHour,
    }
    
    if (action === CREATE) {
      await SpecialEventAPI.create(payload)
        .then((res: any) => {
          Swal.fire({ text: res.message, icon: "success" });
          toggle();
          setLoadingData(true);
        })
        .catch((err) => {
          Swal.fire({ text: err, icon: "error" });
        });
    } else if(action === EDIT) {
      await SpecialEventAPI.update({ id: selectedData }, payload)
        .then((res: any) => {
          Swal.fire({ text: res.message, icon: "success" });
          toggle();
          setLoadingData(true);
        })
        .catch((err) => {
          Swal.fire({ text: err, icon: "error" });
        });
    }

    setLoading(false);
    setDisabled(false);
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
              Tanggal <span className="text-danger">*</span>
            </label>
            <Flatpickr
              value={formData.date}
              placeholder='Tanggal Acara'
              className="form-control"
              options={{
                dateFormat: "d M Y",
                locale: Indonesian
              }}
              onChange={(date) => handleDateChange(date[0], 'date')}
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
              onChange={(date, time) => handleChangeHour(time)}
            />
          </div>
        </div>
        {conflictHour && (
          <div className="alert alert-danger text-center" role="alert">
            {conflictHour}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {loadingDetail && (
          <button
            className="btn btn-light btn-sm"
            disabled
          >
            <Spinner size="sm" />
          </button>
        )}

        <button
          className="btn btn-soft-danger btn-sm"
          onClick={() => toggle()}
        >
          Batal
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={disabled || conflictHour !== ''}
          onClick={handleSubmit}
        >
          {loading ? <Spinner size="sm" /> : 'Simpan'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalForm;
