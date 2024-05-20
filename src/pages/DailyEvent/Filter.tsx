import { FC, SetStateAction, Dispatch } from 'react';
import useDebounce from 'Components/Hooks/useDebounce';

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

  return (
    <div>
      <div className="col-auto">
        <input
          className="form-control"
          name="keywords"
          placeholder="Cari..."
          value={filter.keywords}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Filter;