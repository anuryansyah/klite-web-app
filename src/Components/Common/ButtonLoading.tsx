import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, Spinner } from "reactstrap";

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
          <Spinner size="sm" className="me-2" />
        )}
        {!loading && title}
      </Button>
    </React.Fragment>
  );
};

export default ButtonLoading;
