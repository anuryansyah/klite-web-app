import RoleAPI from "helpers/api/role";
import UserAPI from "helpers/api/user";
import { FC, useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import { ToastContainer, toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface Props {
  toggle: any;
  isOpen: boolean;
  setLoadingData: any;
}

const ModalForm: FC<Props> = ({ toggle, isOpen, setLoadingData }) => {
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phoneNumber: '',
    role: '',
  })

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(field => field !== '');
    setDisabled(!allFieldsFilled);
  }, [formData]);

  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const getRoles = async () => {
      await RoleAPI.getList()
        .then((res: any) => {
          setRoles(res.data)
        })
        .catch((err) => console.log(err));
    };

    getRoles();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const regEmail = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    if (!regEmail.test(formData.username)) {
      toast('Email tidak valid, isikan email dengan benar', { position: "top-right", hideProgressBar: true, className: 'bg-danger text-white' });
      return null;
    }

    const payload = {
      username: formData.username,
      fullname: formData.fullname,
      phoneNumber: formData.phoneNumber,
      roleId: formData.role,
    }
    
    await UserAPI.create(payload)
      .then((res: any) => {
        toast(res.message, { position: "top-right", hideProgressBar: true, className: 'bg-successs text-white' });
        toggle();
        setLoadingData(true);
      })
      .catch((err) => {
        toast(err, { position: "top-right", hideProgressBar: true, className: 'bg-danger text-white' });
      });
    
  }

  return (
    <Modal isOpen={isOpen} toggle={() => toggle()} size="md">
      <ModalHeader toggle={() => toggle()}>Tambah User</ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Nama Lengkap <span className="text-danger">*</span>
            </label>
            <input
              name="fullname"
              type="text"
              className="form-control"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              No. Handphone <span className="text-danger">*</span>
            </label>
            <PhoneInput
              defaultCountry="id"
              value={formData.phoneNumber}
              onChange={(phone) => setFormData((prev: any) => ({ ...prev, phoneNumber: phone }))}
              hideDropdown={true}
              inputClassName="form-control py-2"
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Role <span className="text-danger">*</span>
            </label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              {roles.map((d: any, i: number) => (
                <option value={d.id} key={d.id}>{d.roleDesc}</option>
              ))}
            </select>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn btn-soft-danger btn-sm"
          onClick={() => toggle()}
        >
          <i className="fa fa-times"></i> Batal
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={disabled}
          onClick={handleSubmit}
        >
          <i className="fa fa-check"></i> Simpan
        </button>
      </ModalFooter>
      <ToastContainer />
    </Modal>
  );
};

export default ModalForm;
