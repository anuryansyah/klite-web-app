import { getMenuAccess } from "helpers/api/user";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  // const history = useNavigate();
  //state data
  // const [isDashboard, setIsDashboard] = useState(false);

  // const [iscurrentState, setIscurrentState] = useState('Dashboard');

  // function updateIconSidebar(e: any) {
  //     if (e && e.target && e.target.getAttribute("sub-items")) {
  //         const ul: any = document.getElementById("two-column-menu");
  //         const iconItems = ul.querySelectorAll(".nav-icon.active");
  //         let activeIconItems = [...iconItems];
  //         activeIconItems.forEach((item) => {
  //             item.classList.remove("active");

  //             var id = item.getAttribute("sub-items");
  //             const getID = document.getElementById(id) as HTMLElement
  //             if (getID)
  //                 getID.classList.remove("show");
  //         });
  //     }
  // }

  // useEffect(() => {
  //     document.body.classList.remove('twocolumn-panel');
  //     if (iscurrentState !== 'Dashboard') {
  //         setIsDashboard(false);
  //     }
  // }, [
  //     history,
  //     iscurrentState,
  //     isDashboard,
  // ]);

  // const menuItems: any = [
  //     {
  //         id: "dashboard",
  //         label: "Dashboards",
  //         icon: "bx bxs-dashboard",
  //         link: "/#",
  //         // stateVariables: isDashboard,
  //         click: function (e: any) {
  //             e.preventDefault();
  //             // setIsDashboard(!isDashboard);
  //             // setIscurrentState('Dashboard');
  //             // updateIconSidebar(e);
  //         },
  //         subItems: [
  //             {
  //                 id: "analytics",
  //                 label: "Analytics",
  //                 link: "/dashboard-analytics",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "crm",
  //                 label: "CRM",
  //                 link: "/dashboard-crm",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "ecommerce",
  //                 label: "Ecommerce",
  //                 link: "/dashboard",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "crypto",
  //                 label: "Crypto",
  //                 link: "/dashboard-crypto",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "projects",
  //                 label: "Projects",
  //                 link: "/dashboard-projects",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "nft",
  //                 label: "NFT",
  //                 link: "/dashboard-nft",
  //                 parentId: "dashboard",
  //             },
  //             {
  //                 id: "job",
  //                 label: "Job",
  //                 link: "/dashboard-job",
  //                 parentId: "dashboard",
  //                 // badgeColor: "success",
  //                 // badgeName: "New",
  //             },
  //         ],
  //     },
  // ];

  const [menuItems, setMenuItems] = useState<any>([]);

  useEffect(() => {
    const getMenu = async () => {
			await getMenuAccess()
        .then((res: any) => {
          const tempMenu: any[] = [];

          res.map((menu: any) => {
            tempMenu.push({
              icon: menu.icon,
              label: menu.label,
              id: menu.id,
              isParent: menu.isParent,
              subItems: menu.subItems || null,
              link: menu.link,
              click: menu.isParent && function (e: any) {
                  e.preventDefault();
              }
            })
          })
          
          setMenuItems(tempMenu);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getMenu();
  }, []);

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
