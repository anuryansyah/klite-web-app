import { FC, SetStateAction, Dispatch } from 'react';
import useDebounce from 'Components/Hooks/useDebounce';
import Flatpickr from "react-flatpickr";
import { Indonesian } from 'flatpickr/dist/l10n/id.js';

interface Props {
  filter: any;
  setFilter: Dispatch<SetStateAction<any>>;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
}

const Filter: FC<Props> = ({ filter, setFilter, setLoadingData }) => {
  const debounceLoadingData = useDebounce(() => {
    setLoadingData(true);
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilter((prev: any) => ({ ...prev, [name]: value }));
    if (name === 'keywords') {
      debounceLoadingData();
    } else {
      setLoadingData(true);
    }
  };  

  const handleDateChange = (date: any, name: any) => {
    setFilter((prev: any) => ({ ...prev, [name]: date }));
    setLoadingData(true);
  };

  return (
    <div className='d-flex gap-3'>
      <div className="w-50">
        <input
          className="form-control"
          name="keywords"
          placeholder="Cari..."
          value={filter.keywords}
          onChange={handleChange}
        />
      </div>
      <div className='w-50'>
        <div className="input-group">
          <Flatpickr
            value={filter.startDate}
            placeholder='Tanggal Mulai'
            className="form-control"
            options={{
              dateFormat: "d M Y",
              locale: Indonesian
            }}
            onChange={(date) => handleDateChange(date[0], 'startDate')}
          />
          <button 
            className="btn btn-soft-danger border"
            onClick={() => handleDateChange('', 'startDate')}
          >
            <i className="ri-close-circle-line align-middle" />
          </button>
        </div>
      </div>
      <div className='w-50'>
        <div className="input-group">
          <Flatpickr
            value={filter.endDate}
            placeholder='Tanggal Akhir'
            className="form-control"
            options={{
              dateFormat: "d M Y",
              locale: Indonesian
            }}
            onChange={(date) => handleDateChange(date[0], 'endDate')}
          />
          <button 
            className="btn btn-soft-danger border"
            onClick={() => handleDateChange('', 'endDate')}
          >
            <i className="ri-close-circle-line align-middle" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Filter;