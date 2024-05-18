import React, { useEffect } from "react";
// import { Offcanvas, OffcanvasHeader, OffcanvasBody, Collapse } from "reactstrap";
import withRouter from "./withRouter";

//redux
// import {
//   changeSidebarTheme,
// } from "../../slices/thunks";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const RightSidebar = (props: any) => {
  // const dispatch: any = useDispatch();

  // const [show, setShow] = useState(false);

  // function tog_show() {
  //   setShow(!show);
  //   dispatch(changeSidebarTheme("gradient"));
  // }

  // useEffect(() => {
  //   const sidebarColorDark = document.getElementById("sidebar-color-dark") as HTMLInputElement;
  //   const sidebarColorLight = document.getElementById("sidebar-color-light") as HTMLInputElement;

  //   if (show && sidebarColorDark && sidebarColorLight) {
  //     sidebarColorDark.checked = false;
  //     sidebarColorLight.checked = false;
  //   }
  // }, [show]);

  const selectLayoutState = (state: any) => state.Layout;
  const selectLayoutProperties = createSelector(selectLayoutState, (layout) => ({
    layoutType: layout.layoutType,
    leftSidebarType: layout.leftSidebarType,
    layoutModeType: layout.layoutModeType,
    layoutWidthType: layout.layoutWidthType,
    layoutPositionType: layout.layoutPositionType,
    topbarThemeType: layout.topbarThemeType,
    leftsidbarSizeType: layout.leftsidbarSizeType,
    leftSidebarViewType: layout.leftSidebarViewType,
    leftSidebarImageType: layout.leftSidebarImageType,
    preloader: layout.preloader,
    sidebarVisibilitytype: layout.sidebarVisibilitytype,
  }));
  // Inside your component
  const {  preloader } = useSelector(selectLayoutProperties);

  window.onscroll = function () {
    scrollFunction();
  };

  const scrollFunction = () => {
    const element = document.getElementById("back-to-top");
    if (element) {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  };

  const toTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const pathName = props.router.location.pathname;

  useEffect(() => {
    const preloader = document.getElementById("preloader") as HTMLElement;

    if (preloader) {
      preloader.style.opacity = "1";
      preloader.style.visibility = "visible";

      setTimeout(function () {
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
      }, 1000);
    }
  }, [preloader, pathName]);

  return (
    <React.Fragment>
      <button onClick={() => toTop()} className="btn btn-danger btn-icon" id="back-to-top">
        <i className="ri-arrow-up-line"></i>
      </button>

      {preloader === "enable" && (
        <div id="preloader">
          <div id="status">
            <div className="spinner-border text-primary avatar-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default withRouter(RightSidebar);
