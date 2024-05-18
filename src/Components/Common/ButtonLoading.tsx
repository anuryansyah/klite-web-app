import React from "react";
import { Button, Spinner } from "reactstrap";

interface ButtonLoadingProps {
  title: string;
  loading: boolean;
  className?: string;
  onClick?: () => void;
  color: string;
}

const ButtonLoading = ({ title, loading, className, onClick, color }: ButtonLoadingProps) => {
  return (
    <React.Fragment>
      <Button color={color} className={className} type="button" disabled={loading && true} onClick={onClick}>
        {loading && (
          <Spinner size="sm" />
        )}
        {!loading && title}
      </Button>
    </React.Fragment>
  );
};

export default ButtonLoading;
