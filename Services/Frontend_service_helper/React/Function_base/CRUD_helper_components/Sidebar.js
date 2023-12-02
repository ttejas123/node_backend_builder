const generateSideBarMenue = () => {
    return (
      `
      /* eslint-disable react/prop-types */
import { useState } from "react";
import { NavItem, NavLink, Nav } from "reactstrap";

const SideBar = ({ toggle, sidebarItems }) => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className={"row"} style={{height: "100vh"}}>
      <div className="sidebar-header col-2 my-auto" style={{borderRight: "1px solid #000"}}>
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <h3>Sidebar</h3>
        <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          {sidebarItems.map((item) => (
            <>
             
                <NavItem>
                  <NavLink
                    tag={'a'}
                    style={{cursor: "pointer"}}
                    to={item.target}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.title}
                  </NavLink>
                </NavItem>
            </>
          ))}
        </Nav>
      </div>
      </div>
      <div className="col-10">
      {selectedItem && <selectedItem.component />}
      </div>
    </div>
  );
};

export default SideBar;
      `
    )
  }

module.exports = generateSideBarMenue;